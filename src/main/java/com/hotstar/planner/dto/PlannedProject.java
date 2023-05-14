package com.hotstar.planner.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hotstar.planner.entities.Member;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlannedProject {
    String id;
    String name;
    Integer priority;
    List<String> subProjectIds;
    Integer earliestStartWeekId;
    Integer latestCompleteWeekId;
    Integer actualStartWeekId;
    Integer actualEndWeekId;
    Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap;
}
