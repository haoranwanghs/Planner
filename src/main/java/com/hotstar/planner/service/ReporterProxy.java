package com.hotstar.planner.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotstar.planner.dto.PlannedProject;
import com.hotstar.planner.entities.Member;
import com.hotstar.planner.entities.SubProject;
import com.hotstar.planner.repository.MemberRepository;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ReporterProxy {
    MemberRepository memberRepository;
    ProjectService projectService;
    SubProjectService subProjectService;

    public void generate() {
        Reportor reportor = buildReporter();
        reportor.generate();



        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println(objectMapper.writeValueAsString(reportor));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private Map<String, List<String>>  buildSkillMap() {
        Map<String, List<String>> skillMap = new HashMap<>();
        List<Member> members = memberRepository.findAll();
        for (Member member : members) {
            if (skillMap.containsKey(member.getTag())) {
                skillMap.get(member.getTag()).add(member.getName());
            } else {
                skillMap.put(member.getTag(), Collections.singletonList(member.getName()));
            }
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

//    private List<PlannedProject> convertToDto(Reportor reportor) {
//        Map<String, Reportor.PlannedProject> finalPlannedProjectMap = reportor.getFinalPlannedProjectMap();
//
//    }
//
//    private
}
