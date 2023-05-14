package com.hotstar.planner.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotstar.planner.dto.PlannedSubProject;
import com.hotstar.planner.dto.Report;
import com.hotstar.planner.entities.Member;
import com.hotstar.planner.entities.Project;
import com.hotstar.planner.entities.SubProject;
import com.hotstar.planner.repository.MemberRepository;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ReportService {
    MemberRepository memberRepository;
    ProjectService projectService;
    SubProjectService subProjectService;
    ReporterProxy reporterProxy;

    public Report generate(Integer deadlineWeekId) {
        return reporterProxy.generate();
    }

    private Map<Member, List<PlannedSubProject>> buildMemberBucket() {
        List<Member> members = memberRepository.findAll();
        Map<Member, List<PlannedSubProject>> memberBucket = new HashMap<>();
        for (Member member : members) {
            memberBucket.put(member, new LinkedList<>());
        }
        return memberBucket;
    }

    private Integer getAvailableWeek(List<PlannedSubProject> projects) {
        int week = 1;
        for (PlannedSubProject plannedSubProject : projects) {
            if (plannedSubProject.getActualEndWeekId() + 1 > week) {
                week = plannedSubProject.getActualEndWeekId() + 1;
            }
        }
        return week;
    }

    private Member getEarliestStartMemberWithTag(Map<Member, List<PlannedSubProject>> memberBucket, String tag) {
        Member chosenOne = null;
        Integer earliestStart = Integer.MAX_VALUE;
        for (Member member : memberBucket.keySet()) {
            if (member.getTag().equals(tag)) {
                Integer week = getAvailableWeek(memberBucket.get(member));
                if (week < earliestStart) {
                    earliestStart = week;
                    chosenOne = member;
                }
            }
        }
        return chosenOne;
    }

    private Integer scheduleSubProject(Map<Member, List<PlannedSubProject>> memberBucket, SubProject subProject, Integer earliestStart) {
        Member chosen = getEarliestStartMemberWithTag(memberBucket, subProject.getRequiredMemberTag());
        if (chosen != null) {
            Integer actualStartWeek = Integer.max(getAvailableWeek(memberBucket.get(chosen)), earliestStart);
            PlannedSubProject plannedSubProject = PlannedSubProject.builder()
                .id(subProject.getId())
                .dependsOnSubProjectIds(subProject.getDependsOnSubProjectIds())
                .name(subProject.getName())
                .projectId(subProject.getProjectId())
                .actualStartWeekId(actualStartWeek)
                .actualEndWeekId(actualStartWeek + subProject.getManWeekEstimation() - 1)
                .build();
            memberBucket.get(chosen).add(plannedSubProject);
            return actualStartWeek;
        }
        return -1;
    }


    public void func() {
        Map<String, Integer> subProjectStartWeek = new HashMap<>();
        Map<Member, List<PlannedSubProject>> memberBucket = buildMemberBucket();

        List<Project> projects = projectService.listProjects()
            .stream()
            .sorted(Comparator.comparingInt(Project::getPriority))
            .collect(Collectors.toList());

        List<SubProject> subProjectList = new LinkedList<>();
        for (Project project : projects) {
            subProjectList.addAll(project.getSubProjects());
        }
        while(subProjectStartWeek.size() != subProjectList.size()) {
            for (SubProject subProject : subProjectList) {
                if (!subProjectStartWeek.containsKey(subProject.getId())) {// if not scheduled yet
                    boolean noDependency = true;
                    Integer maxDependsEnd = 0;
                    for (String id : subProject.getDependsOnSubProjectIds()) {
                        if (!subProjectStartWeek.containsKey(id)) {
                            noDependency = false;
                            break;
                        } else {
                            maxDependsEnd = subProjectStartWeek.get(id) > maxDependsEnd ? subProjectStartWeek.get(id) : maxDependsEnd;
                        }
                    }
                    if (noDependency) {
                        Integer earliestStart = maxDependsEnd + 1;
                        Integer actualStart = scheduleSubProject(memberBucket, subProject, earliestStart);
                        if (actualStart != -1) {
                            subProjectStartWeek.put(subProject.getId(), actualStart);
                        }
                    }
                }
            }
        }
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println(objectMapper.writeValueAsString(memberBucket));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




//    public Report mock() {
//        List<PlannedProject> plannedProjects = new LinkedList<>();
//        Member member1 = Member.builder().name("member1").tag("pm").build();
//        Member member2 = Member.builder().name("member2").tag("backend").build();
//        Member member3 = Member.builder().name("member3").tag("frontend").build();
//
//
////        Map<String, List<Integer>> memberWeekAllocation1 = new HashMap<>();
////        memberWeekAllocation1.put(member1.getName(), null);
//        PlannedSubProject plannedSubProject1 = PlannedSubProject.builder()
//            .id("uuid1")
//            .projectId("uuid1")
//            .name("A-prd")
//            .manWeekEstimation(1)
//            .actualStartWeekId(1)
//            .actualEndWeekId(1)
////            .memberWeekAllocation(memberWeekAllocation1)
//            .dependeeSubprojectIds(Collections.singletonList("uuid2"))
//            .build();
//
////        Map<String, List<Integer>> memberWeekAllocation2 = new HashMap<>();
////        memberWeekAllocation2.put(member2.getName(), null);
//        PlannedSubProject plannedSubProject2 = PlannedSubProject.builder()
//            .id("uuid2")
//            .projectId("uuid2")
//            .name("A-dev")
//            .manWeekEstimation(1)
//            .actualStartWeekId(2)
//            .actualEndWeekId(3)
////            .memberWeekAllocation(memberWeekAllocation2)
//            .dependsOnSubProjectIds(Collections.singletonList("uuid1"))
//            .build();
//
//        Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap1 = new HashMap<>();
//        memberPlannedSubProjectsMap1.put(member1, Arrays.asList(plannedSubProject1));
//        memberPlannedSubProjectsMap1.put(member2, Arrays.asList(plannedSubProject2));
//
//        // ------------------
//        //        Map<String, List<Integer>> memberWeekAllocation1 = new HashMap<>();
//        //        memberWeekAllocation1.put(member1.getName(), null);
//        PlannedSubProject plannedSubProject3 = PlannedSubProject.builder()
//            .id("uuid3")
//            .projectId("uuid2")
//            .name("B-prd")
//            .manWeekEstimation(1)
//            .actualStartWeekId(2)
//            .actualEndWeekId(2)
//            //            .memberWeekAllocation(memberWeekAllocation1)
//            .dependeeSubprojectIds(Collections.singletonList("uuid2"))
//            .build();
//
//        //        Map<String, List<Integer>> memberWeekAllocation2 = new HashMap<>();
//        //        memberWeekAllocation2.put(member2.getName(), null);
//        PlannedSubProject plannedSubProject4 = PlannedSubProject.builder()
//            .id("uuid4")
//            .projectId("uuid2")
//            .name("B-dev1")
//            .manWeekEstimation(1)
//            .actualStartWeekId(4)
//            .actualEndWeekId(4)
//            //            .memberWeekAllocation(memberWeekAllocation2)
//            .dependsOnSubProjectIds(Collections.singletonList("uuid3"))
//            .dependeeSubprojectIds(Collections.singletonList("uuid5"))
//            .build();
//
//        //        Map<String, List<Integer>> memberWeekAllocation2 = new HashMap<>();
//        //        memberWeekAllocation2.put(member2.getName(), null);
//        PlannedSubProject plannedSubProject5 = PlannedSubProject.builder()
//            .id("uuid5")
//            .projectId("uuid2")
//            .name("B-dev2")
//            .manWeekEstimation(1)
//            .actualStartWeekId(5)
//            .actualEndWeekId(6)
//            //            .memberWeekAllocation(memberWeekAllocation2)
//            .dependsOnSubProjectIds(Collections.singletonList("uuid4"))
//            .build();
//
//        Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap2 = new HashMap<>();
//        memberPlannedSubProjectsMap2.put(member1, Collections.singletonList(plannedSubProject3));
//        memberPlannedSubProjectsMap2.put(member2, Collections.singletonList(plannedSubProject4));
//        memberPlannedSubProjectsMap2.put(member3, Collections.singletonList(plannedSubProject5));
//
//
//        PlannedProject plannedProject1 = PlannedProject.builder()
//            .id("uuid1")
//            .name("A")
//            .priority(1)
//            .actualStartWeekId(1)
//            .actualEndWeekId(3)
//            .earliestStartWeekId(1)
//            .latestCompleteWeekId(4)
//            .subProjectIds(Arrays.asList("uuid1", "uuid2"))
//            .memberPlannedSubProjectsMap(memberPlannedSubProjectsMap1).build();
//
//        PlannedProject plannedProject2 = PlannedProject.builder()
//            .id("uuid2")
//            .name("B")
//            .priority(2)
//            .actualStartWeekId(2)
//            .actualEndWeekId(6)
//            .earliestStartWeekId(1)
//            .latestCompleteWeekId(8)
//            .subProjectIds(Arrays.asList("uuid3", "uuid4", "uuid5"))
//            .memberPlannedSubProjectsMap(memberPlannedSubProjectsMap2).build();
//
//        plannedProjects.add(plannedProject1);
//        plannedProjects.add(plannedProject2);
//
//        Map<String, List<UnplannedSubProject>> unplannedProjects = new HashMap<>();
//        UnplannedSubProject unplannedSubProject1 = UnplannedSubProject.builder()
//            .id("uuid6")
//            .projectId("uuid3")
//            .name("C-prd")
//            .manWeekEstimation(1)
//            .reason("not enough resource")
//            .priority(3)
//            .build();
//
//        UnplannedSubProject unplannedSubProject2 = UnplannedSubProject.builder()
//            .id("uuid7")
//            .projectId("uuid3")
//            .name("C-dev")
//            .manWeekEstimation(1)
//            .reason("not enough resource")
//            .priority(3)
//            .build();
//
//        unplannedProjects.put("uuid3", Arrays.asList(unplannedSubProject1, unplannedSubProject2));
//
//
//        return Report.builder()
//            .deadLineWeekId(8)
//            .plannedProjects(plannedProjects)
//            .unplannedProjects(unplannedProjects).build();
//    }
}
