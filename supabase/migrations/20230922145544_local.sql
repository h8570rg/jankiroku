drop policy "Enable all for authenticated users only" on "public"."participants";

alter table "public"."matches_users" drop constraint "matches_users_match_id_fkey";

alter table "public"."matches_users" drop constraint "matches_users_user_id_fkey";

alter table "public"."participants" drop constraint "participants_match_id_fkey";

alter table "public"."participants" drop constraint "participants_user_id_fkey";

alter table "public"."matches" drop constraint "matches_created_by_fkey";

alter table "public"."matches" drop constraint "matches_updated_by_fkey";

alter table "public"."rules" drop constraint "rules_created_by_fkey";

alter table "public"."rules" drop constraint "rules_updated_by_fkey";

alter table "public"."matches_users" drop constraint "matches_users_pkey";

alter table "public"."participants" drop constraint "participants_pkey";

drop index if exists "public"."matches_users_pkey";

drop index if exists "public"."participants_pkey";

drop table "public"."matches_users";

drop table "public"."participants";

create table "public"."matches_profiles" (
    "match_id" uuid not null,
    "user_id" uuid not null default auth.uid()
);


alter table "public"."matches_profiles" enable row level security;

alter table "public"."profiles" add column "janrecoId" text;

CREATE UNIQUE INDEX matches_profiles_pkey ON public.matches_profiles USING btree (user_id, match_id);

alter table "public"."matches_profiles" add constraint "matches_profiles_pkey" PRIMARY KEY using index "matches_profiles_pkey";

alter table "public"."matches_profiles" add constraint "matches_profiles_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."matches_profiles" validate constraint "matches_profiles_match_id_fkey";

alter table "public"."matches_profiles" add constraint "matches_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."matches_profiles" validate constraint "matches_profiles_user_id_fkey";

alter table "public"."matches" add constraint "matches_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."matches" validate constraint "matches_created_by_fkey";

alter table "public"."matches" add constraint "matches_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(id) not valid;

alter table "public"."matches" validate constraint "matches_updated_by_fkey";

alter table "public"."rules" add constraint "rules_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."rules" validate constraint "rules_created_by_fkey";

alter table "public"."rules" add constraint "rules_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(id) not valid;

alter table "public"."rules" validate constraint "rules_updated_by_fkey";

create policy "Enableall for authenticated users only"
on "public"."matches_profiles"
as permissive
for all
to authenticated
using (true);



