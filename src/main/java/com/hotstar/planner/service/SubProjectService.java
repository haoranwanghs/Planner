package com.hotstar.planner.service;

import com.hotstar.planner.entities.Project;
import com.hotstar.planner.entities.SubProject;
import com.hotstar.planner.repository.ProjectRepository;
import com.hotstar.planner.repository.SubProjectRepository;
import com.hotstar.planner.request.SubProjectRequest;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class SubProjectService {
    ProjectRepository projectRepository;
    SubProjectRepository subProjectRepository;

    public List<SubProject> listSubProjects() {
        return subProjectRepository.findAll();
    }

    public List<SubProject> listSubProjects(String projectId) {
        return subProjectRepository.findByProjectId(projectId);
    }

    public SubProject createOrUpdateSubProject(SubProjectRequest request) {
        Optional<Project> project = projectRepository.findById(request.getProjectId());
        if (!project.isPresent()) {
            throw new RuntimeException("project not exist");
        }
        for (String dependsId : request.getDependsOnSubProjectIds()) {
            if (!subProjectRepository.existsById(dependsId)) {
                throw new RuntimeException("dependent sub-project not exist");
            }
        }
        SubProject subProject = SubProject.builder()
            .id(request.getId())
            .project(project.get())
            .name(request.getName())
            .priority(request.getPriority())
            .manWeekEstimation(request.getManWeekEstimation())
            .maxParallelDegree(request.getMaxParallelDegree())
            .earliestStartWeekId(request.getEarliestStartWeekId())
            .latestCompleteWeekId(request.getLatestCompleteWeekId())
            .dependsOnSubProjectIds(request.getDependsOnSubProjectIds())
            .requiredMemberTag(request.getRequiredMemberTag())
            .build();
        return subProjectRepository.saveAndFlush(subProject);
    }

    public void removeSubProject(String id) {
        subProjectRepository.deleteById(id);
    }
}
