import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host');
  const allowedOrigin = host?.startsWith('localhost') ? `http://localhost` : `https://${host}`;

  const origin = request.headers.get('origin') || request.headers.get('referer');

  if (!origin || !origin.startsWith(allowedOrigin)) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing "url" query parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const body = await response.json();

    return NextResponse.json(body, {
      headers: { 'Content-Type': 'application/json' },
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch the provided URL', details: (error as Error).message },
      { status: 500 },
    );
  }
}
