-- RLS para el frontend Angular usando Supabase Auth.
-- Ejecutar despues de supabase_uuid_migration.sql.

begin;

grant usage on schema public to anon, authenticated;
grant select on public.products, public.categories to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.carts to authenticated;
grant select, insert, update, delete on public.cart_items to authenticated;
grant select on public.orders, public.order_items to authenticated;

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products
for select to anon, authenticated using (true);

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories
for select to anon, authenticated using (true);

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile" on public.profiles
for select to authenticated using (id = (select auth.uid()));

drop policy if exists "Users can access their carts" on public.carts;
create policy "Users can access their carts" on public.carts
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Users can access their cart items" on public.cart_items;
create policy "Users can access their cart items" on public.cart_items
for all to authenticated
using (exists (
  select 1 from public.carts c
  where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.carts c
  where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
));

drop policy if exists "Users can read their orders" on public.orders;
create policy "Users can read their orders" on public.orders
for select to authenticated using (exists (
  select 1 from public.carts c
  where c.id = orders.cart_id and c.user_id = (select auth.uid())
));

drop policy if exists "Users can read their order items" on public.order_items;
create policy "Users can read their order items" on public.order_items
for select to authenticated using (exists (
  select 1 from public.orders o
  join public.carts c on c.id = o.cart_id
  where o.id = order_items.order_id and c.user_id = (select auth.uid())
));

commit;
