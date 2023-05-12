package com.hotstar.planner.service;

import com.hotstar.planner.entities.Project;
import com.hotstar.planner.repository.ProjectRepository;
import com.hotstar.planner.request.ProjectRequest;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ProjectService {
    ProjectRepository projectRepository;

    public List<Project> listProjects() {
        return projectRepository.findAll();
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }

    public Project createOrUpdateProject(ProjectRequest request) {
        Project project = Project.builder()
            .id(request.getId())
            .name(request.getName())
            .priority(request.getPriority())
            .earliestStartWeekId(request.getEarliestStartWeekId())
            .latestCompleteWeekId(request.getLatestCompleteWeekId())
            .build();
        return projectRepository.saveAndFlush(project);
    }
}
