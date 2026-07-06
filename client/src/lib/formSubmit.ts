export type FormPayload = {
  formType: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  metadata?: Record<string, unknown>;
};

const MAIL_RECIPIENT = 'gladis69diana@gmail.com';

function getApiBase() {
  const base = import.meta.env.VITE_CLOUDFLARE_API_BASE;
  return base ? base.replace(/\/$/, '') : '';
}

function getFormsEndpoint() {
  const base = getApiBase();
  if (!base) {
    return '';
  }

  return `${base}/api/forms/submit`;
}

export async function saveLeadToCloudflare(payload: FormPayload): Promise<boolean> {
  const endpoint = getFormsEndpoint();
  if (!endpoint) {
    return false;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        source: 'mindelevate-guidance-site',
        submittedAt: new Date().toISOString(),
      }),
      keepalive: true,
      mode: 'cors',
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function saveLeadToCloudflareBackground(payload: FormPayload) {
  const endpoint = getFormsEndpoint();
  if (!endpoint) {
    return;
  }

  const body = JSON.stringify({
    ...payload,
    source: 'mindelevate-guidance-site',
    submittedAt: new Date().toISOString(),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    }
  } catch {
    // Ignore and fallback to fetch.
  }

  void fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
    mode: 'cors',
  });
}

export function openMailDraft(subject: string, body: string) {
  const mailto = `mailto:${MAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

export async function postWorkerJson<T>(path: string, payload: unknown): Promise<T> {
  const base = getApiBase();
  if (!base) {
    throw new Error('Cloudflare API base URL is not configured.');
  }

  const response = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    mode: 'cors',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
