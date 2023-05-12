package com.hotstar.planner.request;

import java.util.List;
import lombok.Value;

@Value
public class SubProjectRequest {
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
