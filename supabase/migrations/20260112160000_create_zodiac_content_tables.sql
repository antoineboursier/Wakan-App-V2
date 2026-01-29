create table if not exists public.zodiac_signs (
  slug text primary key,
  display_name text not null,
  description_main text,
  icon_glow text,
  hero_image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.zodiac_signs enable row level security;

-- Policies
create policy "Allow public read access"
  on public.zodiac_signs
  for select
  to public
  using (true);

create policy "Allow authenticated admin full access"
  on public.zodiac_signs
  for all
  to authenticated
  using (true)
  with check (true);

-- Insert initial data (from our hardcoded file)
insert into public.zodiac_signs (slug, display_name, description_main, icon_glow, hero_image) values
('aries', 'Bélier', 'Audacieux et pionnier, vous ouvrez la voie avec énergie.', 'mdi:zodiac-aries', '/zodiac/aries-hero.png'),
('taurus', 'Taureau', 'Stable et sensoriel, vous bâtissez pour durer.', 'mdi:zodiac-taurus', '/zodiac/taurus-hero.png'),
('gemini', 'Gémeaux', 'Curieux et adaptable, vous connectez les idées et les gens.', 'mdi:zodiac-gemini', '/zodiac/gemini-hero.png'),
('cancer', 'Cancer', 'Protecteur et intuitif, vous veillez sur votre clan.', 'mdi:zodiac-cancer', '/zodiac/cancer-hero.png'),
('leo', 'Lion', 'Rayonnant et créatif, vous inspirez par votre présence.', 'mdi:zodiac-leo', '/zodiac/leo-hero.png'),
('virgo', 'Vierge', 'Précis et serviable, vous cherchez la perfection au quotidien.', 'mdi:zodiac-virgo', '/zodiac/virgo-hero.png'),
('libra', 'Balance', 'Harmonieux et diplomate, vous cherchez l\'équilibre en tout.', 'mdi:zodiac-libra', '/zodiac/libra-hero.png'),
('scorpio', 'Scorpion', 'Intense et perspicace, vous allez au fond des choses.', 'mdi:zodiac-scorpio', '/zodiac/scorpio-hero.png'),
('sagittarius', 'Sagittaire', 'Optimiste et aventurier, vous visez toujours plus loin.', 'mdi:zodiac-sagittarius', '/zodiac/sagittarius-hero.png'),
('capricorn', 'Capricorne', 'Ambitieux et persévérant, vous gravissez les sommets.', 'mdi:zodiac-capricorn', '/zodiac/capricorn-hero.png'),
('aquarius', 'Verseau', 'Original et visionnaire, vous réinventez le futur.', 'mdi:zodiac-aquarius', '/zodiac/aquarius-hero.png'),
('pisces', 'Poissons', 'Sensible et rêveur, vous êtes connecté à l\'invisible.', 'mdi:zodiac-pisces', '/zodiac/pisces-hero.png')
on conflict (slug) do nothing;
