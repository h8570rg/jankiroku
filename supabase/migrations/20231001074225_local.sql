drop policy "Authenticated users can insert a match" on "public"."matches";

drop policy "Users can select own matches" on "public"."matches";

drop policy "Users can update their own matches" on "public"."matches";

create policy "Authenticated users can insert matches"
on "public"."matches"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can select matches"
on "public"."matches"
as permissive
for select
to authenticated
using (true);


create policy "Users can update their own matches"
on "public"."matches"
as permissive
for update
to authenticated
using ((auth.uid() IN ( SELECT mp.profile_id
   FROM matches_profiles mp
  WHERE (mp.match_id = matches.id))));



