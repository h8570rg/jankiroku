drop policy "Authenticated users can manage chips" on "public"."chips";

drop policy "Users can insert their own games" on "public"."games";

drop policy "Authenticated users can insert matches" on "public"."matches";

drop policy "Users can update their own matches" on "public"."matches";

drop policy "Enable all for authenticated users only" on "public"."matches_profiles";

drop policy "Enable all access for authenticated users" on "public"."rules";

drop policy "Authenticated users can select scores" on "public"."scores";

drop policy "Users can insert their own game's score" on "public"."scores";

drop policy "Enable all access for their own friend." on "public"."friends";

drop policy "Authenticated users can insert their own profile." on "public"."profiles";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

revoke delete on table "public"."chips" from "anon";

revoke insert on table "public"."chips" from "anon";

revoke references on table "public"."chips" from "anon";

revoke select on table "public"."chips" from "anon";

revoke trigger on table "public"."chips" from "anon";

revoke truncate on table "public"."chips" from "anon";

revoke update on table "public"."chips" from "anon";

revoke delete on table "public"."chips" from "authenticated";

revoke insert on table "public"."chips" from "authenticated";

revoke references on table "public"."chips" from "authenticated";

revoke select on table "public"."chips" from "authenticated";

revoke trigger on table "public"."chips" from "authenticated";

revoke truncate on table "public"."chips" from "authenticated";

revoke update on table "public"."chips" from "authenticated";

revoke delete on table "public"."chips" from "service_role";

revoke insert on table "public"."chips" from "service_role";

revoke references on table "public"."chips" from "service_role";

revoke select on table "public"."chips" from "service_role";

revoke trigger on table "public"."chips" from "service_role";

revoke truncate on table "public"."chips" from "service_role";

revoke update on table "public"."chips" from "service_role";

revoke delete on table "public"."matches_profiles" from "anon";

revoke insert on table "public"."matches_profiles" from "anon";

revoke references on table "public"."matches_profiles" from "anon";

revoke select on table "public"."matches_profiles" from "anon";

revoke trigger on table "public"."matches_profiles" from "anon";

revoke truncate on table "public"."matches_profiles" from "anon";

revoke update on table "public"."matches_profiles" from "anon";

revoke delete on table "public"."matches_profiles" from "authenticated";

revoke insert on table "public"."matches_profiles" from "authenticated";

revoke references on table "public"."matches_profiles" from "authenticated";

revoke select on table "public"."matches_profiles" from "authenticated";

revoke trigger on table "public"."matches_profiles" from "authenticated";

revoke truncate on table "public"."matches_profiles" from "authenticated";

revoke update on table "public"."matches_profiles" from "authenticated";

revoke delete on table "public"."matches_profiles" from "service_role";

revoke insert on table "public"."matches_profiles" from "service_role";

revoke references on table "public"."matches_profiles" from "service_role";

revoke select on table "public"."matches_profiles" from "service_role";

revoke trigger on table "public"."matches_profiles" from "service_role";

revoke truncate on table "public"."matches_profiles" from "service_role";

revoke update on table "public"."matches_profiles" from "service_role";

revoke delete on table "public"."scores" from "anon";

revoke insert on table "public"."scores" from "anon";

revoke references on table "public"."scores" from "anon";

revoke select on table "public"."scores" from "anon";

revoke trigger on table "public"."scores" from "anon";

revoke truncate on table "public"."scores" from "anon";

revoke update on table "public"."scores" from "anon";

revoke delete on table "public"."scores" from "authenticated";

revoke insert on table "public"."scores" from "authenticated";

revoke references on table "public"."scores" from "authenticated";

revoke select on table "public"."scores" from "authenticated";

revoke trigger on table "public"."scores" from "authenticated";

revoke truncate on table "public"."scores" from "authenticated";

revoke update on table "public"."scores" from "authenticated";

revoke delete on table "public"."scores" from "service_role";

revoke insert on table "public"."scores" from "service_role";

revoke references on table "public"."scores" from "service_role";

revoke select on table "public"."scores" from "service_role";

revoke trigger on table "public"."scores" from "service_role";

revoke truncate on table "public"."scores" from "service_role";

revoke update on table "public"."scores" from "service_role";

alter table "public"."chips" drop constraint "chips_match_id_fkey";

alter table "public"."chips" drop constraint "chips_profile_id_fkey";

alter table "public"."friends" drop constraint "friends_profile_id_1_fkey";

alter table "public"."friends" drop constraint "friends_profile_id_2_fkey";

alter table "public"."games" drop constraint "games_match_id_fkey";

alter table "public"."matches" drop constraint "matches_updated_by_fkey";

