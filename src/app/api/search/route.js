import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // Use Wikipedia API for reliable, unblocked search results
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
    
    const response = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'RelicOS-Browser/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    const results = [];

    if (data.query && data.query.search) {
      const topResults = data.query.search.slice(0, 5); // Top 5 results
      
      topResults.forEach(item => {
        // Strip HTML from snippet (Wikipedia wraps matches in <span class="searchmatch">)
        const cleanSnippet = item.snippet.replace(/<[^>]*>?/gm, '').trim();
        
        results.push({
          title: item.title,
          url: `https://en.m.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
          snippet: cleanSnippet + '...'
        });
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
