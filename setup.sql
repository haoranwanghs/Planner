drop database if exists planner;
create database planner;
use planner;

create table `members`
(
    `name` varchar(255) NOT NULL,
    `tag`  varchar(255) NOT NULL,
    PRIMARY KEY (`name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


create table `projects`
(
    `id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `priority` int(10) DEFAULT 0,
    `earliest_start_week_id` int(3) NOT NULL ,
    `latest_complete_week_id`int(3) NOT NULL ,
    PRIMARY KEY (`id`),
    UNIQUE KEY `projects_name_UNIQUE` (`name`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

create table `sub_projects`
(
    `id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `project_id` varchar(255) NOT NULL,
    `priority` int(10) DEFAULT 0,
    `man_week_estimation` int(3) NOT NULL ,
    `max_parallel_degree` int(3) NOT NULL ,
    `earliest_start_week_id` int(3) NOT NULL ,
    `latest_complete_week_id`int(3) NOT NULL ,
    `depends_on_sub_project_ids` text DEFAULT NULL,
    `required_member_tag` varchar(255) NOT NULL ,
    PRIMARY KEY (`id`),
    UNIQUE KEY `sub_projects_project_id_name_UNIQUE` (`project_id`, `name`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

insert into members (name, tag) values ("pm1", "pm");
insert into members (name, tag) values ("pm2", "pm");
insert into members (name, tag) values ("backend1", "backend");
insert into members (name, tag) values ("backend2", "backend");
insert into members (name, tag) values ("backend3", "backend");
insert into members (name, tag) values ("frontend1", "frontend");
insert into members (name, tag) values ("frontend2", "frontend");
insert into members (name, tag) values ("ios1", "ios");
insert into members (name, tag) values ("android1", "android");

insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("project-uuid-A", "A", 3, 1, 8);
insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("project-uuid-B", "B", 1, 1, 8);
insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("project-uuid-C", "C", 2, 1, 8);
insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("project-uuid-D", "D", 2, 1, 8);


insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("A1", "A-prd", 3, "project-uuid-A", 1, 1, 1, 4, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("A2", "A-dev", 3, "project-uuid-A", 2, 1, 1, 4, "backend", "A1");

insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("B1", "B-prd", 1, "project-uuid-B", 1, 1, 1, 8, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("B2", "B-dev1", 1, "project-uuid-B", 1, 1, 1, 8, "backend", "B1");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("B3", "B-dev2", 1, "project-uuid-B", 2, 1, 1, 8, "frontend", "B1");

insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("C1", "C-prd", 1, "project-uuid-C", 1, 1, 1, 8, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("C2", "C-dev1", 1, "project-uuid-C", 1, 1, 1, 8, "backend", "C1");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("C3", "C-dev2", 1, "project-uuid-C", 2, 1, 1, 8, "frontend", "C2");

insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("D1", "D-prd", 1, "project-uuid-D", 1, 1, 1, 8, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("D2", "D-dev1", 1, "project-uuid-D", 1, 1, 1, 8, "backend", "D1");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("D3", "D-dev2", 1, "project-uuid-D", 1, 1, 1, 8, "backend", "D1");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("D4", "D-dev3", 1, "project-uuid-D", 2, 1, 1, 8, "frontend", "D2,D3");