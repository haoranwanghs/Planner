package com.hotstar.planner.controller;

import com.hotstar.planner.entities.SubProject;
import com.hotstar.planner.request.SubProjectRequest;
import com.hotstar.planner.service.SubProjectService;
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
@RequestMapping("subproject")
public class SubProjectController {
    SubProjectService subProjectService;

    @GetMapping
    public List<SubProject> listSubProjects() {
        return subProjectService.listSubProjects();
    }

    @GetMapping("/{id}")
    public List<SubProject> listSubProjects(@PathVariable("id") String projectId) {
        return subProjectService.listSubProjects(projectId);
    }

    @PutMapping
    @Transactional
    public SubProject createOrUpdateSubProject(@RequestBody SubProjectRequest subProjectRequest) {
        return subProjectService.createOrUpdateSubProject(subProjectRequest);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void removeSubProject(@PathVariable("id") String id) {
        subProjectService.removeSubProject(id);
    }

}
