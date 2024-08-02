create table preference
(
    id            INTEGER PRIMARY KEY,
    hmpps_user_id varchar(255) not null,
    name          varchar(255) not null,
    value         varchar(255) not null
)