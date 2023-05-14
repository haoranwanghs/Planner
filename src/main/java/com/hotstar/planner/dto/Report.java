package com.hotstar.planner.dto;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Report {
    Integer deadLineWeekId;
    List<PlannedProject> plannedProjects;
    Map<String, List<UnplannedSubProject>> unplannedProjects;
    // key: project id -> value: UnplannedSubProjects
}
