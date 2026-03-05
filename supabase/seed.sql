-- E2Eテスト用ユーザー
-- supabase db reset 時に自動で投入される

-- handle_new_user トリガーにより profiles テーブルに自動挿入される
-- GoTrue が期待するカラムをすべて適切に設定する
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change, email_change_token_new, email_change_token_current,
  phone, phone_change, phone_change_token,
  reauthentication_token,
  is_sso_user, is_anonymous
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(),
  '', '',
  '', '', '',
  '', '', '',
  '',
  false, false
);

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object('sub', '11111111-1111-1111-1111-111111111111', 'email', 'test@example.com'),
  'email',
  '11111111-1111-1111-1111-111111111111',
  now(), now(), now()
);

-- handle_new_user トリガーにより自動作成されたプロフィールを更新
UPDATE public.profiles
SET display_id = 'testuser', name = 'テストユーザー'
WHERE id = '11111111-1111-1111-1111-111111111111';
