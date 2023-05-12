package com.hotstar.planner.dto;

import java.util.List;
import lombok.Data;

@Data
public class SubProject {
    String id;
    String projectId;
    String name;
    Integer priority;
    Integer manWeekEstimation;
    Integer maxParallelDegree;  // = 1
    Integer earliestStartWeekId;
    Integer latestCompleteWeekId;
    List<String> dependsOnSubProjectIds;
    String requiredMemberTag;
}
