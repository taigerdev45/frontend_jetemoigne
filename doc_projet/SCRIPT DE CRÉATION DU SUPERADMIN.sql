-- SCRIPT DE CRÉATION DU SUPERADMIN (JETEMOIGNE-TV)
-- À exécuter dans le SQL Editor de Supabase

BEGIN;

-- 1. Insertion dans le système d'authentification Supabase (auth.users)
-- Note: Le mot de passe par défaut est 'SuperAdmin2026!', il devra être changé par l'utilisateur.
INSERT INTO auth.users (
    instance_id, 
    id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    recovery_sent_at, 
    last_sign_in_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    is_super_admin, 
    created_at, 
    updated_at, 
    confirmation_token, 
    email_change, 
    email_change_token_new, 
    recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    '4963eff1-7133-450f-a953-643d222d04b7', -- UUID fourni
    'authenticated',
    'authenticated',
    'siataiger7@gmail.com',
    crypt('je.....2026', gen_salt('bf')), -- Mot de passe temporaire
    NOW(),
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"TAIGER"}',
    FALSE,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- 2. Insertion dans la table des profils applicatifs (public.profiles)
INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    created_at, 
    updated_at
)
VALUES (
    '4963eff1-7133-450f-a953-643d222d04b7',
    'siataiger7@gmail.com',
    'TAIGER',
    'super_admin', -- Attribution du rôle critique
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

COMMIT;

-- VERIFICATION
SELECT * FROM public.profiles WHERE id = '4963eff1-7133-450f-a953-643d222d04b7';