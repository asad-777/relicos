import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const MOCK_GAMES = [
  {
    id: '1',
    title: 'Celeste Classic',
    description: 'A Pico-8 platformer classic.',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMjg2NzgvMTI2NzQ5LnBuZw==/original/H3%2F9M0.png',
    embed_url: 'https://itch.io/embed-upload/28678',
    status: 'approved'
  },
  {
    id: '2',
    title: 'Space Huggers',
    description: 'A run and gun action game.',
    thumbnail: 'https://img.itch.zone/aW1hZ2UvMTAzNTAwMC81OTA4NzAyLnBuZw==/315x250%23c/yXhZ3R.png',
    embed_url: 'https://itch.io/embed-upload/1035000',
    status: 'approved'
  }
];

export async function GET(request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ games: MOCK_GAMES });
  }

  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ games: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
