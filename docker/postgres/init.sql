CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'provider', 'admin')),
  suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Tag',
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(id),
  description TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  coverage_area TEXT,
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  services TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  sponsored BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  views INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected', 'suspended'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS reviews_unique_user_listing
ON reviews(listing_id, user_id)
WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

INSERT INTO categories (id, name, icon, enabled) VALUES
('plumbing', 'Plumbing', 'Droplets', TRUE),
('electrical', 'Electrical', 'Zap', TRUE),
('mechanics', 'Mechanics', 'Wrench', TRUE),
('painting', 'Painting', 'PaintBucket', TRUE),
('cleaning', 'Cleaning', 'SprayCan', TRUE),
('tutoring', 'Tutoring', 'GraduationCap', TRUE),
('beauty', 'Beauty & Wellness', 'Sparkles', TRUE),
('construction', 'Construction', 'HardHat', TRUE),
('gardening', 'Gardening', 'TreeDeciduous', TRUE),
('catering', 'Catering', 'ChefHat', TRUE),
('transport', 'Transport', 'Truck', TRUE),
('it-services', 'IT Services', 'Monitor', TRUE),
('other', 'Other', 'Tag', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, phone, password_hash, role, suspended) VALUES
('u1', 'Admin User', 'admin@finditnamibia.na', '+264811111111', 'f0f5d51ea126f1ce9ef3f578911f40a7:c7b2d03e5da06fedf1f0fcc81994e5a29be5cd6cc4973210c7f0e6944f2d4295c86ab5b4197989d2218f903ca92cb7f3894f24bad2f0eb7afae8e455e00d5fc4', 'admin', FALSE),
('u2', 'Provider Demo', 'provider@example.na', '+264822222222', 'f0f5d51ea126f1ce9ef3f578911f40a7:a845c1611c287f8806b75923e6dc5b52dcb6ce39ec0140ef6e712b48a41ecd318eb8198978dc5ccb0513dc688100a2a32f5eb1ced014d2947c40cca2c6e264e1', 'provider', FALSE),
('u3', 'User Demo', 'user@example.na', '+264833333333', 'f0f5d51ea126f1ce9ef3f578911f40a7:4f7374ab2a965e118ab1141182a7c814cc25c09a4fcb1950c46cc96478dad08f1966f99eb0a8b25b791ea6be012d08a29d5bfb0f83ff7b2c5f4ee0660aecc2f5', 'user', FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO providers (
  id, owner_user_id, business_name, category, description, short_description, location, coverage_area, address, phone, whatsapp, email, logo_url, images,
  rating, review_count, services, featured, verified, sponsored, created_at, views, clicks, status
)
VALUES
('1', 'u2', 'John''s Plumbing Services', 'plumbing', 'Professional plumbing services in Windhoek and surrounding areas.', 'Trusted plumbing experts', 'Windhoek, Namibia', 'Windhoek and nearby areas', 'Independence Ave', '+264 81 234 5678', '+264 81 234 5678', 'john@plumbing.na', '/placeholder-logo.svg', ARRAY['/placeholder.jpg'], 4.8, 3, ARRAY['Pipe Repairs','Drain Cleaning','Water Heater Installation'], TRUE, TRUE, FALSE, '2024-01-15', 1523, 342, 'approved'),
('2', 'u2', 'Elite Electrical CC', 'electrical', 'Certified electrical contractors for residential and commercial jobs.', 'Certified electrical specialists', 'Klein Windhoek, Namibia', 'Windhoek metro area', 'Sam Nujoma Dr', '+264 81 345 6789', '+264 81 345 6789', 'info@eliteelectrical.na', '/placeholder-logo.svg', ARRAY['/placeholder.jpg'], 4.9, 2, ARRAY['Electrical Installations','Wiring','Solar Panel Installation'], TRUE, TRUE, TRUE, '2024-02-10', 982, 215, 'approved'),
('3', 'u2', 'Namibia Auto Care', 'mechanics', 'Full-service auto repair and maintenance center.', 'Reliable car maintenance and repairs', 'Katutura, Windhoek', 'Windhoek', 'Mandume Rd', '+264 81 456 7890', '+264 81 456 7890', 'service@namibiaautocare.na', '/placeholder-logo.svg', ARRAY['/placeholder.jpg'], 4.6, 2, ARRAY['Engine Repairs','Brake Services','Vehicle Diagnostics'], TRUE, TRUE, FALSE, '2023-11-20', 2341, 567, 'approved'),
('p1', NULL, 'Quick Fix Handyman', 'construction', 'General handyman services for all your home repair needs.', 'General home repairs', 'Khomasdal, Windhoek', 'Khomasdal', 'Main Rd', '+264 81 555 1234', '+264 81 555 1234', 'quickfix@email.na', '', ARRAY[]::text[], 0, 0, ARRAY['Home Repairs','Furniture Assembly','Minor Plumbing','Painting'], FALSE, FALSE, FALSE, '2024-04-20', 0, 0, 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, listing_id, user_id, user_name, rating, comment, flagged, created_at, updated_at) VALUES
('r1', '1', 'u3', 'User Demo', 5, 'Excellent service! Quick and professional.', FALSE, '2024-04-15', '2024-04-15'),
('r2', '2', NULL, 'Anna Kamati', 5, 'Professional and efficient.', FALSE, '2024-04-08', '2024-04-08'),
('r3', '3', NULL, 'Emma Hausiku', 4, 'Good service and fair prices.', FALSE, '2024-04-09', '2024-04-09')
ON CONFLICT (id) DO NOTHING;
