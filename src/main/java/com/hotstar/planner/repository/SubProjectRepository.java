package com.hotstar.planner.repository;

import com.hotstar.planner.entities.SubProject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubProjectRepository extends JpaRepository<SubProject, String> {
    List<SubProject> findByProjectId(String id);
}
