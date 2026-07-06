CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  form_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  metadata TEXT,
  source TEXT,
  submitted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL,
  value INTEGER NOT NULL,
  min_amount INTEGER DEFAULT 0,
  max_discount INTEGER,
  active INTEGER DEFAULT 1,
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  coupon_code TEXT,
  base_amount INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL,
  final_amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  razorpay_payment_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR REPLACE INTO coupons (code, discount_type, value, min_amount, max_discount, active)
VALUES
  ('WELCOME10', 'percent', 10, 1000, 1500, 1),
  ('CAREER500', 'flat', 500, 3000, NULL, 1),
  ('DISCOVER15', 'percent', 15, 5000, 2000, 1);
