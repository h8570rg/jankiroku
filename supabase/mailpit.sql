-- 一時的な回避策（config.toml の [auth.hook.send_email] を参照）
create extension if not exists pg_net with schema extensions;
create schema if not exists local_dev;
revoke all on schema local_dev from public;

-- mailpit_url は supabase/mailpit.sh が入れる
create table if not exists local_dev.settings (
  key text primary key,
  value text not null
);

create or replace function local_dev.send_auth_email(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  token text := event -> 'email_data' ->> 'token';
  mailpit_url text := (select value from local_dev.settings where key = 'mailpit_url');
begin
  if mailpit_url is null then
    raise exception 'local_dev.settings に mailpit_url がない（pnpm run supabase:start を実行する）';
  end if;
  perform net.http_post(
    url := mailpit_url || '/api/v1/send',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'From', jsonb_build_object('Email', 'noreply@jankiroku.local', 'Name', '雀鬼録'),
      'To', jsonb_build_array(jsonb_build_object('Email', event -> 'user' ->> 'email')),
      'Subject', '雀鬼録 ログインコード',
      'Text', format(E'以下のコードをログイン画面に入力してください。\n\n%s\n\nこのコードの有効期限は10分です。', token),
      'HTML', format(
        '<h2>雀鬼録 ログインコード</h2><p>以下のコードをログイン画面に入力してください。</p>'
        '<p style="font-size: 24px; font-weight: bold; letter-spacing: 4px">%s</p>'
        '<p>このコードの有効期限は10分です。</p>'
        '<p>心当たりがない場合は、このメールを破棄してください。</p>',
        token)
    )
  );
  return '{}'::jsonb;
end;
$$;

revoke execute on function local_dev.send_auth_email(jsonb) from authenticated, anon, public;
grant usage on schema local_dev to supabase_auth_admin;
grant execute on function local_dev.send_auth_email(jsonb) to supabase_auth_admin;
