package com.hotstar.planner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotstar.planner.repository.StringListConverter;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@Builder
@Table(name = "sub_projects")
@NoArgsConstructor
@AllArgsConstructor
public class SubProject {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    String id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "project_id", nullable = false, insertable = false, updatable = false)
    Project project;

    @Column(name = "project_id", nullable = false, updatable = false)
    String projectId;

    @Column(name = "name")
    String name;

    @Column(name = "priority")
    Integer priority;

    @Column(name = "man_week_estimation")
    Integer manWeekEstimation;

    @Column(name = "max_parallel_degree")
    Integer maxParallelDegree;  // = 1

    @Column(name = "earliest_start_week_id")
    Integer earliestStartWeekId;

    @Column(name = "latest_complete_week_id")
    Integer latestCompleteWeekId;

    @Convert(converter = StringListConverter.class)
    @Column(name = "depends_on_sub_project_ids", columnDefinition = "TEXT")
    List<String> dependsOnSubProjectIds;

    @Column(name = "required_member_tag")
    String requiredMemberTag;
}
