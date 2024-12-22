alter table "public"."profiles" add column "display_id" text;

CREATE UNIQUE INDEX profiles_display_id_key ON public.profiles USING btree (display_id);

alter table "public"."profiles" add constraint "profiles_display_id_key" UNIQUE using index "profiles_display_id_key";


