drop policy "Enable all access for their own friend." on "public"."friends";

create policy "Enable all access for their own friend."
on "public"."friends"
as permissive
for all
to authenticated
using (((auth.uid() = profile_id) OR (auth.uid() = friend_id)));



