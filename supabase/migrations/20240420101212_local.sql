create table "public"."chips" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "chip" integer not null,
    "match_id" uuid not null,
    "profile_id" uuid not null
);


alter table "public"."chips" enable row level security;

CREATE UNIQUE INDEX chips_pkey ON public.chips USING btree (id);

alter table "public"."chips" add constraint "chips_pkey" PRIMARY KEY using index "chips_pkey";

alter table "public"."chips" add constraint "chips_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chips" validate constraint "chips_match_id_fkey";

alter table "public"."chips" add constraint "chips_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."chips" validate constraint "chips_profile_id_fkey";

grant delete on table "public"."chips" to "anon";

grant insert on table "public"."chips" to "anon";

grant references on table "public"."chips" to "anon";

grant select on table "public"."chips" to "anon";

grant trigger on table "public"."chips" to "anon";

grant truncate on table "public"."chips" to "anon";

grant update on table "public"."chips" to "anon";

grant delete on table "public"."chips" to "authenticated";

grant insert on table "public"."chips" to "authenticated";

grant references on table "public"."chips" to "authenticated";

grant select on table "public"."chips" to "authenticated";

grant trigger on table "public"."chips" to "authenticated";

grant truncate on table "public"."chips" to "authenticated";

grant update on table "public"."chips" to "authenticated";

grant delete on table "public"."chips" to "service_role";

grant insert on table "public"."chips" to "service_role";

grant references on table "public"."chips" to "service_role";

grant select on table "public"."chips" to "service_role";

grant trigger on table "public"."chips" to "service_role";

grant truncate on table "public"."chips" to "service_role";

grant update on table "public"."chips" to "service_role";

create policy "Authenticated users can manage chips"
on "public"."chips"
as permissive
for all
to authenticated
using (true)
with check (true);



