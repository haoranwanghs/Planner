package com.hotstar.planner.repository;

import com.hotstar.planner.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, String> {
}
