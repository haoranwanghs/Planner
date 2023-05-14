package com.hotstar.planner.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
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
