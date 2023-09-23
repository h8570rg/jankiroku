create table "public"."matches_users" (
    "match_id" uuid not null,
    "user_id" uuid not null default auth.uid()
);


alter table "public"."matches_users" enable row level security;

alter table "public"."participants" add column "created_at" timestamp with time zone not null default now();

alter table "public"."participants" alter column "user_id" set default auth.uid();

alter table "public"."participants" enable row level security;

CREATE UNIQUE INDEX matches_users_pkey ON public.matches_users USING btree (user_id, match_id);

alter table "public"."matches_users" add constraint "matches_users_pkey" PRIMARY KEY using index "matches_users_pkey";

alter table "public"."matches_users" add constraint "matches_users_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."matches_users" validate constraint "matches_users_match_id_fkey";

alter table "public"."matches_users" add constraint "matches_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."matches_users" validate constraint "matches_users_user_id_fkey";

create policy "Enable all for authenticated users only"
on "public"."participants"
as permissive
for all
to authenticated
using (true);



