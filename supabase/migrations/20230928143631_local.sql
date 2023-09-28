alter table "public"."friends" alter column "profile_id_1" set default auth.uid();

alter table "public"."matches" alter column "created_by" set default auth.uid();

alter table "public"."matches" alter column "updated_by" set default auth.uid();

alter table "public"."matches_profiles" alter column "profile_id" set default auth.uid();

alter table "public"."profiles" alter column "janreco_id" drop not null;

alter table "public"."profiles" alter column "name" drop not null;

alter table "public"."rules" alter column "created_by" set default auth.uid();

alter table "public"."rules" alter column "updated_by" set default auth.uid();

alter table "public"."scores" alter column "profile_id" set default auth.uid();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$function$
;


