package com.hotstar.planner.repository;

import com.hotstar.planner.entities.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String> {
    Member findByName(String name);

    void deleteByName(String name);
}
