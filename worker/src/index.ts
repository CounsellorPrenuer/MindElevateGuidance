type Env = {
  DB: D1Database;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  ALLOWED_ORIGINS: string;
};

type LeadPayload = {
  formType: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  metadata?: Record<string, unknown>;
  source?: string;
  submittedAt?: string;
};

type CreateOrderPayload = {
  planId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  couponCode?: string;
};

const PLAN_PRICES: Record<string, number> = {
  'pkg-1': 5500,
  'pkg-2': 15000,
  'pkg-3': 5999,
  'pkg-4': 10599,
  'pkg-5': 6499,
  'pkg-6': 10599,
  'mp-3': 6499,
  'mp-2': 10599,
  'career-report': 1500,
  'career-report-counselling': 3000,
  'knowledge-gateway': 100,
  'one-to-one-session': 3500,
  'college-admission-planning': 3000,
  'exam-stress-management': 1000,
  'cap-100': 199,
};

function corsHeaders(origin: string | null, allowedOrigins: string) {
  const allowList = allowedOrigins.split(',').map((item) => item.trim()).filter(Boolean);
  const allowed = origin && allowList.some((entry) => origin === entry || origin.startsWith(`${entry}/`));

  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowList[0] || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    Vary: 'Origin',
    'Content-Type': 'application/json',
  };
}

function json(data: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(data), { status, headers });
}

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function hmacSHA256(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getCouponDiscount(baseAmount: number, couponRow: any) {
  if (!couponRow) return { discountAmount: 0, reason: 'Coupon not found.' };
  if (!couponRow.active) return { discountAmount: 0, reason: 'Coupon inactive.' };
  if (couponRow.expires_at && Date.now() > Date.parse(couponRow.expires_at)) {
    return { discountAmount: 0, reason: 'Coupon expired.' };
  }
  if (baseAmount < (couponRow.min_amount || 0)) {
    return { discountAmount: 0, reason: `Minimum amount is INR ${couponRow.min_amount}.` };
  }

  let discountAmount = 0;
  if (couponRow.discount_type === 'percent') {
    discountAmount = Math.floor((baseAmount * couponRow.value) / 100);
  } else {
    discountAmount = couponRow.value;
  }

  if (couponRow.max_discount && discountAmount > couponRow.max_discount) {
    discountAmount = couponRow.max_discount;
  }

  if (discountAmount > baseAmount) discountAmount = baseAmount;
  return { discountAmount, reason: '' };
}

async function saveLead(env: Env, payload: LeadPayload) {
  const id = generateId('lead');
  await env.DB.prepare(
    `INSERT INTO leads (id, form_type, name, email, phone, message, metadata, source, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      payload.formType,
      payload.name,
      payload.email,
      payload.phone || null,
      payload.message,
      payload.metadata ? JSON.stringify(payload.metadata) : null,
      payload.source || 'mindelevate-guidance-site',
      payload.submittedAt || new Date().toISOString(),
    )
    .run();

  return id;
}

async function createRazorpayOrder(env: Env, amountRupees: number) {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const receipt = `mindelevate_${Date.now()}`;

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountRupees * 100,
      currency: 'INR',
      receipt,
      notes: {
        source: 'mindelevate-guidance-site',
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Razorpay order failed: ${text}`);
  }

  return response.json<any>();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS || '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    try {
      if (url.pathname === '/health') {
        return json({ ok: true }, 200, headers);
      }

      if (request.method === 'POST' && url.pathname === '/api/forms/submit') {
        const payload = (await request.json()) as LeadPayload;
        if (!payload?.name || !payload?.email || !payload?.formType) {
          return json({ error: 'Missing required fields.' }, 400, headers);
        }

        const id = await saveLead(env, payload);
        return json({ success: true, id }, 200, headers);
      }

      if (request.method === 'POST' && url.pathname === '/api/coupons/preview') {
        const body = (await request.json()) as { planId: string; couponCode?: string };
        const baseAmount = PLAN_PRICES[body.planId];
        if (!baseAmount) return json({ valid: false, reason: 'Invalid plan.' }, 400, headers);

        const code = body.couponCode?.trim().toUpperCase();
        if (!code) {
          return json({ valid: false, reason: 'Coupon is empty.' }, 200, headers);
        }

        const couponRow = await env.DB.prepare('SELECT * FROM coupons WHERE code = ?').bind(code).first<any>();
        const { discountAmount, reason } = getCouponDiscount(baseAmount, couponRow);

        if (!discountAmount) {
          return json({ valid: false, reason: reason || 'Coupon invalid.' }, 200, headers);
        }

        return json(
          {
            valid: true,
            code,
            discountAmount,
            finalAmount: baseAmount - discountAmount,
          },
          200,
          headers,
        );
      }

      if (request.method === 'POST' && url.pathname === '/api/payments/create-order') {
        const payload = (await request.json()) as CreateOrderPayload;

        if (!payload?.planId || !payload?.customerName || !payload?.customerEmail || !payload?.customerPhone) {
          return json({ error: 'Missing required fields.' }, 400, headers);
        }

        const baseAmount = PLAN_PRICES[payload.planId];
        if (!baseAmount) return json({ error: 'Invalid plan ID.' }, 400, headers);

        let discountAmount = 0;
        let appliedCoupon: string | null = null;

        const couponCode = payload.couponCode?.trim().toUpperCase();
        if (couponCode) {
          const couponRow = await env.DB.prepare('SELECT * FROM coupons WHERE code = ?').bind(couponCode).first<any>();
          const discountResult = getCouponDiscount(baseAmount, couponRow);
          if (discountResult.discountAmount > 0) {
            discountAmount = discountResult.discountAmount;
            appliedCoupon = couponCode;
          }
        }

        const finalAmount = baseAmount - discountAmount;
        const razorpayOrder = await createRazorpayOrder(env, finalAmount);

        const now = new Date().toISOString();
        const paymentId = generateId('payment');

        await env.DB.prepare(
          `INSERT INTO payments (
            id, order_id, plan_id, customer_name, customer_email, customer_phone,
            coupon_code, base_amount, discount_amount, final_amount, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            paymentId,
            razorpayOrder.id,
            payload.planId,
            payload.customerName,
            payload.customerEmail,
            payload.customerPhone,
            appliedCoupon,
            baseAmount,
            discountAmount,
            finalAmount,
            'created',
            now,
            now,
          )
          .run();

        return json(
          {
            keyId: env.RAZORPAY_KEY_ID,
            orderId: razorpayOrder.id,
            currency: 'INR',
            amount: razorpayOrder.amount,
            baseAmount,
            discountAmount,
            finalAmount,
          },
          200,
          headers,
        );
      }

      if (request.method === 'POST' && url.pathname === '/api/payments/verify') {
        const payload = (await request.json()) as { orderId: string; paymentId: string; signature: string };
        if (!payload?.orderId || !payload?.paymentId || !payload?.signature) {
          return json({ error: 'Missing verification fields.' }, 400, headers);
        }

        const generated = await hmacSHA256(
          env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET,
          `${payload.orderId}|${payload.paymentId}`,
        );

        if (generated !== payload.signature) {
          return json({ success: false, error: 'Invalid signature.' }, 400, headers);
        }

        await env.DB.prepare(
          `UPDATE payments
           SET status = ?, razorpay_payment_id = ?, updated_at = ?
           WHERE order_id = ?`,
        )
          .bind('paid', payload.paymentId, new Date().toISOString(), payload.orderId)
          .run();

        return json({ success: true }, 200, headers);
      }

      return json({ error: 'Not found' }, 404, headers);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return json({ error: message }, 500, headers);
    }
  },
};

