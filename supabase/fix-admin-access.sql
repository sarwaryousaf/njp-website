-- NJP TOUR SKARDU - GUEST BOOKINGS AND ADMIN RLS
-- Run in the Supabase SQL Editor for the project used by the frontend.

-- 1. Keep legacy booking identifiers optional for guest submissions and make
--    the current form/dashboard columns available on existing installations.
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS destination_id uuid;
ALTER TABLE public.bookings ALTER COLUMN destination_id DROP NOT NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_date timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS package_title text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS travel_date date;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS adults integer DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS children integer DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS transport text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hotel_preference text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_link text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 2. Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Public inserts
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
CREATE POLICY "Public can create bookings"
ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending' AND payment_status = 'unpaid');

DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (true);
GRANT INSERT ON TABLE public.contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "Public can submit reviews" ON public.reviews;
CREATE POLICY "Public can submit reviews"
ON public.reviews FOR INSERT TO anon, authenticated
WITH CHECK (is_approved = false);

-- 4. Admin read access
DROP POLICY IF EXISTS "Authenticated admins can view bookings" ON public.bookings;
CREATE POLICY "Authenticated admins can view bookings"
ON public.bookings FOR SELECT TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Authenticated admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admins can view contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
GRANT SELECT ON TABLE public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "Authenticated admins can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
CREATE POLICY "Admins can view all reviews"
ON public.reviews FOR SELECT TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 5. Admin update access
DROP POLICY IF EXISTS "Authenticated admins can update bookings" ON public.bookings;
CREATE POLICY "Authenticated admins can update bookings"
ON public.bookings FOR UPDATE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Authenticated admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admins can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Authenticated admins can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated admins can manage reviews" ON public.reviews;
CREATE POLICY "Authenticated admins can update reviews"
ON public.reviews FOR UPDATE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 6. Admin delete access
DROP POLICY IF EXISTS "Authenticated admins can delete bookings" ON public.bookings;
CREATE POLICY "Authenticated admins can delete bookings"
ON public.bookings FOR DELETE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Authenticated admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admins can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Authenticated admins can delete reviews" ON public.reviews;
CREATE POLICY "Authenticated admins can delete reviews"
ON public.reviews FOR DELETE TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 7. Set and verify the intended administrator role.
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email = 'admin@njptours.com';

SELECT email, raw_app_meta_data
FROM auth.users
WHERE email = 'admin@njptours.com';