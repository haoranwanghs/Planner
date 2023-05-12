package com.hotstar.planner.entities;

import com.hotstar.planner.repository.StringListConverter;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

//@Data
@Getter
@Setter
@Entity
@Builder
@Table(name = "projects")
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    String id;

    @Column(name = "name")
    String name;

    @Column(name = "priority")
    Integer priority;

    @OneToMany(mappedBy = "project", cascade = CascadeType.REMOVE)
    List<SubProject> subProjects;
//    @Convert(converter = StringListConverter.class)
//    @Column(name = "sub_project_ids", columnDefinition = "TEXT")
//    List<String> subProjectIds;

    @Column(name = "earliest_start_week_id")
    Integer earliestStartWeekId;

    @Column(name = "latest_complete_week_id")
    Integer latestCompleteWeekId;

}
