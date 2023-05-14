package com.hotstar.planner.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;

@Getter
public class Reportor {
    private Map<String, Subproject> subprojects;
    private Map<String, Project> projectMap;

    private Map<String, PlannedSubproject> finalPlannedSubprojectMap;
    private Map<String, PlannedProject> finalPlannedProjectMap;
    private Map<String, Set<Integer>> finalUserPlan;

    public Reportor(Map<String, Subproject> subprojects, Map<String, Project> projectMap, Map<String, Set<Integer>> finalUserPlan) {
        this.subprojects = subprojects;
        this.projectMap = projectMap;
        this.finalPlannedSubprojectMap = new HashMap<>();
        this.finalPlannedProjectMap = new HashMap<>();
        this.finalUserPlan = finalUserPlan;
    }

    @Data
    @Builder
    static class Allocation {
        private String member;
        private Schedule schedule;
    }

    @Data
    @Builder
    static class Schedule {
        private int startWeekId;
        private int endWeekId;
    }

    @Data
    @Builder
    static class Subproject {
        private final String name;
        private final String projectName;
        private final List<String> members;

        private final Schedule schedule;
        private final int total;
        private final List<Subproject> Dependencies;
    }

    @Data
    @Builder
    static class Project {
        private final String name;
        private final List<Subproject> subprojects;
        private final Integer priority;
    }

    @Data
    @Builder
    static class PlannedSubproject {
        private final Subproject subproject;
        private final Allocation allocation;
    }

    @Data
    @Builder
    static class PlannedProject {
        private final Project project;
        private final Boolean isCompleted;
        private final List<PlannedSubproject> subprojects;
    }

    public void generate() {
        List<Project> projects = this.projectMap.values().stream()
            .sorted(Comparator.comparingInt(a -> a.priority))
            .collect(Collectors.toList());

        for (Project project : projects) {
            plan(project);
        }

        doGenerate(projects);
    }

    void doGenerate(List<Project> projects) {
        for (Project project : projects) {
            boolean isComplete = true;

            List<PlannedSubproject> plannedSubProjects = new ArrayList<>();
            for (Subproject subproject : project.getSubprojects()) {
                PlannedSubproject plannedSubproject =
                    finalPlannedSubprojectMap.get(subproject.name);
                if (plannedSubproject != null) {
                    plannedSubProjects.add(finalPlannedSubprojectMap.get(subproject.name));
                } else {
                    isComplete = false;
                }
            }

            PlannedProject plannedProject = PlannedProject.builder()
                .project(project)
                .isCompleted(isComplete)
                .subprojects(plannedSubProjects)
                .build();

            finalPlannedProjectMap.put(project.name, plannedProject);
        }
    }

    Boolean plan(Project project) {
        if (finalPlannedProjectMap.containsKey(project.name)) {
            return true;
        }

        Map<String, PlannedSubproject> plannedSubprojectMap =
            new HashMap<>(finalPlannedSubprojectMap);
        Map<String, Set<Integer>> userPlan = finalUserPlan.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> new HashSet<>(e.getValue())));

        for (Subproject subproject : project.subprojects) {
            if (plan(subproject, plannedSubprojectMap, userPlan) == null) {
                return false;
            }
        }

        finalPlannedSubprojectMap = plannedSubprojectMap;
        finalUserPlan = userPlan;
        return true;
    }

    Allocation plan(Subproject subproject, Map<String, PlannedSubproject> plannedSubprojectMap,
                    Map<String, Set<Integer>> userPlan) {
        if (plannedSubprojectMap.containsKey(subproject.name)) {
            return plannedSubprojectMap.get(subproject.name).allocation;
        }

        int earliest = subproject.schedule.startWeekId;
        for (Subproject dependency : subproject.getDependencies()) {
            Allocation allocation = plan(dependency, plannedSubprojectMap, userPlan);
            if (allocation != null) {
                if (allocation.schedule.endWeekId + 1 > earliest) {
                    earliest = allocation.schedule.endWeekId + 1;
                }
            } else {
                return null;
            }
        }

        return planWithoutDependency(subproject, plannedSubprojectMap, userPlan, earliest);
    }

    Allocation planWithoutDependency(Subproject subproject, Map<String, PlannedSubproject> plannedSubprojectMap,
                    Map<String, Set<Integer>> userPlan, int earliest) {
        for (String member : subproject.members) {
            Allocation allocation = tryPlan(member, userPlan.get(member),
                earliest, subproject.schedule.endWeekId, subproject.total);
            if (allocation != null) {
                plannedSubprojectMap.put(subproject.name,
                    PlannedSubproject.builder()
                        .subproject(subproject)
                        .allocation(allocation)
                        .build()
                );

                return allocation;
            }
        }

        return null;
    }

    Allocation tryPlan(String member, Set<Integer> userPlanned, int earliest, int end, int total) {
        for (int from = earliest; from <= end + 1 - total; ++from) {
            boolean possible = true;
            for (int i = from; i <= total; ++i) {
                if (userPlanned.contains(i)) {
                    possible = false;
                    break;
                }
            }

            if (possible) {
                for (int i = from; i <= total; ++i) {
                    userPlanned.add(i);
                }

                return Allocation.builder()
                    .member(member)
                    .schedule(
                        Schedule.builder()
                            .startWeekId(from)
                            .endWeekId(from + total - 1)
                            .build()
                    )
                    .build();
            }
        }

        return null;
    }
}
