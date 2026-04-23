-- Enable pgvector extension
create extension if not exists vector;

-- Thoughts table
-- Uses 384-dim vectors produced by Supabase AI (gte-small)
create table thoughts (
  id         uuid        primary key default gen_random_uuid(),
  content    text        not null,
  embedding  vector(384),
  metadata   jsonb       not null default '{}',
  created_at timestamptz not null default now()
);

-- IVFFlat index for fast approximate nearest-neighbor search
create index thoughts_embedding_idx
  on thoughts
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Index created_at for list_recent queries
create index thoughts_created_at_idx on thoughts (created_at desc);

-- -----------------------------------------------------------------------
-- match_thoughts: semantic similarity search via cosine distance
-- -----------------------------------------------------------------------
create or replace function match_thoughts(
  query_embedding  vector(384),
  match_threshold  float   default 0.7,
  match_count      integer default 10
)
returns table (
  id         uuid,
  content    text,
  metadata   jsonb,
  created_at timestamptz,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    metadata,
    created_at,
    1 - (embedding <=> query_embedding) as similarity
  from thoughts
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
