drop policy "Authenticated users can select matches" on "public"."matches";

create policy "Authenticated users can select matches"
on "public"."matches"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM match_players
  WHERE ((match_players.match_id = matches.id) AND (match_players.player_id = auth.uid())))));



