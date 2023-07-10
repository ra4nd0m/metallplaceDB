create table "user"
(
    id   serial
        constraint user_pk
            primary key,
    username varchar not null unique,
    password varchar not null
);

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

create table material_group
(
    id   serial
        constraint material_group_pk
            primary key,
    name varchar not null
);

create table material_source
(
    id                serial
        constraint material_source_pk
            primary key,
    material_id       integer not null
        constraint material_source_material_fk
            references material
            on delete cascade,
    source_id         integer not null
        constraint material_source_source_fk
            references source
            on delete cascade,
    target_market     varchar not null,
    unit              varchar not null,
    delivery_type     varchar not null,
    material_group_id integer not null
        constraint material_source_material_group_id_fk
            references material_group,
    constraint material_source_material_id_source_id_target_market_unit_de_key
        unique (material_id, source_id, target_market, unit, delivery_type, material_group_id)
);


create table material_property
(
    id                 serial
        constraint material_property_pk
            primary key,
    material_source_id integer not null
        constraint material_property_material_source_id_fk
            references material_source,
    property_id        integer not null
        constraint material_property_property_fk
            references property,
    unique (material_source_id, property_id)
);


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
    on material_value (material_source_id, property_id, created_on);

CREATE OR REPLACE FUNCTION stamp_updated() RETURNS TRIGGER LANGUAGE 'plpgsql' AS $$
BEGIN
    NEW.last_updated := now();
    RETURN NEW;
END
$$;

ALTER TABLE material_value ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP;
DROP TRIGGER IF EXISTS material_value_stamp_updated on material_value;
CREATE TRIGGER material_value_stamp_updated
    BEFORE INSERT OR UPDATE ON material_value
    FOR EACH ROW EXECUTE PROCEDURE stamp_updated();
