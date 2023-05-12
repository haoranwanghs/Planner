package com.hotstar.planner.controller;

import com.hotstar.planner.entities.Project;
import com.hotstar.planner.repository.ProjectRepository;
import com.hotstar.planner.request.ProjectRequest;
import com.hotstar.planner.service.ProjectService;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("project")
public class ProjectController {
    ProjectService projectService;

    @GetMapping
    public List<Project> listProjects() {
        return projectService.listProjects();
    }

    @PutMapping
    @Transactional
    public Project createOrUpdateProject(@RequestBody ProjectRequest projectRequest) {
        return projectService.createOrUpdateProject(projectRequest);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void removeProject(@PathVariable("id") String id) {
        projectService.deleteProject(id);
    }
}
