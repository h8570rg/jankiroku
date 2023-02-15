alter table "auth"."users" add column "deleted_at" timestamp with time zone;

alter table "auth"."users" alter column "phone" set data type text using "phone"::text;

alter table "auth"."users" alter column "phone_change" set data type text using "phone_change"::text;


