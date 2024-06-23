drop policy "Authenticated users can insert their own profile." on "public"."profiles";

create policy "Authenticated users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);



