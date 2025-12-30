-- Create quizzes table
create table if not exists quizzes (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  description text,
  is_active boolean default false,
  type text default 'personality' not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create quiz_profiles table
create table if not exists quiz_profiles (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  name text not null,
  description_result text,
  is_active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(quiz_id, name)
);

-- Create quiz_questions table
create table if not exists quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  question_text text not null,
  "order" integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create quiz_answers table
create table if not exists quiz_answers (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references quiz_questions(id) on delete cascade not null,
  answer_text text not null,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create quiz_answer_influences table
create table if not exists quiz_answer_influences (
  id uuid default gen_random_uuid() primary key,
  answer_id uuid references quiz_answers(id) on delete cascade not null,
  profile_id uuid references quiz_profiles(id) on delete cascade not null,
  weight integer not null default 1,
  created_at timestamptz default now(),
  unique(answer_id, profile_id)
);

-- Enable RLS
alter table quizzes enable row level security;
alter table quiz_profiles enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_answers enable row level security;
alter table quiz_answer_influences enable row level security;

-- Policies
create policy "Public read access" on quizzes for select using (true);
create policy "Public read access" on quiz_profiles for select using (true);
create policy "Public read access" on quiz_questions for select using (true);
create policy "Public read access" on quiz_answers for select using (true);
create policy "Public read access" on quiz_answer_influences for select using (true);

-- Extensions for updated_at (assuming moddatetime is available)
create extension if not exists moddatetime schema extensions;

drop trigger if exists handle_updated_at on quizzes;
create trigger handle_updated_at before update on quizzes for each row execute procedure moddatetime (updated_at);

drop trigger if exists handle_updated_at on quiz_profiles;
create trigger handle_updated_at before update on quiz_profiles for each row execute procedure moddatetime (updated_at);

drop trigger if exists handle_updated_at on quiz_questions;
create trigger handle_updated_at before update on quiz_questions for each row execute procedure moddatetime (updated_at);

drop trigger if exists handle_updated_at on quiz_answers;
create trigger handle_updated_at before update on quiz_answers for each row execute procedure moddatetime (updated_at);
