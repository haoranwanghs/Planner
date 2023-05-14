package com.hotstar.planner.service;

import com.hotstar.planner.dto.PlannedProject;
import com.hotstar.planner.dto.PlannedSubProject;
import com.hotstar.planner.dto.Report;
import com.hotstar.planner.dto.UnplannedSubProject;
import com.hotstar.planner.entities.Member;
import com.hotstar.planner.repository.MemberRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ReportService {
    MemberRepository memberRepository;
    ProjectService projectService;
    SubProjectService subProjectService;

    public Report generate(Integer deadlineWeekId) {
        Report report = Report.builder().deadLineWeekId(deadlineWeekId).build();
        return report;
    }



    public Report mock() {
        List<PlannedProject> plannedProjects = new LinkedList<>();
        Member member1 = Member.builder().name("member1").tag("pm").build();
        Member member2 = Member.builder().name("member2").tag("backend").build();
        Member member3 = Member.builder().name("member3").tag("frontend").build();


//        Map<String, List<Integer>> memberWeekAllocation1 = new HashMap<>();
//        memberWeekAllocation1.put(member1.getName(), null);
        PlannedSubProject plannedSubProject1 = PlannedSubProject.builder()
            .id("uuid1")
            .projectId("uuid1")
            .name("A-prd")
            .manWeekEstimation(1)
            .actualStartWeekId(1)
            .actualEndWeekId(1)
//            .memberWeekAllocation(memberWeekAllocation1)
            .dependeeSubprojectIds(Collections.singletonList("uuid2"))
            .build();

//        Map<String, List<Integer>> memberWeekAllocation2 = new HashMap<>();
//        memberWeekAllocation2.put(member2.getName(), null);
        PlannedSubProject plannedSubProject2 = PlannedSubProject.builder()
            .id("uuid2")
            .projectId("uuid2")
            .name("A-dev")
            .manWeekEstimation(1)
            .actualStartWeekId(2)
            .actualEndWeekId(3)
//            .memberWeekAllocation(memberWeekAllocation2)
            .dependsOnSubProjectIds(Collections.singletonList("uuid1"))
            .build();

        Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap1 = new HashMap<>();
        memberPlannedSubProjectsMap1.put(member1, Arrays.asList(plannedSubProject1));
        memberPlannedSubProjectsMap1.put(member2, Arrays.asList(plannedSubProject2));

        // ------------------
        //        Map<String, List<Integer>> memberWeekAllocation1 = new HashMap<>();
        //        memberWeekAllocation1.put(member1.getName(), null);
        PlannedSubProject plannedSubProject3 = PlannedSubProject.builder()
            .id("uuid3")
            .projectId("uuid2")
            .name("B-prd")
            .manWeekEstimation(1)
            .actualStartWeekId(2)
            .actualEndWeekId(2)
            //            .memberWeekAllocation(memberWeekAllocation1)
            .dependeeSubprojectIds(Collections.singletonList("uuid2"))
            .build();

        //        Map<String, List<Integer>> memberWeekAllocation2 = new HashMap<>();
        //        memberWeekAllocation2.put(member2.getName(), null);
        PlannedSubProject plannedSubProject4 = PlannedSubProject.builder()
            .id("uuid4")
            .projectId("uuid2")
            .name("B-dev1")
            .manWeekEstimation(1)
            .actualStartWeekId(4)
            .actualEndWeekId(4)
            //            .memberWeekAllocation(memberWeekAllocation2)
            .dependsOnSubProjectIds(Collections.singletonList("uuid3"))
            .dependeeSubprojectIds(Collections.singletonList("uuid5"))
            .build();

        //        Map<String, List<Integer>> memberWeekAllocation2 = new HashMap<>();
        //        memberWeekAllocation2.put(member2.getName(), null);
        PlannedSubProject plannedSubProject5 = PlannedSubProject.builder()
            .id("uuid5")
            .projectId("uuid2")
            .name("B-dev2")
            .manWeekEstimation(1)
            .actualStartWeekId(5)
            .actualEndWeekId(6)
            //            .memberWeekAllocation(memberWeekAllocation2)
            .dependsOnSubProjectIds(Collections.singletonList("uuid4"))
            .build();

        Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap2 = new HashMap<>();
        memberPlannedSubProjectsMap2.put(member1, Collections.singletonList(plannedSubProject3));
        memberPlannedSubProjectsMap2.put(member2, Collections.singletonList(plannedSubProject4));
        memberPlannedSubProjectsMap2.put(member3, Collections.singletonList(plannedSubProject5));


        PlannedProject plannedProject1 = PlannedProject.builder()
            .id("uuid1")
            .name("A")
            .priority(1)
            .actualStartWeekId(1)
            .actualEndWeekId(3)
            .earliestStartWeekId(1)
            .latestCompleteWeekId(4)
            .subProjectIds(Arrays.asList("uuid1", "uuid2"))
            .memberPlannedSubProjectsMap(memberPlannedSubProjectsMap1).build();

        PlannedProject plannedProject2 = PlannedProject.builder()
            .id("uuid2")
            .name("B")
            .priority(2)
            .actualStartWeekId(2)
            .actualEndWeekId(6)
            .earliestStartWeekId(1)
            .latestCompleteWeekId(8)
            .subProjectIds(Arrays.asList("uuid3", "uuid4", "uuid5"))
            .memberPlannedSubProjectsMap(memberPlannedSubProjectsMap2).build();

        plannedProjects.add(plannedProject1);
        plannedProjects.add(plannedProject2);

        Map<String, List<UnplannedSubProject>> unplannedProjects = new HashMap<>();
        UnplannedSubProject unplannedSubProject1 = UnplannedSubProject.builder()
            .id("uuid6")
            .projectId("uuid3")
            .name("C-prd")
            .manWeekEstimation(1)
            .reason("not enough resource")
            .priority(3)
            .build();

        UnplannedSubProject unplannedSubProject2 = UnplannedSubProject.builder()
            .id("uuid7")
            .projectId("uuid3")
            .name("C-dev")
            .manWeekEstimation(1)
            .reason("not enough resource")
            .priority(3)
            .build();

        unplannedProjects.put("uuid3", Arrays.asList(unplannedSubProject1, unplannedSubProject2));


        return Report.builder()
            .deadLineWeekId(8)
            .plannedProjects(plannedProjects)
            .unplannedProjects(unplannedProjects).build();
    }
}
