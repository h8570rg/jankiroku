create table "public"."friends" (
    "created_at" timestamp with time zone not null default now(),
    "friend_id" uuid not null,
    "profile_id" uuid not null default auth.uid()
);


alter table "public"."friends" enable row level security;

create table "public"."game_players" (
    "game_id" uuid not null,
    "score" integer not null,
    "player_id" uuid not null default auth.uid(),
    "rank" integer not null
);


alter table "public"."game_players" enable row level security;

create table "public"."games" (
    "id" uuid not null default gen_random_uuid(),
    "match_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid()
);


alter table "public"."games" enable row level security;

create table "public"."match_players" (
    "match_id" uuid not null,
    "player_id" uuid not null default auth.uid(),
    "chip_count" integer
);


alter table "public"."match_players" enable row level security;

create table "public"."matches" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid()
);


alter table "public"."matches" enable row level security;

create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "janreco_id" text
);


alter table "public"."profiles" enable row level security;

create table "public"."rules" (
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid not null default auth.uid(),
    "match_id" uuid not null,
    "players_count" integer not null,
    "rate" integer not null,
    "default_points" integer not null,
    "default_calc_points" integer not null,
    "crack_box_bonus" integer not null,
    "chip_rate" integer not null,
    "calc_method" text not null,
    "incline" text not null,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."rules" enable row level security;

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (profile_id, friend_id);

CREATE UNIQUE INDEX game_players_pkey ON public.game_players USING btree (game_id, player_id);

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX match_players_pkey ON public.match_players USING btree (match_id, player_id);

CREATE UNIQUE INDEX matches_pkey ON public.matches USING btree (id);

CREATE UNIQUE INDEX profiles_janreco_id_key ON public.profiles USING btree (janreco_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX rules_pkey ON public.rules USING btree (id);

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."game_players" add constraint "game_players_pkey" PRIMARY KEY using index "game_players_pkey";

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."match_players" add constraint "match_players_pkey" PRIMARY KEY using index "match_players_pkey";

alter table "public"."matches" add constraint "matches_pkey" PRIMARY KEY using index "matches_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."rules" add constraint "rules_pkey" PRIMARY KEY using index "rules_pkey";

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

alter table "public"."matches" add constraint "matches_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."matches" validate constraint "matches_created_by_fkey";

alter table "public"."profiles" add constraint "profiles_janreco_id_key" UNIQUE using index "profiles_janreco_id_key";

alter table "public"."rules" add constraint "rules_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."rules" validate constraint "rules_created_by_fkey";

alter table "public"."rules" add constraint "rules_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."rules" validate constraint "rules_match_id_fkey";

alter table "public"."rules" add constraint "rules_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(id) not valid;

alter table "public"."rules" validate constraint "rules_updated_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.name_janreco_id(profiles)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$select $1.name || ' ' || $1.janreco_id;$function$
;

grant delete on table "public"."friends" to "anon";

grant insert on table "public"."friends" to "anon";

grant references on table "public"."friends" to "anon";

grant select on table "public"."friends" to "anon";

grant trigger on table "public"."friends" to "anon";

grant truncate on table "public"."friends" to "anon";

grant update on table "public"."friends" to "anon";

grant delete on table "public"."friends" to "authenticated";

grant insert on table "public"."friends" to "authenticated";

grant references on table "public"."friends" to "authenticated";

grant select on table "public"."friends" to "authenticated";

grant trigger on table "public"."friends" to "authenticated";

grant truncate on table "public"."friends" to "authenticated";

grant update on table "public"."friends" to "authenticated";

grant delete on table "public"."friends" to "service_role";

grant insert on table "public"."friends" to "service_role";

grant references on table "public"."friends" to "service_role";

grant select on table "public"."friends" to "service_role";

grant trigger on table "public"."friends" to "service_role";

grant truncate on table "public"."friends" to "service_role";

grant update on table "public"."friends" to "service_role";

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

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

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

grant delete on table "public"."matches" to "anon";

grant insert on table "public"."matches" to "anon";

grant references on table "public"."matches" to "anon";

grant select on table "public"."matches" to "anon";

grant trigger on table "public"."matches" to "anon";

grant truncate on table "public"."matches" to "anon";

grant update on table "public"."matches" to "anon";

grant delete on table "public"."matches" to "authenticated";

grant insert on table "public"."matches" to "authenticated";

grant references on table "public"."matches" to "authenticated";

grant select on table "public"."matches" to "authenticated";

grant trigger on table "public"."matches" to "authenticated";

grant truncate on table "public"."matches" to "authenticated";

grant update on table "public"."matches" to "authenticated";

grant delete on table "public"."matches" to "service_role";

grant insert on table "public"."matches" to "service_role";

grant references on table "public"."matches" to "service_role";

grant select on table "public"."matches" to "service_role";

grant trigger on table "public"."matches" to "service_role";

grant truncate on table "public"."matches" to "service_role";

grant update on table "public"."matches" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."rules" to "anon";

grant insert on table "public"."rules" to "anon";

grant references on table "public"."rules" to "anon";

grant select on table "public"."rules" to "anon";

grant trigger on table "public"."rules" to "anon";

grant truncate on table "public"."rules" to "anon";

grant update on table "public"."rules" to "anon";

grant delete on table "public"."rules" to "authenticated";

grant insert on table "public"."rules" to "authenticated";

grant references on table "public"."rules" to "authenticated";

grant select on table "public"."rules" to "authenticated";

grant trigger on table "public"."rules" to "authenticated";

grant truncate on table "public"."rules" to "authenticated";

grant update on table "public"."rules" to "authenticated";

grant delete on table "public"."rules" to "service_role";

grant insert on table "public"."rules" to "service_role";

grant references on table "public"."rules" to "service_role";

grant select on table "public"."rules" to "service_role";

grant trigger on table "public"."rules" to "service_role";

grant truncate on table "public"."rules" to "service_role";

grant update on table "public"."rules" to "service_role";

create policy "Enable all access for their own friend."
on "public"."friends"
as permissive
for all
to authenticated
using ((auth.uid() = profile_id));


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


create policy "Authenticated users can select games"
on "public"."games"
as permissive
for select
to authenticated
using (true);


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


create policy "Authenticated users can select matches"
on "public"."matches"
as permissive
for select
to authenticated
using (true);


create policy "Authenticeted users can insert matches"
on "public"."matches"
as permissive
for insert
to authenticated
with check (true);


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