alter table "public"."matches_profiles" drop constraint "matches_profiles_match_id_fkey";

alter table "public"."matches_profiles" drop constraint "matches_profiles_profile_id_fkey";

alter table "public"."scores" drop constraint "scores_game_id_fkey";

alter table "public"."scores" drop constraint "scores_profile_id_fkey";

drop function if exists "public"."delete_friends"(profile_id uuid);

drop function if exists "public"."get_friends"();

drop function if exists "public"."search_profiles"(search_text text);

alter table "public"."chips" drop constraint "chips_pkey";

alter table "public"."matches_profiles" drop constraint "matches_profiles_pkey";

alter table "public"."scores" drop constraint "scores_pkey";

alter table "public"."friends" drop constraint "friends_pkey";

drop index if exists "public"."chips_pkey";

drop index if exists "public"."matches_profiles_pkey";

drop index if exists "public"."scores_pkey";

drop index if exists "public"."friends_pkey";

drop table "public"."chips";

drop table "public"."matches_profiles";

drop table "public"."scores";

create table "public"."game_players" (
    "game_id" uuid not null,
    "score" integer not null,
    "player_id" uuid not null default auth.uid()
);


alter table "public"."game_players" enable row level security;

create table "public"."match_players" (
    "match_id" uuid not null,
    "player_id" uuid not null default auth.uid(),
    "chip_count" integer
);


alter table "public"."match_players" enable row level security;

alter table "public"."friends" drop column "profile_id_1";

alter table "public"."friends" drop column "profile_id_2";

alter table "public"."friends" add column "created_at" timestamp with time zone not null default now();

alter table "public"."friends" add column "friend_id" uuid not null;

alter table "public"."friends" add column "profile_id" uuid not null default auth.uid();

alter table "public"."games" add column "created_by" uuid not null default auth.uid();

alter table "public"."games" alter column "id" set default gen_random_uuid();

alter table "public"."matches" drop column "updated_at";

alter table "public"."matches" drop column "updated_by";

CREATE UNIQUE INDEX game_players_pkey ON public.game_players USING btree (game_id, player_id);

CREATE UNIQUE INDEX match_players_pkey ON public.match_players USING btree (match_id, player_id);

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (profile_id, friend_id);

alter table "public"."game_players" add constraint "game_players_pkey" PRIMARY KEY using index "game_players_pkey";

