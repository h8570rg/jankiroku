drop policy "Enable all for authenticated users only" on "public"."matches";

drop policy "Enableall for authenticated users only" on "public"."matches_profiles";

alter table "public"."matches_profiles" drop constraint "matches_profiles_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."scores" drop constraint "scores_user_id_fkey";

alter table "public"."matches_profiles" drop constraint "matches_profiles_pkey";

drop index if exists "public"."matches_profiles_pkey";

alter table "public"."friends" alter column "profile_id_1" drop default;

alter table "public"."matches" alter column "created_by" drop default;

alter table "public"."matches" alter column "updated_by" drop default;

alter table "public"."matches_profiles" drop column "user_id";

alter table "public"."matches_profiles" add column "profile_id" uuid not null;

alter table "public"."profiles" alter column "id" set default gen_random_uuid();

alter table "public"."rules" alter column "created_by" drop default;

alter table "public"."rules" alter column "updated_by" drop default;

alter table "public"."scores" drop column "user_id";

alter table "public"."scores" add column "profile_id" uuid not null;

CREATE UNIQUE INDEX matches_profiles_pkey ON public.matches_profiles USING btree (profile_id, match_id);

alter table "public"."matches_profiles" add constraint "matches_profiles_pkey" PRIMARY KEY using index "matches_profiles_pkey";

alter table "public"."matches_profiles" add constraint "matches_profiles_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."matches_profiles" validate constraint "matches_profiles_profile_id_fkey";

alter table "public"."scores" add constraint "scores_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."scores" validate constraint "scores_profile_id_fkey";

create policy "Enable all access for their own matches"
on "public"."matches"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT matches_profiles.profile_id AS user_id
   FROM matches_profiles
  WHERE (matches_profiles.match_id = matches_profiles.match_id))));


create policy "Enable all for authenticated users only"
on "public"."matches_profiles"
as permissive
for all
to authenticated
using (true);



