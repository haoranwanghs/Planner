package com.hotstar.planner.service;

import com.hotstar.planner.dto.PlannedProject;
import com.hotstar.planner.dto.PlannedSubProject;
import com.hotstar.planner.dto.Report;
import com.hotstar.planner.dto.UnplannedSubProject;
import com.hotstar.planner.entities.Member;
import com.hotstar.planner.entities.Project;
import com.hotstar.planner.entities.SubProject;
import com.hotstar.planner.repository.MemberRepository;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ReporterProxy {
    MemberRepository memberRepository;
    ProjectService projectService;
    SubProjectService subProjectService;

    public Report generate() {
        Reportor reportor = buildReporter();
        reportor.generate();
        return convertToDto(reportor);

    }

    private Map<String, List<String>>  buildSkillMap() {
        Map<String, List<String>> skillMap = new HashMap<>();
        List<Member> members = memberRepository.findAll();
        for (Member member : members) {
            List<String> list;
            if (skillMap.containsKey(member.getTag())) {
                list = skillMap.get(member.getTag());
            } else {
                list = new LinkedList<>();
                skillMap.put(member.getTag(), list);
            }
            list.add(member.getName());
        }
        return skillMap;
    }

    private Map<String, Set<Integer>> buildUserPlan() {
        List<Member> members = memberRepository.findAll();
        Map<String, Set<Integer>> userPlan = new HashMap<>();
        members.forEach(t -> userPlan.put(t.getName(), new HashSet<>()));
        return userPlan;
    }

    private Reportor buildReporter() {
        List<SubProject> subProjectEntities = subProjectService.listSubProjects();
        Map<String, List<String>> skillMap = buildSkillMap();
        Map<String, SubProject> subProjectEntityMap = new HashMap<>();// id to entity
        Map<String, Reportor.Subproject> subProjects = new HashMap<>();// name to subProject
        Map<String, Reportor.Project> projectMap = new HashMap<>();// name to project

        for (SubProject subProject : subProjectEntities) {// build sub project map
            subProjectEntityMap.put(subProject.getId(), subProject);
            Reportor.Subproject rs = Reportor.Subproject.builder()
                .name(subProject.getName())
                .projectName(subProject.getProject().getName())
                .members(skillMap.get(subProject.getRequiredMemberTag()))
                .schedule(new Reportor.Schedule(subProject.getEarliestStartWeekId(), subProject.getLatestCompleteWeekId()))
                .total(subProject.getManWeekEstimation())
                .Dependencies(new LinkedList<>())
                .build();
            subProjects.put(rs.getName(), rs);
        }

        for (SubProject subProjectEntity : subProjectEntities) {// add dependencies
            for (String id : subProjectEntity.getDependsOnSubProjectIds()) {
                Reportor.Subproject dependency = subProjects.get(subProjectEntityMap.get(id).getName());
                Reportor.Subproject currentSubProject = subProjects.get(subProjectEntity.getName());
                currentSubProject.getDependencies().add(dependency);
            }
        }

        for (SubProject subProjectEntity : subProjectEntities) {// build Reporter.Project
            if (projectMap.containsKey(subProjectEntity.getProject().getName())) {
                projectMap.get(subProjectEntity.getProject().getName()).getSubprojects().add(subProjects.get(subProjectEntity.getName()));
            } else {
                Reportor.Project project = Reportor.Project.builder()
                    .name(subProjectEntity.getProject().getName())
                    .priority(subProjectEntity.getProject().getPriority())
                    .subprojects(new LinkedList<>()).build();
                project.getSubprojects().add(subProjects.get(subProjectEntity.getName()));
                projectMap.put(project.getName(), project);
            }
        }

        return new Reportor(subProjects, projectMap, buildUserPlan());

    }



    private Map<String, Project> getNameToProjectEntity() {
        return projectService.listProjects().stream().collect(Collectors.toMap(Project::getName, Function.identity()));
    }

    private Map<String, SubProject> getNameToSubProjectEntity() {
        return subProjectService.listSubProjects().stream().collect(Collectors.toMap(SubProject::getName, Function.identity()));
    }

    private Map<String, Member> getNameToMemberEntity() {
        return memberRepository.findAll().stream().collect(Collectors.toMap(Member::getName, Function.identity()));
    }

    private Report convertToDto(Reportor reportor) {
        Map<String, Reportor.PlannedProject> finalPlannedProjectMap = reportor.getFinalPlannedProjectMap();
        Map<String, Project> nameToProjectEntity = getNameToProjectEntity();
        Map<String, SubProject> nameToSubProjectEntity = getNameToSubProjectEntity();
        Map<String, Member> nameToMemberEntity = getNameToMemberEntity();
        List<PlannedProject> plannedProjectList = new LinkedList<>();
        for (Reportor.PlannedProject plannedProject : finalPlannedProjectMap.values()) {
            PlannedProject project = getPlannedProject(plannedProject, nameToProjectEntity, nameToSubProjectEntity, nameToMemberEntity);
            plannedProjectList.add(project);
        }


        Map<String, List<UnplannedSubProject>> unplannedSubProjectMap = new HashMap<>();
        for (SubProject subProject : nameToSubProjectEntity.values()) {
            if (!reportor.getFinalPlannedSubprojectMap().containsKey(subProject.getName())) {
                UnplannedSubProject unplannedSubProject = new UnplannedSubProject(subProject, "not enough resource");
                List<UnplannedSubProject> list;
                if (unplannedSubProjectMap.containsKey(unplannedSubProject.getProjectId())) {
                    list = unplannedSubProjectMap.get(unplannedSubProject.getProjectId());
                } else {
                    list = new LinkedList<>();
                    unplannedSubProjectMap.put(unplannedSubProject.getProjectId(), list);
                }
                list.add(unplannedSubProject);
            }
        }


        return Report.builder()
            .plannedProjects(plannedProjectList)
            .unplannedProjects(unplannedSubProjectMap)
            .build();

    }

    private PlannedProject getPlannedProject(Reportor.PlannedProject finalPlannedProject,
                                             Map<String, Project> nameToProjectEntity,
                                             Map<String, SubProject> nameToSubProjectEntity,
                                             Map<String, Member> nameToMemberEntity) {
        Project projectEntity = nameToProjectEntity.get(finalPlannedProject.getProject().getName());
        Map<Member, List<PlannedSubProject>> memberListMap = getMemberPlannedSubProjectsMap(finalPlannedProject, nameToSubProjectEntity, nameToMemberEntity);
        return PlannedProject.builder()
            .id(projectEntity.getId())
            .name(projectEntity.getName())
            .priority(projectEntity.getPriority())
            .subProjectIds(projectEntity.getSubProjects().stream().map(SubProject::getId).collect(Collectors.toList()))
            .memberPlannedSubProjectsMap(memberListMap)
            .build();
    }

    private Map<Member, List<PlannedSubProject>> getMemberPlannedSubProjectsMap(Reportor.PlannedProject finalPlannedProject,
                                                                                Map<String, SubProject> nameToSubProjectEntity,
                                                                                Map<String, Member> nameToMemberEntity) {
        Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap = new HashMap<>();

        for (Reportor.PlannedSubproject plannedSubproject : finalPlannedProject.getSubprojects()) {
            String memberName = plannedSubproject.getAllocation().getMember();
            Member member = nameToMemberEntity.get(memberName);
            SubProject subProject = nameToSubProjectEntity.get(plannedSubproject.getSubproject().getName());
            Integer actualStart = plannedSubproject.getAllocation().getSchedule().getStartWeekId();
            Integer actualEnd = plannedSubproject.getAllocation().getSchedule().getEndWeekId();
            List<PlannedSubProject> plannedSubProjectList;
            if (memberPlannedSubProjectsMap.containsKey(member)) {
                plannedSubProjectList = memberPlannedSubProjectsMap.get(member);
            } else {
                plannedSubProjectList = new LinkedList<>();
                memberPlannedSubProjectsMap.put(member, plannedSubProjectList);
            }
            PlannedSubProject plannedSubProject = PlannedSubProject.builder()
                .id(subProject.getId())
                .name(subProject.getName())
                .projectId(subProject.getProjectId())
                .actualStartWeekId(actualStart)
                .actualEndWeekId(actualEnd)
                .dependsOnSubProjectIds(subProject.getDependsOnSubProjectIds())
                .dependeeSubprojectIds(null)
                .build();
            plannedSubProjectList.add(plannedSubProject);
        }
        return memberPlannedSubProjectsMap;
    }
}
