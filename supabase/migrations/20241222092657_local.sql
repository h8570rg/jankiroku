alter table "public"."profiles" drop constraint "profiles_janreco_id_key";

drop index if exists "public"."profiles_janreco_id_key";

alter table "public"."profiles" drop column "janreco_id";


