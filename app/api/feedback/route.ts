import { NextRequest, NextResponse } from 'next/server';

interface FeedbackPayload {
  name: string;
  message: string;
  page?: string;
  userAgent?: string;
}

async function sendToGoogleAppsScript(payload: FeedbackPayload): Promise<void> {
  const webhook = process.env.FEEDBACK_GOOGLE_WEBHOOK_URL;
  if (!webhook) {
    return;
  }

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google webhook failed with ${response.status}`);
  }
}

async function sendToAirtable(payload: FeedbackPayload): Promise<void> {
  const token = process.env.AIRTABLE_API_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || 'Feedback';
  if (!token || !baseId) {
    return;
  }

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: payload.name,
            Message: payload.message,
            Page: payload.page || '',
            UserAgent: payload.userAgent || '',
            Timestamp: new Date().toISOString(),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airtable write failed: ${response.status} ${text}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<FeedbackPayload>;
    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 });
    }

    const payload: FeedbackPayload = {
      name: body.name?.trim() || 'Anonymous',
      message,
      page: body.page?.trim() || '/',
      userAgent: body.userAgent?.trim() || '',
    };

    const hasGoogle = !!process.env.FEEDBACK_GOOGLE_WEBHOOK_URL;
    const hasAirtable = !!process.env.AIRTABLE_API_TOKEN && !!process.env.AIRTABLE_BASE_ID;
    if (!hasGoogle && !hasAirtable) {
      return NextResponse.json(
        { success: false, error: 'Feedback destination is not configured' },
        { status: 500 }
      );
    }

    const tasks: Promise<void>[] = [];
    if (hasGoogle) {
      tasks.push(sendToGoogleAppsScript(payload));
    }
    if (hasAirtable) {
      tasks.push(sendToAirtable(payload));
    }
    await Promise.all(tasks);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit feedback',
      },
      { status: 500 }
    );
  }
}
