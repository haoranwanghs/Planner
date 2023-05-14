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

insert into members (name, tag) values ("user1", "backend");
insert into members (name, tag) values ("user2", "frontend");
insert into members (name, tag) values ("user3", "ios");
insert into members (name, tag) values ("user4", "pm");
insert into members (name, tag) values ("user5", "android");

insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("uuid1", "A", 1, 1, 4);
insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("uuid2", "B", 2, 1, 8);
insert into projects (id, name, priority, earliest_start_week_id, latest_complete_week_id) VALUES ("uuid3", "C", 3, 1, 8);


insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("uuid1", "A-prd", 3, "uuid1", 1, 1, 1, 4, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("uuid2", "A-dev", 3, "uuid1", 2, 1, 1, 4, "backend", "uuid1");

insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("uuid3", "B-prd", 1, "uuid2", 1, 1, 1, 8, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("uuid4", "B-dev1", 1, "uuid2", 1, 1, 1, 8, "backend", "uuid3");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("uuid5", "B-dev2", 1, "uuid2", 2, 1, 1, 8, "frontend", "uuid3");

insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag) VALUES
    ("uuid6", "C-prd", 1, "uuid3", 1, 1, 1, 8, "pm");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("uuid7", "C-dev1", 1, "uuid3", 1, 1, 1, 8, "backend", "uuid6");
insert into sub_projects(id, name, priority, project_id, man_week_estimation, max_parallel_degree, earliest_start_week_id, latest_complete_week_id, required_member_tag, depends_on_sub_project_ids) VALUES
    ("uuid8", "C-dev2", 1, "uuid3", 2, 1, 1, 8, "frontend", "uuid6");