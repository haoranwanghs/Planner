package com.hotstar.planner.request;

import lombok.Value;

@Value
public class ProjectRequest {
    String id;

    String name;

    Integer priority;

    Integer earliestStartWeekId;

    Integer latestCompleteWeekId;
}