alter table "public"."match_players" add constraint "match_players_pkey" PRIMARY KEY using index "match_players_pkey";

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."friends" add constraint "public_friends_friend_id_fkey" FOREIGN KEY (friend_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "public_friends_friend_id_fkey";

alter table "public"."friends" add constraint "public_friends_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "public_friends_profile_id_fkey";

alter table "public"."game_players" add constraint "scores_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."game_players" validate constraint "scores_game_id_fkey";

alter table "public"."game_players" add constraint "scores_profile_id_fkey" FOREIGN KEY (player_id) REFERENCES profiles(id) not valid;

alter table "public"."game_players" validate constraint "scores_profile_id_fkey";

alter table "public"."games" add constraint "public_games_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "public_games_created_by_fkey";

alter table "public"."games" add constraint "public_games_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "public_games_match_id_fkey";

alter table "public"."match_players" add constraint "matches_profiles_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."match_players" validate constraint "matches_profiles_match_id_fkey";

alter table "public"."match_players" add constraint "matches_profiles_profile_id_fkey" FOREIGN KEY (player_id) REFERENCES profiles(id) not valid;

alter table "public"."match_players" validate constraint "matches_profiles_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.name_janreco_id(profiles)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$select $1.name || ' ' || $1.janreco_id;$function$
;

grant delete on table "public"."game_players" to "anon";

grant insert on table "public"."game_players" to "anon";

grant references on table "public"."game_players" to "anon";

grant select on table "public"."game_players" to "anon";

grant trigger on table "public"."game_players" to "anon";

grant truncate on table "public"."game_players" to "anon";

grant update on table "public"."game_players" to "anon";

grant delete on table "public"."game_players" to "authenticated";

grant insert on table "public"."game_players" to "authenticated";

grant references on table "public"."game_players" to "authenticated";

grant select on table "public"."game_players" to "authenticated";

grant trigger on table "public"."game_players" to "authenticated";

grant truncate on table "public"."game_players" to "authenticated";

grant update on table "public"."game_players" to "authenticated";

grant delete on table "public"."game_players" to "service_role";

grant insert on table "public"."game_players" to "service_role";

grant references on table "public"."game_players" to "service_role";

grant select on table "public"."game_players" to "service_role";

grant trigger on table "public"."game_players" to "service_role";

grant truncate on table "public"."game_players" to "service_role";

grant update on table "public"."game_players" to "service_role";

grant delete on table "public"."match_players" to "anon";

grant insert on table "public"."match_players" to "anon";

grant references on table "public"."match_players" to "anon";

grant select on table "public"."match_players" to "anon";

grant trigger on table "public"."match_players" to "anon";

grant truncate on table "public"."match_players" to "anon";

grant update on table "public"."match_players" to "anon";

grant delete on table "public"."match_players" to "authenticated";

grant insert on table "public"."match_players" to "authenticated";

grant references on table "public"."match_players" to "authenticated";

grant select on table "public"."match_players" to "authenticated";

grant trigger on table "public"."match_players" to "authenticated";

grant truncate on table "public"."match_players" to "authenticated";

grant update on table "public"."match_players" to "authenticated";

grant delete on table "public"."match_players" to "service_role";

grant insert on table "public"."match_players" to "service_role";

grant references on table "public"."match_players" to "service_role";

grant select on table "public"."match_players" to "service_role";

grant trigger on table "public"."match_players" to "service_role";

grant truncate on table "public"."match_players" to "service_role";

grant update on table "public"."match_players" to "service_role";

create policy "Authenticated users can select scores"
on "public"."game_players"
as permissive
for select
to authenticated
using (true);


create policy "Users can delete their own match's score"
on "public"."game_players"
as permissive
for delete
to authenticated
using ((auth.uid() IN ( SELECT match_players.player_id
   FROM (match_players
     JOIN games ON ((match_players.match_id = games.match_id)))
  WHERE (games.id = game_players.game_id))));


create policy "Users can insert their own match's score"
on "public"."game_players"
as permissive
for insert
to authenticated
with check ((auth.uid() IN ( SELECT match_players.player_id
   FROM (match_players
     JOIN games ON ((match_players.match_id = games.match_id)))
  WHERE (games.id = game_players.game_id))));


create policy "Users can update their own match's score"
on "public"."game_players"
as permissive
for update
to authenticated
using ((auth.uid() IN ( SELECT match_players.player_id
   FROM (match_players
     JOIN games ON ((match_players.match_id = games.match_id)))
  WHERE (games.id = game_players.game_id))));


create policy "Users can delete thier own game."
on "public"."games"
as permissive
for delete
to authenticated
using ((match_id IN ( SELECT match_players.match_id
   FROM match_players
  WHERE (match_players.player_id = auth.uid()))));


create policy "Users can insert thier own game."
on "public"."games"
as permissive
for insert
to authenticated
with check ((match_id IN ( SELECT match_players.match_id
   FROM match_players
  WHERE (match_players.player_id = auth.uid()))));


create policy "Users can update thier own game."
on "public"."games"
as permissive
for update
to authenticated
using ((match_id IN ( SELECT match_players.match_id
   FROM match_players
  WHERE (match_players.player_id = auth.uid()))));


create policy "Authenticeted Users can select."
on "public"."match_players"
as permissive
for select
to authenticated
using (true);


create policy "Users can delete own thier match's player"
on "public"."match_players"
as permissive
for delete
to authenticated
using ((match_id IN ( SELECT match_players_1.match_id
   FROM match_players match_players_1
  WHERE (match_players_1.player_id = auth.uid()))));


create policy "Users can insert own thier match's player"
on "public"."match_players"
as permissive
for insert
to authenticated
with check (((match_id IN ( SELECT matches.id
   FROM (matches
     JOIN match_players match_players_1 ON ((matches.id = match_players_1.match_id)))
  WHERE (match_players_1.player_id = auth.uid()))) OR (match_id IN ( SELECT matches.id
   FROM matches
  WHERE (matches.created_by = auth.uid())))));


create policy "Users can update own thier match's player"
on "public"."match_players"
as permissive
for update
to authenticated
using ((match_id IN ( SELECT match_players_1.match_id
   FROM match_players match_players_1
  WHERE (match_players_1.player_id = auth.uid()))));


create policy "Authenticeted users can insert matches"
on "public"."matches"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticeted users can select all rules"
on "public"."rules"
as permissive
for select
to authenticated
using (true);


create policy "Users can insert their own match's rule"
on "public"."rules"
as permissive
for insert
to authenticated
with check (((match_id IN ( SELECT match_players.match_id
   FROM match_players
  WHERE (match_players.player_id = auth.uid()))) OR (match_id IN ( SELECT matches.id
   FROM matches
  WHERE (matches.created_by = auth.uid())))));


create policy "Enable all access for their own friend."
on "public"."friends"
as permissive
for all
to authenticated
using ((auth.uid() = profile_id));


create policy "Authenticated users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((id = auth.uid()));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id));



