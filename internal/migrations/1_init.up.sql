create table if not exists "user"
(
    id       serial
        constraint user_pk
            primary key,
    username varchar not null
        unique,
    password varchar not null
);

create table if not exists material
(
    id   serial
        constraint material_pk
            primary key,
    name varchar not null
);

create unique index if not exists material_name_uindex
    on material (name);

create table if not exists property
(
    id   serial
        constraint property_pk
            primary key,
    name varchar not null,
    kind varchar not null
);

create unique index if not exists property_name_uindex
    on property (name);

create table if not exists source
(
    id   serial
        constraint source_pk
            primary key,
    name varchar not null,
    url  varchar,
    kind varchar
);

create unique index if not exists source_name_uindex
    on source (name);

create table if not exists material_group
(
    id   serial
        constraint material_group_pk
            primary key,
    name varchar not null
);

create table if not exists unit
(
    id   serial
        constraint unit_pk
            primary key,
    name varchar not null
        constraint unit_name_unique
            unique
);

create table if not exists delivery_type
(
    id   serial
        constraint delivery_type_pk
            primary key,
    name varchar not null
        constraint delivery_type_unique
            unique
);

create table if not exists material_source
(
    id                serial
        constraint material_source_pk
            primary key,
    uid               integer not null
        unique,
    material_id       integer not null
        constraint material_source_material_fk
            references material
            on delete cascade,
    source_id         integer not null
        constraint material_source_source_fk
            references source
            on delete cascade,
    target_market     varchar not null,
    unit_id           integer not null
        constraint material_source_unit_id_fk
            references unit,
    delivery_type_id  integer not null
        constraint material_source_delivery_type_id_fk
            references delivery_type,
    material_group_id integer not null
        constraint material_source_material_group_id_fk
            references material_group,
    constraint material_source_material_id_source_id_target_market_unit_de_key
        unique (material_id, source_id, target_market, unit_id, delivery_type_id, material_group_id)
);

create table if not exists material_property
(
    id          serial
        constraint material_property_pk
            primary key,
    uid         integer not null
        constraint material_property_uid_fk
            references material_source,
    property_id integer not null
        constraint material_property_property_fk
            references property,
    unique (uid, property_id)
);

create table if not exists material_value
(
    id            serial
        constraint material_value_pk
            primary key,
    uid           integer not null
        constraint material_value_material_source_fk
            references material_source,
    property_id   integer not null
        constraint material_value_property_fk
            references property,
    value_decimal numeric,
    value_str     varchar,
    created_on    date    not null,
    last_updated  timestamp
);

create unique index if not exists material_value_id_uindex
    on material_value (id);

create unique index if not exists material_value_all_together_uindex
    on material_value (uid, property_id, created_on);

create trigger material_value_stamp_updated
    before insert or update
    on material_value
    for each row
execute procedure stamp_updated();