package com.hotstar.planner.controller;

import com.hotstar.planner.dto.Report;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("report")
public class ReportController {
    @GetMapping
    public Report generate(Integer deadlineWeekId) {
        return new Report();
    }
}
