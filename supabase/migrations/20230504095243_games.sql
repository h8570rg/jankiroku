alter table "public"."matches" drop constraint "matches_created_by_fkey";

alter table "public"."participants" drop constraint "participants_user_id_fkey";

alter table "public"."scores" drop constraint "scores_user_id_fkey";

alter table "public"."test" drop constraint "test_pkey";

drop index if exists "public"."test_pkey";

drop table "public"."test";

alter table "public"."games" add column "created_at" timestamp with time zone not null default now();

alter table "public"."games" alter column "id" set default uuid_generate_v4();

alter table "public"."matches" alter column "created_at" set default now();

alter table "public"."matches" alter column "id" set default uuid_generate_v4();

alter table "public"."participants" alter column "id" set default uuid_generate_v4();

alter table "public"."profiles" drop column "first_name";

alter table "public"."profiles" drop column "last_name";

alter table "public"."profiles" add column "name" text;

alter table "public"."scores" alter column "id" set default uuid_generate_v4();

alter table "public"."matches" add constraint "matches_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."matches" validate constraint "matches_created_by_fkey";

alter table "public"."participants" add constraint "participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."participants" validate constraint "participants_user_id_fkey";

alter table "public"."scores" add constraint "scores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."scores" validate constraint "scores_user_id_fkey";


