-- Cleanup of orphan profiles (profiles without a matching auth.users row)
-- that are NOT referenced by any other table.
--
-- Background:
--   The legacy `createProfile` flow created profile rows that were never
--   linked to auth.users. As preparation for introducing profiles.user_id,
--   we delete orphan profiles that are completely unreferenced.
--
--   Orphan profiles that are still referenced (e.g. by match_players) are
--   kept; they will become guest players in a later migration once
--   profiles.user_id is added (a NULL user_id will denote a guest).
--
-- Targets:
--   - Profiles whose id does not exist in auth.users AND
--     are not referenced from match_players, game_players, matches.created_by,
--     games.created_by, rules.created_by, rules.updated_by.
--   - Rows in friends that reference such profiles will be removed via
--     ON DELETE CASCADE on the friends FKs.

delete from public.profiles p
where not exists (select 1 from auth.users u where u.id = p.id)
  and not exists (select 1 from public.match_players mp where mp.player_id = p.id)
  and not exists (select 1 from public.game_players gp where gp.player_id = p.id)
  and not exists (select 1 from public.matches m where m.created_by = p.id)
  and not exists (select 1 from public.games g where g.created_by = p.id)
  and not exists (select 1 from public.rules r where r.created_by = p.id or r.updated_by = p.id);
