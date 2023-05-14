package com.hotstar.planner.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlannedSubProject extends SubProject {
    Integer actualStartWeekId;
    Integer actualEndWeekId;
    Map<String, List<Integer>> memberWeekAllocation;
    List<String> dependeeSubprojectIds;

}
