alter table "public"."games" enable row level security;

alter table "public"."scores" enable row level security;

create policy "Authenticated users can select games"
on "public"."games"
as permissive
for select
to authenticated
using (true);


create policy "Users can insert their own games"
on "public"."games"
as permissive
for insert
to authenticated
with check ((auth.uid() IN ( SELECT mp.profile_id
   FROM matches_profiles mp
  WHERE (mp.match_id = games.match_id))));


create policy "Authenticated users can select scores"
on "public"."scores"
as permissive
for select
to authenticated
using (true);


create policy "Users can insert their own game's score"
on "public"."scores"
as permissive
for insert
to authenticated
with check ((auth.uid() IN ( SELECT mp.profile_id
   FROM (matches_profiles mp
     JOIN games g ON ((g.match_id = mp.match_id)))
  WHERE (g.id = scores.game_id))));



