package com.hotstar.planner.dto;

import com.hotstar.planner.entities.Member;
import java.util.List;
import java.util.Map;
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
    Map<Member, List<PlannedSubProject>> memberPlannedSubProjectsMap;
}
