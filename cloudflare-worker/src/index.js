const ALLOWED_ORIGINS = new Set(['https://mzissana.ru', 'https://www.mzissana.ru']);

function response(body, status = 200, origin = '') {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function clean(value, limit) {
  return typeof value === 'string' ? value.trim().replace(/<[^>]*>/g, '').slice(0, limit) : '';
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      if (!ALLOWED_ORIGINS.has(origin)) return response({ ok: false }, 403, origin);
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          Vary: 'Origin',
        },
      });
    }

    if (request.method !== 'POST' || !ALLOWED_ORIGINS.has(origin)) {
      return response({ ok: false }, 403, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return response({ ok: false }, 400, origin);
    }

    if (payload.website) return response({ ok: true }, 200, origin);

    const name = clean(payload.name, 120);
    const grade = clean(payload.grade, 80);
    const goal = clean(payload.goal, 250);
    const message = clean(payload.message, 1500);

    if (!name || !message) return response({ ok: false }, 422, origin);
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return response({ ok: false }, 503, origin);
    }

    const text = [
      'Новая заявка с сайта MzissanaEnglish',
      '',
      `Имя: ${name}`,
      `Класс: ${grade || 'не указан'}`,
      `Цель: ${goal || 'не указана'}`,
      '',
      'Сообщение:',
      message,
    ].join('\n');

    const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
    });

    if (!telegram.ok) {
      console.error(`Telegram request failed with status ${telegram.status}`);
      return response({ ok: false }, 502, origin);
    }

    return response({ ok: true }, 200, origin);
  },
};
