package com.hotstar.planner.dto;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class PlannedSubProject extends SubProject {
    Integer actualStartWeekId;
    Integer actualEndWeekId;

    Map<String, List<Integer>> memberWeekAllocation;
    List<String> dependeeSubprojectIds;

}
