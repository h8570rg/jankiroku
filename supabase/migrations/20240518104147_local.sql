
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "janreco_id" "text"
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."name_janreco_id"("public"."profiles") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$select $1.name || ' ' || $1.janreco_id;$_$;

ALTER FUNCTION "public"."name_janreco_id"("public"."profiles") OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."friends" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "friend_id" "uuid" NOT NULL,
    "profile_id" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."friends" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."game_players" (
    "game_id" "uuid" NOT NULL,
    "score" integer NOT NULL,
    "player_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "rank" integer NOT NULL
);

ALTER TABLE "public"."game_players" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "match_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."games" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."match_players" (
    "match_id" "uuid" NOT NULL,
    "player_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "chip_count" integer
);

ALTER TABLE "public"."match_players" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."matches" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL
);

ALTER TABLE "public"."matches" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."rules" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "match_id" "uuid" NOT NULL,
    "players_count" integer NOT NULL,
    "rate" integer NOT NULL,
    "default_points" integer NOT NULL,
    "default_calc_points" integer NOT NULL,
    "crack_box_bonus" integer NOT NULL,
    "chip_rate" integer NOT NULL,
    "calc_method" "text" NOT NULL,
    "incline" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."rules" OWNER TO "postgres";

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("profile_id", "friend_id");

ALTER TABLE ONLY "public"."game_players"
    ADD CONSTRAINT "game_players_pkey" PRIMARY KEY ("game_id", "player_id");

ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."match_players"
    ADD CONSTRAINT "match_players_pkey" PRIMARY KEY ("match_id", "player_id");

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_janreco_id_key" UNIQUE ("janreco_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."match_players"
    ADD CONSTRAINT "matches_profiles_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."match_players"
    ADD CONSTRAINT "matches_profiles_profile_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "public_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "public_friends_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "public_games_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "public_games_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."game_players"
    ADD CONSTRAINT "scores_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."game_players"
    ADD CONSTRAINT "scores_profile_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."profiles"("id");

CREATE POLICY "Authenticated users can insert their own profile." ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));

CREATE POLICY "Authenticated users can select games" ON "public"."games" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Authenticated users can select matches" ON "public"."matches" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Authenticated users can select scores" ON "public"."game_players" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Authenticeted Users can select." ON "public"."match_players" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Authenticeted users can insert matches" ON "public"."matches" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Authenticeted users can select all rules" ON "public"."rules" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable all access for their own friend." ON "public"."friends" TO "authenticated" USING (("auth"."uid"() = "profile_id"));

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Users can delete own thier match's player" ON "public"."match_players" FOR DELETE TO "authenticated" USING (("match_id" IN ( SELECT "match_players_1"."match_id"
   FROM "public"."match_players" "match_players_1"
  WHERE ("match_players_1"."player_id" = "auth"."uid"()))));

CREATE POLICY "Users can delete their own match's score" ON "public"."game_players" FOR DELETE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "match_players"."player_id"
   FROM ("public"."match_players"
     JOIN "public"."games" ON (("match_players"."match_id" = "games"."match_id")))
  WHERE ("games"."id" = "game_players"."game_id"))));

CREATE POLICY "Users can delete thier own game." ON "public"."games" FOR DELETE TO "authenticated" USING (("match_id" IN ( SELECT "match_players"."match_id"
   FROM "public"."match_players"
  WHERE ("match_players"."player_id" = "auth"."uid"()))));

CREATE POLICY "Users can insert own thier match's player" ON "public"."match_players" FOR INSERT TO "authenticated" WITH CHECK ((("match_id" IN ( SELECT "matches"."id"
   FROM ("public"."matches"
     JOIN "public"."match_players" "match_players_1" ON (("matches"."id" = "match_players_1"."match_id")))
  WHERE ("match_players_1"."player_id" = "auth"."uid"()))) OR ("match_id" IN ( SELECT "matches"."id"
   FROM "public"."matches"
  WHERE ("matches"."created_by" = "auth"."uid"())))));

CREATE POLICY "Users can insert their own match's rule" ON "public"."rules" FOR INSERT TO "authenticated" WITH CHECK ((("match_id" IN ( SELECT "match_players"."match_id"
   FROM "public"."match_players"
  WHERE ("match_players"."player_id" = "auth"."uid"()))) OR ("match_id" IN ( SELECT "matches"."id"
   FROM "public"."matches"
  WHERE ("matches"."created_by" = "auth"."uid"())))));

CREATE POLICY "Users can insert their own match's score" ON "public"."game_players" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IN ( SELECT "match_players"."player_id"
   FROM ("public"."match_players"
     JOIN "public"."games" ON (("match_players"."match_id" = "games"."match_id")))
  WHERE ("games"."id" = "game_players"."game_id"))));

CREATE POLICY "Users can insert thier own game." ON "public"."games" FOR INSERT TO "authenticated" WITH CHECK (("match_id" IN ( SELECT "match_players"."match_id"
   FROM "public"."match_players"
  WHERE ("match_players"."player_id" = "auth"."uid"()))));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own thier match's player" ON "public"."match_players" FOR UPDATE TO "authenticated" USING (("match_id" IN ( SELECT "match_players_1"."match_id"
   FROM "public"."match_players" "match_players_1"
  WHERE ("match_players_1"."player_id" = "auth"."uid"()))));

CREATE POLICY "Users can update their own match's score" ON "public"."game_players" FOR UPDATE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "match_players"."player_id"
   FROM ("public"."match_players"
     JOIN "public"."games" ON (("match_players"."match_id" = "games"."match_id")))
  WHERE ("games"."id" = "game_players"."game_id"))));

CREATE POLICY "Users can update thier own game." ON "public"."games" FOR UPDATE TO "authenticated" USING (("match_id" IN ( SELECT "match_players"."match_id"
   FROM "public"."match_players"
  WHERE ("match_players"."player_id" = "auth"."uid"()))));

ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."game_players" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."match_players" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."matches" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."rules" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON FUNCTION "public"."name_janreco_id"("public"."profiles") TO "anon";
GRANT ALL ON FUNCTION "public"."name_janreco_id"("public"."profiles") TO "authenticated";
GRANT ALL ON FUNCTION "public"."name_janreco_id"("public"."profiles") TO "service_role";

GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";

GRANT ALL ON TABLE "public"."game_players" TO "anon";
GRANT ALL ON TABLE "public"."game_players" TO "authenticated";
GRANT ALL ON TABLE "public"."game_players" TO "service_role";

GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";

GRANT ALL ON TABLE "public"."match_players" TO "anon";
GRANT ALL ON TABLE "public"."match_players" TO "authenticated";
GRANT ALL ON TABLE "public"."match_players" TO "service_role";

GRANT ALL ON TABLE "public"."matches" TO "anon";
GRANT ALL ON TABLE "public"."matches" TO "authenticated";
GRANT ALL ON TABLE "public"."matches" TO "service_role";

GRANT ALL ON TABLE "public"."rules" TO "anon";
GRANT ALL ON TABLE "public"."rules" TO "authenticated";
GRANT ALL ON TABLE "public"."rules" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;

--
-- Dumped schema changes for auth and storage
--

