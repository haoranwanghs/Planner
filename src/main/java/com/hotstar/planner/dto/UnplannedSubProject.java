package com.hotstar.planner.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UnplannedSubProject extends SubProject{
    String reason;

//    public UnplannedSubProject(com.hotstar.planner.entities.SubProject subProject, String reason) {
//        this.id = subProject.getId();
//        this.projectId = subProject.getProject().getId();
//        this.name = subProject.getName();
//        this.priority = subProject.getPriority();
//        this.manWeekEstimation = subProject.getManWeekEstimation();
//        this.maxParallelDegree = subProject.getMaxParallelDegree();  // = 1
//        this.earliestStartWeekId = subProject.getEarliestStartWeekId();
//        this.latestCompleteWeekId = subProject.getLatestCompleteWeekId();
//        this.dependsOnSubProjectIds = subProject.getDependsOnSubProjectIds();
//        this.requiredMemberTag = subProject.getRequiredMemberTag();
//        this.reason = reason;
//    }
}
