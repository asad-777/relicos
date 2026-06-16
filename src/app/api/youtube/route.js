import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const html = await response.text();
    
    // Extract ytInitialData
    const match = html.match(/var ytInitialData = (\{.*?\});/);
    if (!match) {
      throw new Error('Could not parse YouTube initial data');
    }

    const data = JSON.parse(match[1]);
    const results = [];
    
    const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
    if (contents && contents.length > 0) {
      const items = contents[0]?.itemSectionRenderer?.contents || [];
      
      for (const item of items) {
        if (item.videoRenderer) {
          const v = item.videoRenderer;
          results.push({
            id: v.videoId,
            title: v.title?.runs?.[0]?.text || 'Unknown Title',
            author: v.ownerText?.runs?.[0]?.text || 'Unknown Author',
            duration: v.lengthText?.simpleText || '',
            views: v.viewCountText?.simpleText || '',
            thumbnail: v.thumbnail?.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`
          });
        }
        if (results.length >= 10) break; // Limit to top 10 results
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('YouTube Search API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
