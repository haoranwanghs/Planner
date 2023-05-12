package com.hotstar.planner.dto;

import java.util.List;
import lombok.Data;

@Data
public class PlannedProject {
    String id;
    String name;
    Integer priority;
    List<String> subProjectIds;
    Integer earliestStartWeekId;
    Integer latestCompleteWeekId;
    Integer actualStartWeekId;
    Integer actualEndWeekId;
    List<PlannedSubProject> plannedSubProjects;
}
