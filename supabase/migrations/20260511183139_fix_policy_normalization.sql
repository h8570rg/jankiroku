drop policy "Users can delete their own match's score" on "public"."game_players";

drop policy "Users can insert their own match's score" on "public"."game_players";

drop policy "Users can update their own match's score" on "public"."game_players";

drop policy "Users can delete thier own game." on "public"."games";

drop policy "Users can insert thier own game." on "public"."games";

drop policy "Users can update thier own game." on "public"."games";

drop policy "Users can delete own thier match's player" on "public"."match_players";

drop policy "Users can insert own thier match's player" on "public"."match_players";

drop policy "Users can update own thier match's player" on "public"."match_players";

drop policy "Authenticated users can select matches" on "public"."matches";

drop policy "Users can insert their own match's rule" on "public"."rules";


  create policy "Users can delete their own match's score"
  on "public"."game_players"
  as permissive
  for delete
  to public
using ((auth.uid() IN ( SELECT match_players.player_id
   FROM (public.match_players
     JOIN public.games ON ((match_players.match_id = games.match_id)))
  WHERE (games.id = game_players.game_id))));



  create policy "Users can insert their own match's score"
  on "public"."game_players"
  as permissive
  for insert
  to public
with check ((auth.uid() IN ( SELECT match_players.player_id
   FROM (public.match_players
     JOIN public.games ON ((match_players.match_id = games.match_id)))
  WHERE (games.id = game_players.game_id))));



  create policy "Users can update their own match's score"
  on "public"."game_players"
  as permissive
  for update
  to public
using ((auth.uid() IN ( SELECT match_players.player_id
   FROM (public.match_players
     JOIN public.games ON ((match_players.match_id = games.match_id)))
  WHERE (games.id = game_players.game_id))));



  create policy "Users can delete thier own game."
  on "public"."games"
  as permissive
  for delete
  to public
using ((match_id IN ( SELECT match_players.match_id
   FROM public.match_players
  WHERE (match_players.player_id = auth.uid()))));



  create policy "Users can insert thier own game."
  on "public"."games"
  as permissive
  for insert
  to public
with check ((match_id IN ( SELECT match_players.match_id
   FROM public.match_players
  WHERE (match_players.player_id = auth.uid()))));



  create policy "Users can update thier own game."
  on "public"."games"
  as permissive
  for update
  to public
using ((match_id IN ( SELECT match_players.match_id
   FROM public.match_players
  WHERE (match_players.player_id = auth.uid()))));



  create policy "Users can delete own thier match's player"
  on "public"."match_players"
  as permissive
  for delete
  to public
using ((match_id IN ( SELECT match_players_1.match_id
   FROM public.match_players match_players_1
  WHERE (match_players_1.player_id = auth.uid()))));



  create policy "Users can insert own thier match's player"
  on "public"."match_players"
  as permissive
  for insert
  to public
with check (((match_id IN ( SELECT matches.id
   FROM (public.matches
     JOIN public.match_players match_players_1 ON ((matches.id = match_players_1.match_id)))
  WHERE (match_players_1.player_id = auth.uid()))) OR (match_id IN ( SELECT matches.id
   FROM public.matches
  WHERE (matches.created_by = auth.uid())))));



  create policy "Users can update own thier match's player"
  on "public"."match_players"
  as permissive
  for update
  to public
using ((match_id IN ( SELECT match_players_1.match_id
   FROM public.match_players match_players_1
  WHERE (match_players_1.player_id = auth.uid()))));



  create policy "Authenticated users can select matches"
  on "public"."matches"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
   FROM public.match_players
  WHERE ((match_players.match_id = matches.id) AND (match_players.player_id = auth.uid())))) OR (created_by = auth.uid())));



  create policy "Users can insert their own match's rule"
  on "public"."rules"
  as permissive
  for insert
  to public
with check (((match_id IN ( SELECT match_players.match_id
   FROM public.match_players
  WHERE (match_players.player_id = auth.uid()))) OR (match_id IN ( SELECT matches.id
   FROM public.matches
  WHERE (matches.created_by = auth.uid())))));



