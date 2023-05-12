package com.hotstar.planner.controller;

import com.hotstar.planner.entities.Member;
import com.hotstar.planner.repository.MemberRepository;
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
@RestController()
@RequestMapping("member")
public class MemberController {
    MemberRepository memberRepository;

    @GetMapping
    public List<Member> listMembers() {
        return memberRepository.findAll();
    }

    @PutMapping
    @Transactional
    public Member createOrUpdateMember(@RequestBody Member member) {
        return memberRepository.saveAndFlush(member);
    }

    @DeleteMapping("/{name}")
    @Transactional
    public void removeMember(@PathVariable("name") String name) {
        memberRepository.deleteByName(name);
    }
}
