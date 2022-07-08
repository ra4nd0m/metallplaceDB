create table material
(
    id   serial
        constraint material_pk
            primary key,
    name varchar not null
);

create unique index material_name_uindex
    on material (name);

create table property
(
    id   serial
        constraint property_pk
            primary key,
    name varchar not null,
    kind varchar not null
);

create unique index property_name_uindex
    on property (name);

create table source
(
    id   serial
        constraint source_pk
            primary key,
    name varchar not null,
    url  varchar,
    kind varchar
);

create unique index source_name_uindex
    on source (name);

create table material_property
(
    id          serial
        constraint material_property_pk
            primary key,
    material_id integer not null
        constraint material_property_material_fk
            references material,
    property_id integer not null
        constraint material_property_property_fk
            references property,
    unique (material_id, property_id)
);

create table material_source
(
    id            serial
        constraint material_source_pk
            primary key,
    material_id   integer not null
        constraint material_source_material_fk
            references material
            on delete cascade,
    source_id     integer not null
        constraint material_source_source_fk
            references source
            on delete cascade,
    target_market varchar not null,
    unit          varchar not null,
    unique (material_id, source_id, target_market, unit)
);

create unique index material_source_uniq
    on material_source (material_id, source_id, target_market);

create table material_value
(
    id                 serial
        constraint material_value_pk
            primary key,
    material_source_id integer not null
        constraint material_value_material_source_fk
            references material_source,
    property_id        integer not null
        constraint material_value_property_fk
            references property,
    value_decimal      numeric,
    value_str          varchar,
    created_on         date    not null
);

create unique index material_value_id_uindex
    on material_value (id);

create unique index material_value_all_together_uindex
    on material_value (material_source_id, property_id, value_decimal, value_str, created_on);
