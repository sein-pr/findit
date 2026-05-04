CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  coverage_area TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  services TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  views INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved'
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO providers (
  id, business_name, category, description, location, coverage_area, phone, whatsapp, email, images,
  rating, review_count, services, featured, verified, created_at, views, clicks, status
)
VALUES
(
  '1',
  'John''s Plumbing Services',
  'plumbing',
  'Professional plumbing services in Windhoek and surrounding areas.',
  'Windhoek, Namibia',
  'Windhoek and nearby areas',
  '+264 81 234 5678',
  '+264 81 234 5678',
  'john@plumbing.na',
  ARRAY['/placeholder.jpg'],
  4.8,
  3,
  ARRAY['Pipe Repairs','Drain Cleaning','Water Heater Installation'],
  TRUE,
  TRUE,
  '2024-01-15',
  1523,
  342,
  'approved'
),
(
  '2',
  'Elite Electrical CC',
  'electrical',
  'Certified electrical contractors for residential and commercial jobs.',
  'Klein Windhoek, Namibia',
  'Windhoek metro area',
  '+264 81 345 6789',
  '+264 81 345 6789',
  'info@eliteelectrical.na',
  ARRAY['/placeholder.jpg'],
  4.9,
  2,
  ARRAY['Electrical Installations','Wiring','Solar Panel Installation'],
  TRUE,
  TRUE,
  '2024-02-10',
  982,
  215,
  'approved'
),
(
  '3',
  'Namibia Auto Care',
  'mechanics',
  'Full-service auto repair and maintenance center.',
  'Katutura, Windhoek',
  'Windhoek',
  '+264 81 456 7890',
  '+264 81 456 7890',
  'service@namibiaautocare.na',
  ARRAY['/placeholder.jpg'],
  4.6,
  2,
  ARRAY['Engine Repairs','Brake Services','Vehicle Diagnostics'],
  TRUE,
  TRUE,
  '2023-11-20',
  2341,
  567,
  'approved'
),
(
  '4',
  'Sparkle Clean Services',
  'cleaning',
  'Professional cleaning services for homes and offices.',
  'Eros, Windhoek',
  'Windhoek',
  '+264 81 678 9012',
  '+264 81 678 9012',
  'book@sparkleclean.na',
  ARRAY['/placeholder.jpg'],
  4.5,
  1,
  ARRAY['Home Cleaning','Office Cleaning','Deep Cleaning'],
  TRUE,
  TRUE,
  '2024-01-28',
  1876,
  423,
  'approved'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, listing_id, user_name, rating, comment, created_at)
VALUES
('r1', '1', 'Maria Shikongo', 5, 'Excellent service! Quick and professional.', '2024-04-15'),
('r2', '1', 'Peter Nghipondoka', 5, 'Very reliable and honest.', '2024-04-10'),
('r3', '1', 'Susan van Wyk', 4, 'Good service and on time.', '2024-04-05'),
('r4', '2', 'Thomas Hamutenya', 5, 'Installed our solar setup perfectly.', '2024-04-12'),
('r5', '2', 'Anna Kamati', 5, 'Professional and efficient.', '2024-04-08'),
('r6', '3', 'David Shipanga', 5, 'Best mechanics in Windhoek.', '2024-04-14'),
('r7', '3', 'Emma Hausiku', 4, 'Good service and fair prices.', '2024-04-09'),
('r8', '4', 'Grace Nangolo', 5, 'Amazing attention to detail.', '2024-04-11')
ON CONFLICT (id) DO NOTHING;
