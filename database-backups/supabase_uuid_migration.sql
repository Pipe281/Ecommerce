-- Migracion de usuarios numericos a Supabase Auth UUID.
-- Ejecutar despues de crear los usuarios correspondientes en Authentication > Users.
-- public.users se conserva como respaldo historico.

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(100) not null,
  email varchar(255) not null unique,
  created_at timestamptz not null default now()
);

-- Migra los perfiles que ya existen en Supabase Auth y conserva el nombre historico.
insert into public.profiles (id, username, email, created_at)
select
  au.id,
  coalesce(u.username, split_part(au.email, '@', 1)),
  au.email,
  coalesce(u.created_at, now())
from auth.users au
left join public.users u on lower(u.email) = lower(au.email)
where au.email is not null
on conflict (id) do update set
  username = excluded.username,
  email = excluded.email;

-- Crea perfiles automaticamente para futuros registros de Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Conserva el id numerico original y agrega el UUID de auth.users.
alter table public.carts drop constraint if exists fk_carts_user;
alter table public.carts rename column user_id to legacy_user_id;
alter table public.carts add column if not exists user_id uuid;

-- Los usuarios nuevos no tienen un id numerico historico.
alter table public.carts alter column legacy_user_id drop not null;

update public.carts c
set user_id = p.id
from public.users u
join public.profiles p on lower(p.email) = lower(u.email)
where c.legacy_user_id = u.id;

alter table public.carts
  add constraint fk_carts_profile
  foreign key (user_id) references public.profiles(id) on delete cascade;

commit;

-- Despues de confirmar que todos los usuarios tienen Auth:
-- 1. Elimina carritos con user_id null si son datos de prueba.
-- 2. Cambia user_id a NOT NULL.
-- 3. Elimina legacy_user_id y la tabla public.users cuando ya no la necesites.
