create table "public"."games" (
    "id" uuid not null,
    "match_id" uuid not null
);


create table "public"."matches" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "created_by" uuid not null
);


create table "public"."participants" (
    "id" uuid not null,
    "match_id" uuid not null,
    "user_id" uuid not null
);


create table "public"."scores" (
    "id" uuid not null,
    "game_id" uuid not null,
    "user_id" uuid not null,
    "score" integer not null
);


CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE UNIQUE INDEX matches_pkey ON public.matches USING btree (id);

CREATE UNIQUE INDEX participants_pkey ON public.participants USING btree (id);

CREATE UNIQUE INDEX scores_pkey ON public.scores USING btree (id);

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."matches" add constraint "matches_pkey" PRIMARY KEY using index "matches_pkey";

alter table "public"."participants" add constraint "participants_pkey" PRIMARY KEY using index "participants_pkey";

alter table "public"."scores" add constraint "scores_pkey" PRIMARY KEY using index "scores_pkey";

alter table "public"."games" add constraint "games_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "games_match_id_fkey";

alter table "public"."matches" add constraint "matches_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."matches" validate constraint "matches_created_by_fkey";

alter table "public"."participants" add constraint "participants_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_match_id_fkey";

alter table "public"."participants" add constraint "participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."participants" validate constraint "participants_user_id_fkey";

alter table "public"."scores" add constraint "scores_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."scores" validate constraint "scores_game_id_fkey";

alter table "public"."scores" add constraint "scores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."scores" validate constraint "scores_user_id_fkey";


