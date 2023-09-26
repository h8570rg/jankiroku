alter table "public"."matches_profiles" drop constraint "matches_profiles_match_id_fkey";

alter table "public"."rules" drop constraint "rules_match_id_fkey";

create table "public"."friends" (
    "profile_id_1" uuid not null default auth.uid(),
    "profile_id_2" uuid not null
);


alter table "public"."friends" enable row level security;

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (profile_id_1, profile_id_2);

CREATE UNIQUE INDEX profiles_janreco_id_key ON public.profiles USING btree (janreco_id);

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."friends" add constraint "friends_profile_id_1_fkey" FOREIGN KEY (profile_id_1) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_profile_id_1_fkey";

alter table "public"."friends" add constraint "friends_profile_id_2_fkey" FOREIGN KEY (profile_id_2) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_profile_id_2_fkey";

alter table "public"."profiles" add constraint "profiles_janreco_id_key" UNIQUE using index "profiles_janreco_id_key";

alter table "public"."matches_profiles" add constraint "matches_profiles_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."matches_profiles" validate constraint "matches_profiles_match_id_fkey";

alter table "public"."rules" add constraint "rules_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."rules" validate constraint "rules_match_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_friends(profile_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- フレンドの関係を削除
    DELETE FROM friends
    WHERE
        (profile_id_1 = profile_id AND profile_id_2 = auth.uid())
        OR
        (profile_id_2 = profile_id AND profile_id_1 = auth.uid());
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_friends()
 RETURNS TABLE(id uuid, name text, janreco_id text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.janreco_id
    FROM
        profiles p
    INNER JOIN
        friends f
    ON
        (f.profile_id_1 = p.id AND f.profile_id_2 = auth.uid()) OR (f.profile_id_2 = p.id AND f.profile_id_1 = auth.uid());
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_profiles(search_text text)
 RETURNS TABLE(id uuid, name text, janreco_id text, is_friend boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.janreco_id,
        CASE WHEN f.profile_id_1 = p.id OR f.profile_id_2 = p.id THEN TRUE ELSE FALSE END AS is_friend
    FROM
        profiles p
    LEFT JOIN
        friends f
    ON
        (f.profile_id_1 = p.id AND f.profile_id_2 = auth.uid()) OR (f.profile_id_2 = p.id AND f.profile_id_1 = auth.uid())
    WHERE
        (p.name = search_text OR p.janreco_id = search_text) AND p.id <> auth.uid();
END;
$function$
;

create policy "Enable all access for their own friend."
on "public"."friends"
as permissive
for all
to authenticated
using (((auth.uid() = profile_id_1) OR (auth.uid() = profile_id_2)));



