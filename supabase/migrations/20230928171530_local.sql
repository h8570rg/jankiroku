drop policy "Enable all access for their own matches" on "public"."matches";

create policy "Authenticated users can insert a match"
on "public"."matches"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can select own matches"
on "public"."matches"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT matches_profiles.profile_id AS user_id
   FROM matches_profiles
  WHERE (matches_profiles.match_id = matches_profiles.match_id))));


create policy "Users can update their own matches"
on "public"."matches"
as permissive
for update
to public
using ((auth.uid() IN ( SELECT matches_profiles.profile_id AS user_id
   FROM matches_profiles
  WHERE (matches_profiles.match_id = matches_profiles.match_id))));



