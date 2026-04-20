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
  reauthentication_token,
  is_sso_user, is_anonymous
) VALUES
(
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
  '',
  false, false
),
(
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated',
  'alice@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(),
  '', '',
  '', '', '',
  '',
  false, false
),
(
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated', 'authenticated',
  'bob@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(),
  '', '',
  '', '', '',
  '',
  false, false
),
(
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-4444-444444444444',
  'authenticated', 'authenticated',
  'carol@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(),
  '', '',
  '', '', '',
  '',
  false, false
),
-- 新規サインアップ直後の想定（display_id, name は NULL のまま）
(
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-5555-5555-555555555555',
  'authenticated', 'authenticated',
  'unregistered@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(),
  '', '',
  '', '', '',
  '',
  false, false
);

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object('sub', '11111111-1111-1111-1111-111111111111', 'email', 'test@example.com'),
  'email',
  '11111111-1111-1111-1111-111111111111',
  now(), now(), now()
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  jsonb_build_object('sub', '22222222-2222-2222-2222-222222222222', 'email', 'alice@example.com'),
  'email',
  '22222222-2222-2222-2222-222222222222',
  now(), now(), now()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  jsonb_build_object('sub', '33333333-3333-3333-3333-333333333333', 'email', 'bob@example.com'),
  'email',
  '33333333-3333-3333-3333-333333333333',
  now(), now(), now()
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444444',
  jsonb_build_object('sub', '44444444-4444-4444-4444-444444444444', 'email', 'carol@example.com'),
  'email',
  '44444444-4444-4444-4444-444444444444',
  now(), now(), now()
),
(
  gen_random_uuid(),
  '55555555-5555-5555-5555-555555555555',
  jsonb_build_object('sub', '55555555-5555-5555-5555-555555555555', 'email', 'unregistered@example.com'),
  'email',
  '55555555-5555-5555-5555-555555555555',
  now(), now(), now()
);

-- handle_new_user トリガーにより自動作成されたプロフィールを更新
UPDATE public.profiles SET display_id = 'testuser', name = 'テストユーザー'
WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.profiles SET display_id = 'alice123', name = 'アリス'
WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE public.profiles SET display_id = 'bob123', name = 'ボブ'
WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE public.profiles SET display_id = 'carol123', name = 'キャロル'
WHERE id = '44444444-4444-4444-4444-444444444444';

-- testuser のフレンドとして alice, bob, carol を登録
-- （検索不要でデフォルトフレンド一覧から選択できるようにするため）
INSERT INTO public.friends (profile_id, friend_id) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444');

-- E2E用の事前マッチ（四麻・4人参加・ゲーム/チップ未入力）
-- match-detail.spec.ts から直接この id に遷移して使う
INSERT INTO public.matches (id, created_by, created_at) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    now()
  );

INSERT INTO public.match_players (match_id, player_id, "order") VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 0),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 3);

INSERT INTO public.rules (
  match_id, players_count, rate, default_points, default_calc_points,
  crack_box_bonus, chip_rate, calc_method, incline, created_by, updated_by
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 0, 25000, 30000,
  10000, 0, 'round', '0_0_0_0',
  '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'
);
