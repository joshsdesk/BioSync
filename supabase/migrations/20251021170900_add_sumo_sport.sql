-- Location: supabase/migrations/20251021170900_add_sumo_sport.sql
-- Schema Analysis: Existing sports table with comprehensive structure supports adding new sports
-- Integration Type: Addition - Adding new sport entry to existing sports table
-- Dependencies: Existing sports table, sport_category enum with 'martial_arts' value

-- Add Sumo as a built-in martial arts sport
INSERT INTO public.sports (name, category, description, is_custom, movement_focus)
VALUES (
    'Sumo Wrestling',
    'martial_arts'::public.sport_category,
    'Traditional Japanese wrestling sport focusing on balance, leverage, and technique to force opponents out of the ring',
    false,
    ARRAY['grappling_technique', 'balance_control', 'lower_body_strength', 'ring_positioning', 'stance_stability']
);

-- Add some additional martial arts sports that users commonly request
INSERT INTO public.sports (name, category, description, is_custom, movement_focus)
VALUES 
    (
        'Judo',
        'martial_arts'::public.sport_category,
        'Japanese martial art focusing on throws, grappling, and ground techniques',
        false,
        ARRAY['throwing_technique', 'ground_control', 'balance_disruption', 'grip_fighting']
    ),
    (
        'Brazilian Jiu-Jitsu',
        'martial_arts'::public.sport_category,
        'Ground-fighting martial art emphasizing leverage, joint locks, and chokeholds',
        false,
        ARRAY['ground_positioning', 'submission_technique', 'leverage_application', 'guard_work']
    ),
    (
        'Muay Thai',
        'martial_arts'::public.sport_category,
        'Thai martial art known as "the art of eight limbs" using fists, elbows, knees, and shins',
        false,
        ARRAY['striking_technique', 'clinch_work', 'knee_strikes', 'elbow_technique', 'leg_kicks']
    );