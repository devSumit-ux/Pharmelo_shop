-- RUN THIS QUERY IN SUPABASE SQL EDITOR TO WIPE ALL DATA
-- This will delete all rows and reset the ID counters to 1.

TRUNCATE TABLE public.waitlist_users RESTART IDENTITY;
TRUNCATE TABLE public.early_partners RESTART IDENTITY;
TRUNCATE TABLE public.feedback_submissions RESTART IDENTITY;
TRUNCATE TABLE public.survey_responses RESTART IDENTITY;
TRUNCATE TABLE public.saturday_community_members RESTART IDENTITY;
TRUNCATE TABLE public.admin_notifications RESTART IDENTITY;

-- Update config to ensure name is correct (optional, but good for reset)
UPDATE public.app_config SET app_name = 'Medzo', contact_email = 'hello@medzo.app' WHERE id = 1;