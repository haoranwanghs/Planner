package com.hotstar.planner.dto;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class Report {
    Integer DeadLineWeekId;
    List<PlannedProject> plannedProjects;
    Map<String, List<UnplannedSubProject>> unplannedProjects;
    // key: project id -> value: UnplannedSubProjects
}
