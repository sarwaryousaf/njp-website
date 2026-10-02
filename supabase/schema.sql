create extension if not exists pgcrypto;

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null default 0,
  duration text,
  location text,
  cover_image text,
  created_at timestamptz not null default now()
);

alter table public.packages add column if not exists cover_image text;

insert into public.packages (title, description, price, duration, location, cover_image)
select seed.title, seed.description, seed.price, seed.duration, seed.location, seed.cover_image
from (values
  ('Skardu Explorer Package', 'Explore the heart of Gilgit-Baltistan with visits to Upper Kachura Lake, Shangrila Resort, Shigar Fort, and Katpana Cold Desert.', 45000, '4 Nights / 5 Days', 'Skardu, Kachura, Shangrila, Khaplu', 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=800'),
  ('Skardu + Hunza Grand Tour', 'The ultimate northern adventure combining the pristine waters of Skardu with the majestic peaks and rich heritage of Hunza Valley.', 75000, '6 Nights / 7 Days', 'Skardu, Hunza, Attabad Lake, Passu', 'https://images.unsplash.com/photo-1605648916361-9bc12ad6a563?auto=format&fit=crop&q=80&w=800'),
  ('Hunza Valley Special', 'Experience breathtaking sunrise views from Eagle Nest, historical forts, Attabad Lake boat ride, and Passu Cones.', 50000, '4 Nights / 5 Days', 'Baltit Fort, Altit Fort, Eagle Nest, Passu', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'),
  ('Astore + Minimarg Adventure', 'Discover untouched paradise with visits to Rama Meadows, Rainbow Lake Domel, Minimarg, and Burzil Pass.', 60000, '4 Nights / 5 Days', 'Rama Lake, Rainbow Lake, Minimarg', 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&q=80&w=800'),
  ('Deosai Plains Wildlife Safari', 'Camp or tour the second-highest plateau in the world and spot Himalayan Brown Bears and alpine lakes.', 40000, '3 Nights / 4 Days', 'Deosai National Park, Sadpara Lake', 'https://images.unsplash.com/photo-1590603098555-a4f995c734b4?auto=format&fit=crop&q=80&w=800'),
  ('Customized Private Tour', 'Your plan, your dates, and your experience. We will craft a bespoke itinerary for you and your family.', 0, 'Flexible Dates', 'Any GB Destination', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800')
) as seed(title, description, price, duration, location, cover_image)
where not exists (
  select 1 from public.packages existing where existing.title = seed.title
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  whatsapp text,
  email text,
  package_title text,
  travel_date date not null,
  adults integer not null default 1,
  children integer not null default 0,
  transport text,
  hotel_preference text,
  message text,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  payment_link text,
  created_at timestamptz not null default now()
);

-- Keep existing deployments compatible with guest bookings and the current form.
alter table public.bookings add column if not exists user_id uuid;
alter table public.bookings alter column user_id drop not null;
alter table public.bookings add column if not exists destination_id uuid;
alter table public.bookings alter column destination_id drop not null;
alter table public.bookings add column if not exists booking_date timestamptz;
alter table public.bookings add column if not exists name text;
alter table public.bookings add column if not exists phone text;
alter table public.bookings add column if not exists whatsapp text;
alter table public.bookings add column if not exists email text;
alter table public.bookings add column if not exists package_title text;
alter table public.bookings add column if not exists travel_date date;
alter table public.bookings add column if not exists adults integer default 1;
alter table public.bookings add column if not exists children integer default 0;
alter table public.bookings add column if not exists transport text;
alter table public.bookings add column if not exists hotel_preference text;
alter table public.bookings add column if not exists message text;
alter table public.bookings add column if not exists status text default 'pending';
alter table public.bookings add column if not exists payment_status text default 'unpaid';
alter table public.bookings add column if not exists payment_link text;
alter table public.bookings add column if not exists created_at timestamptz default now();

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  package_name text default 'General Customer',
  rating integer not null default 5 check (rating between 1 and 5),
  review text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.packages enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

alter table public.reviews alter column is_approved set default false;

create index if not exists packages_created_at_idx on public.packages (created_at desc);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

drop policy if exists "Public can view packages" on public.packages;
create policy "Public can view packages"
on public.packages for select to anon, authenticated using (true);

drop policy if exists "Authenticated admins can create packages" on public.packages;
create policy "Authenticated admins can create packages"
on public.packages for insert to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated admins can update packages" on public.packages;
create policy "Authenticated admins can update packages"
on public.packages for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated admins can delete packages" on public.packages;
create policy "Authenticated admins can delete packages"
on public.packages for delete to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
on public.bookings for insert to anon, authenticated
with check (status = 'pending' and payment_status = 'unpaid');

drop policy if exists "Authenticated admins can view bookings" on public.bookings;
create policy "Authenticated admins can view bookings"
on public.bookings for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated admins can update bookings" on public.bookings;
create policy "Authenticated admins can update bookings"
on public.bookings for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated admins can delete bookings" on public.bookings;
create policy "Authenticated admins can delete bookings"
on public.bookings for delete to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews"
on public.reviews for select to anon, authenticated using (is_approved = true);

drop policy if exists "Admins can view all reviews" on public.reviews;
create policy "Admins can view all reviews"
on public.reviews for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can submit reviews" on public.reviews;
create policy "Public can submit reviews"
on public.reviews for insert to anon, authenticated with check (is_approved = false);

drop policy if exists "Authenticated admins can manage reviews" on public.reviews;
create policy "Authenticated admins can manage reviews"
on public.reviews for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated admins can delete reviews" on public.reviews;
create policy "Authenticated admins can delete reviews"
on public.reviews for delete to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages for insert to anon, authenticated with check (true);
grant insert on table public.contact_messages to anon, authenticated;

drop policy if exists "Authenticated admins can view contact messages" on public.contact_messages;
create policy "Authenticated admins can view contact messages"
on public.contact_messages for select to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
grant select on table public.contact_messages to authenticated;

drop policy if exists "Authenticated admins can update contact messages" on public.contact_messages;
create policy "Authenticated admins can update contact messages"
on public.contact_messages for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Authenticated admins can delete contact messages" on public.contact_messages;
create policy "Authenticated admins can delete contact messages"
on public.contact_messages for delete to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
