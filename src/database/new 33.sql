
-- Drop all dependent tables safely
DROP TABLE IF EXISTS customers,service_categories,services,products,product_categories,service_products,appointments,appointment_services,appointment_products,payments,promo_codes,invoices,staff_availability,staff,profiles,users,histories CASCADE;

DROP TYPE IF EXISTS appointment_status,payment_method,payment_type,gender_enum,action_enum,role_enum;

-- Enums
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'rescheduled', 'in_progress', 'completed', 'no_show', 'awaiting_payment', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank', 'pos', 'discount', 'promo_code');
CREATE TYPE payment_type AS ENUM ('income', 'expense');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE action_enum AS ENUM ('INSERT', 'UPDATE', 'DELETE');
CREATE TYPE role_enum AS ENUM ('cash', 'customer', 'super_admin','admin', 'staff', 'appointment', 'reception','service','product');

-- Unified Users Table (customers + staff + admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Login info
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT,

    -- Contact
    phone TEXT UNIQUE NOT NULL,

    -- Names
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,

    -- Customer info
    gender gender_enum,
    birth_date DATE,
    note TEXT,

    -- Profile
    avatar_url TEXT,

    -- Role
    role role_enum DEFAULT 'customer',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Service categories
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Services
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    benefits TEXT[],
    price NUMERIC NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    details TEXT,
    how_to_use TEXT,
    ingredients TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Product-Category link (M:N)
CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Product-Service relation (M:N)
CREATE TABLE service_products (
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, product_id)
);

-- Staff table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    position TEXT,
    specializations INTEGER[] ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);
-- Staff availability
CREATE TABLE staff_availability (
    staff_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weekday INTEGER CHECK (weekday BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY (staff_user_id, weekday)
);
-- Appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total NUMERIC,
    status appointment_status DEFAULT 'scheduled',
    cancel_reason TEXT,
    is_no_show BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Appointment Services
CREATE TABLE appointment_services (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    duration INTEGER,
    price NUMERIC
);

-- Appointment Products
CREATE TABLE appointment_products (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER,
    price NUMERIC,
    amount NUMERIC
);

-- Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    type payment_type NOT NULL,
    method payment_method NOT NULL,
    amount NUMERIC NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Promo Codes
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER CHECK (discount_percent BETWEEN 0 AND 100),
    valid_from DATE,
    valid_to DATE,
    max_usage INTEGER,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC NOT NULL,
    appointment_status TEXT,
    issued_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);


-- Histories
CREATE TABLE histories (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    source_id TEXT NOT NULL,
    action action_enum DEFAULT 'UPDATE',
    history JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Update trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- History insert trigger function
CREATE OR REPLACE FUNCTION log_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO histories(table_name, source_id, action, history)
  VALUES (TG_TABLE_NAME, OLD.id::TEXT, TG_OP::action_enum, to_jsonb(OLD));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggerləri tətbiq et

-- users
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON users 
FOR EACH ROW EXECUTE FUNCTION log_history();


-- service_categories
CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_categories 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON service_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON service_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- services
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON services 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- product_categories
CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_categories 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON product_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON product_categories 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- service_products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON service_products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON service_products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- appointments
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointments 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- appointment_services
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointment_services 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointment_services 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointment_services 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- appointment_products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointment_products 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON appointment_products 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON appointment_products 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- payments
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON payments 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON payments 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- promo_codes
CREATE TRIGGER set_updated_at BEFORE UPDATE ON promo_codes 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON promo_codes 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON promo_codes 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- invoices
CREATE TRIGGER set_updated_at BEFORE UPDATE ON invoices 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON invoices 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON invoices 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- staff_availability
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff_availability 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON staff_availability 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON staff_availability 
FOR EACH ROW EXECUTE FUNCTION log_history();

-- staff
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER log_history_trigger AFTER UPDATE ON staff 
FOR EACH ROW EXECUTE FUNCTION log_history();
CREATE TRIGGER log_history_delete AFTER DELETE ON staff 
FOR EACH ROW EXECUTE FUNCTION log_history();



TRUNCATE TABLE histories, staff_availability, invoices, promo_codes, payments, appointment_products, appointment_services, appointments, service_products, product_categories, products, services, service_categories, staff, users CASCADE;

-- password: admin123
-- Insert users-- Unified mock users (admin, staff, customer)
-- Admin user
INSERT INTO users (id, email, hashed_password, phone, first_name, last_name, full_name, gender, birth_date, note, avatar_url, role) 
VALUES ('5599e156-42b5-4d8b-882e-2ef1ede5de45', 'admin@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '1234567890', 'Irma', 'Wisoky', 'Irma Wisoky', 'female', NULL, NULL, 'https://avatars.githubusercontent.com/u/14069376', 'admin');

-- Staff users
INSERT INTO users (id, email, hashed_password, phone, first_name, last_name, full_name, gender, birth_date, note, avatar_url, role) 
VALUES 
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 'staff1@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '2345678901', 'Virgie', 'Stroman', 'Virgie Stroman', 'female', NULL, NULL, 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/2.jpg', 'staff'),
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 'staff2@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '3456789012', 'John', 'Doe', 'John Doe', 'male', NULL, NULL, 'https://randomuser.me/api/portraits/men/1.jpg', 'staff'),
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 'staff3@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '4567890123', 'Jane', 'Smith', 'Jane Smith', 'female', NULL, NULL, 'https://randomuser.me/api/portraits/women/2.jpg', 'staff'),
('f23da762-5f27-4eb5-864d-aab759e29797', 'staff4@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '5678901234', 'Mike', 'Johnson', 'Mike Johnson', 'male', NULL, NULL, 'https://randomuser.me/api/portraits/men/3.jpg', 'staff'),
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 'staff5@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '6789012345', 'Sarah', 'Williams', 'Sarah Williams', 'female', NULL, NULL, 'https://randomuser.me/api/portraits/women/4.jpg', 'staff');

-- Customer users
INSERT INTO users (id, email, hashed_password, phone, first_name, last_name, full_name, gender, birth_date, note, avatar_url, role) 
VALUES 
('4fb85ef5-e2e5-4019-a5d7-96f8363d7851', 'customer1@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '908-455-3024', NULL, NULL, 'Charlotte Satterfield', 'other', '1985-05-16', 'Repellendus patruus ascisco vis coepi.', 'https://randomuser.me/api/portraits/women/1.jpg', 'customer'),
('2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', 'customer2@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '1-700-462-8572', NULL, NULL, 'Milton Wolf', 'male', '1998-08-27', 'Tantillus bellum nesciunt cilicium.', 'https://randomuser.me/api/portraits/men/2.jpg', 'customer'),
('22e44313-86e5-432f-ac21-3b3486de3d59', 'customer3@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '257.354.3761 x2070', NULL, NULL, 'Meghan Feeney', 'other', '1995-07-22', 'Aestas rerum tametsi degenero tempus adopto approbo condico tui.', 'https://randomuser.me/api/portraits/women/3.jpg', 'customer');


-- Insert service categories
INSERT INTO service_categories (id, user_id, name) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Hair Care'),
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Skin Care'),
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Nail Care'),
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Massage'),
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Makeup'),
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Spa Treatments'),
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Body Treatments');



-- Insert services
-- Hair Care Services
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 1, 'Haircut', 'Professional haircut service', ARRAY['Styling','Trimming','Consultation'], 50, 30),
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 1, 'Hair Coloring', 'Professional hair coloring service', ARRAY['Color consultation','Application','Aftercare'], 120, 90),
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 1, 'Blowout', 'Professional blowout service', ARRAY['Washing','Blow drying','Styling'], 40, 45);

-- Skin Care Services
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 2, 'Facial', 'Professional facial treatment', ARRAY['Cleansing','Exfoliation','Moisturizing'], 80, 60),
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 2, 'Chemical Peel', 'Professional chemical peel treatment', ARRAY['Skin renewal','Brightening','Smoothing'], 100, 45);

-- Nail Care Services
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 3, 'Manicure', 'Professional manicure service', ARRAY['Nail shaping','Cuticle care','Polish'], 35, 30),
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 3, 'Pedicure', 'Professional pedicure service', ARRAY['Foot soak','Exfoliation','Polish'], 45, 45);

-- Massage Services
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(8, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 4, 'Swedish Massage', 'Relaxing Swedish massage', ARRAY['Stress relief','Muscle relaxation','Improved circulation'], 90, 60),
(9, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 4, 'Deep Tissue Massage', 'Therapeutic deep tissue massage', ARRAY['Pain relief','Muscle tension release','Improved mobility'], 110, 60);

-- Makeup Services
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(10, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 5, 'Makeup Application', 'Professional makeup application', ARRAY['Color matching','Custom look','Long-lasting'], 65, 45),
(11, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 5, 'Bridal Makeup', 'Special bridal makeup service', ARRAY['Consultation','Trial session','Long-lasting'], 150, 90);

-- Spa Treatments
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(12, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 6, 'Hot Stone Therapy', 'Relaxing hot stone massage', ARRAY['Deep relaxation','Muscle tension relief','Improved circulation'], 120, 75),
(13, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 6, 'Aromatherapy', 'Aromatherapy treatment', ARRAY['Stress relief','Mood enhancement','Relaxation'], 85, 60);

-- Body Treatments
INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(14, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 7, 'Body Scrub', 'Exfoliating body scrub', ARRAY['Skin renewal','Softening','Improved texture'], 70, 45),
(15, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 7, 'Body Wrap', 'Detoxifying body wrap', ARRAY['Detoxification','Skin nourishment','Relaxation'], 95, 60);



-- Insert products
INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Shampoo', 36, 25, 'Professional shampoo for all hair types', '250ml bottle', 'Apply to wet hair, lather, rinse', 'Natural ingredients, sulfate-free'),
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Conditioner', 35, 25, 'Hydrating conditioner', '250ml bottle', 'Apply after shampooing, leave for 2 mins, rinse', 'Natural oils, silicone-free'),
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Hair Serum', 69, 35, 'Leave-in hair treatment', '100ml bottle', 'Apply to damp hair, style as usual', 'Argan oil, vitamin E'),
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Face Cleanser', 68, 30, 'Gentle facial cleanser', '150ml tube', 'Use morning and evening', 'Aloe vera, chamomile'),
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Moisturizer', 18, 40, 'Daily facial moisturizer', '50ml jar', 'Apply after cleansing', 'Hyaluronic acid, ceramides'),
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Nail Polish', 20, 15, 'Long-lasting nail color', '10ml bottle', 'Apply to clean nails', 'Vegan formula, 10-free'),
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Cuticle Oil', 77, 20, 'Nourishing cuticle treatment', '15ml bottle', 'Apply daily to cuticles', 'Jojoba oil, vitamin E'),
(8, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Massage Oil', 72, 30, 'Relaxing massage oil', '200ml bottle', 'Use for massage or as body oil', 'Sweet almond oil, lavender'),
(9, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Makeup Remover', 42, 18, 'Gentle makeup remover', '150ml bottle', 'Apply to cotton pad, wipe face', 'Micellar water, aloe'),
(10, '5599e156-42b5-4d8b-882e-2ef1ede5de45', 'Foundation', 67, 45, 'Buildable coverage foundation', '30ml bottle', 'Apply with brush or sponge', 'Lightweight, oil-free');



-- Insert product categories
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 1), -- Shampoo in Hair Care
(2, 1), -- Conditioner in Hair Care
(3, 1), -- Hair Serum in Hair Care
(4, 2), -- Face Cleanser in Skin Care
(5, 2), -- Moisturizer in Skin Care
(6, 3), -- Nail Polish in Nail Care
(7, 3), -- Cuticle Oil in Nail Care
(8, 4), -- Massage Oil in Massage
(9, 5), -- Makeup Remover in Makeup
(10, 5); -- Foundation in Makeup

-- Insert service products
INSERT INTO service_products (service_id, product_id) VALUES
(1, 1), -- Haircut uses Shampoo
(1, 2), -- Haircut uses Conditioner
(2, 3), -- Hair Coloring uses Hair Serum
(3, 1), -- Blowout uses Shampoo
(3, 2), -- Blowout uses Conditioner
(4, 4), -- Facial uses Face Cleanser
(4, 5), -- Facial uses Moisturizer
(6, 6), -- Manicure uses Nail Polish
(6, 7), -- Manicure uses Cuticle Oil
(7, 6), -- Pedicure uses Nail Polish
(7, 7), -- Pedicure uses Cuticle Oil
(8, 8), -- Swedish Massage uses Massage Oil
(9, 8), -- Deep Tissue Massage uses Massage Oil
(10, 9), -- Makeup Application uses Makeup Remover
(10, 10), -- Makeup Application uses Foundation
(11, 9), -- Bridal Makeup uses Makeup Remover
(11, 10), -- Bridal Makeup uses Foundation
(12, 8), -- Hot Stone Therapy uses Massage Oil
(13, 8), -- Aromatherapy uses Massage Oil
(14, 4), -- Body Scrub uses Face Cleanser
(14, 5), -- Body Scrub uses Moisturizer
(15, 5); -- Body Wrap uses Moisturizer



-- Insert staff
INSERT INTO staff (id, user_id, position, specializations) VALUES
(1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 'Hair Stylist', ARRAY[1,2,3]), -- Specializes in Hair services
(2, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 'Esthetician', ARRAY[4,5,14,15]), -- Specializes in Skin and Body services
(3, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 'Massage Therapist', ARRAY[8,9,12,13]), -- Specializes in Massage services
(4, 'f23da762-5f27-4eb5-864d-aab759e29797', 'Nail Technician', ARRAY[6,7]), -- Specializes in Nail services
(5, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 'Makeup Artist', ARRAY[10,11]); -- Specializes in Makeup services

-- Insert staff availability
-- Hair Stylist availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, '09:00:00', '17:00:00'), -- Monday
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 2, '09:00:00', '17:00:00'), -- Tuesday
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 4, '09:00:00', '17:00:00'), -- Thursday
('4a178f20-00e4-4567-a7d4-3eaca7e1e511', 5, '09:00:00', '17:00:00'); -- Friday

-- Esthetician availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, '10:00:00', '18:00:00'),
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 3, '10:00:00', '18:00:00'),
('85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 5, '10:00:00', '18:00:00');

-- Massage Therapist availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 2, '08:00:00', '16:00:00'),
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 3, '08:00:00', '16:00:00'),
('f869fbe8-3c77-42de-8f15-76d47362b2ac', 6, '08:00:00', '16:00:00');

-- Nail Technician availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('f23da762-5f27-4eb5-864d-aab759e29797', 1, '11:00:00', '19:00:00'),
('f23da762-5f27-4eb5-864d-aab759e29797', 4, '11:00:00', '19:00:00'),
('f23da762-5f27-4eb5-864d-aab759e29797', 6, '11:00:00', '19:00:00');

-- Makeup Artist availability
INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 3, '09:00:00', '17:00:00'),
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 5, '09:00:00', '17:00:00'),
('3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 6, '09:00:00', '17:00:00');

-- Insert appointments
-- First, let's check the existing customer users in your users table
-- From your data, these are the customer user IDs:
-- '4fb85ef5-e2e5-4019-a5d7-96f8363d7851' (Charlotte Satterfield)
-- '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c' (Milton Wolf)
-- '22e44313-86e5-432f-ac21-3b3486de3d59' (Meghan Feeney)

-- Now let's fix the appointments data to only use these valid customer_user_id values

-- Completed appointments (only using valid customer_user_id values)
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(1, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-11-25', '13:30:00', '15:30:00', 141, 'completed', NULL, FALSE),
(8, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-10-07', '14:00:00', '15:30:00', 173, 'completed', NULL, FALSE),
(19, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-12-10', '14:15:00', '15:15:00', 300, 'completed', NULL, FALSE),
(20, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-05-19', '11:30:00', '13:30:00', 279, 'completed', NULL, FALSE),
(23, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-08-19', '15:00:00', '17:00:00', 158, 'completed', NULL, FALSE),
(25, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-08-06', '16:30:00', '17:00:00', 79, 'completed', NULL, FALSE);

-- Scheduled appointments
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(2, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-10-15', '13:15:00', '15:15:00', 177, 'scheduled', NULL, FALSE),
(3, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-08-04', '12:45:00', '14:15:00', 329, 'scheduled', NULL, FALSE),
(4, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-12-13', '14:00:00', '14:30:00', 318, 'scheduled', NULL, FALSE),
(13, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-09-27', '13:45:00', '14:15:00', 243, 'scheduled', NULL, FALSE),
(14, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-09-26', '13:45:00', '14:15:00', 243, 'scheduled', NULL, FALSE),
(18, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-10-08', '09:00:00', '10:00:00', 336, 'scheduled', NULL, FALSE),
(26, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-01-22', '15:00:00', '16:00:00', 126, 'scheduled', NULL, FALSE);

-- Cancelled appointments
INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(5, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-12-18', '14:45:00', '16:15:00', 229, 'cancelled', 'Client rescheduled', FALSE),
(6, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-11-07', '11:15:00', '13:15:00', 304, 'cancelled', 'Client unavailable', FALSE),
(7, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-08-26', '10:15:00', '11:15:00', 318, 'cancelled', 'Staff illness', FALSE),
(9, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-03-11', '16:15:00', '18:15:00', 201, 'cancelled', 'Client request', FALSE),
(10, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-04-15', '13:15:00', '13:45:00', 200, 'cancelled', 'No show', TRUE),
(11, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-05-16', '13:30:00', '15:30:00', 206, 'cancelled', 'Client emergency', FALSE),
(12, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-12-27', '15:00:00', '17:00:00', 178, 'cancelled', 'Double booking', FALSE),
(15, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-11-23', '09:30:00', '10:00:00', 156, 'cancelled', 'Client request', FALSE),
(16, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-02-13', '14:30:00', '16:00:00', 243, 'cancelled', 'No show', TRUE),
(17, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-04-25', '15:15:00', '17:15:00', 159, 'cancelled', 'Client rescheduled', FALSE),
(21, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-11-25', '12:45:00', '13:45:00', 340, 'cancelled', 'Client request', FALSE),
(22, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-06-17', '15:45:00', '17:45:00', 300, 'cancelled', 'Staff emergency', FALSE),
(24, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-06-01', '09:15:00', '09:45:00', 159, 'cancelled', 'Client request', FALSE),
(27, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '22e44313-86e5-432f-ac21-3b3486de3d59', '2023-11-15', '14:30:00', '15:00:00', 211, 'cancelled', 'Client emergency', FALSE),
(28, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '4fb85ef5-e2e5-4019-a5d7-96f8363d7851', '2023-12-16', '16:45:00', '17:45:00', 250, 'cancelled', 'Client request', FALSE),
(29, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-03-13', '15:30:00', '16:30:00', 175, 'cancelled', 'No show', TRUE),
(30, '5599e156-42b5-4d8b-882e-2ef1ede5de45', '2479d4a4-73b9-40dc-b5b2-d47c53ad3a4c', '2023-02-16', '10:30:00', '11:00:00', 333, 'cancelled', 'Client rescheduled', FALSE);

-- Insert appointment services
INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(1, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 50.00),
(1, 3, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 45, 40.00),
(2, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 90, 120.00),
(3, 4, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 60, 80.00),
(3, 5, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 45, 100.00),
(4, 6, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 35.00),
(5, 7, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 45, 45.00),
(6, 8, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 60, 90.00),
(7, 9, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 60, 110.00),
(8, 10, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 45, 65.00),
(9, 11, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 90, 150.00),
(10, 12, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 75, 120.00),
(11, 13, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 60, 85.00),
(12, 14, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 45, 70.00),
(13, 15, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 60, 95.00),
(14, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 50.00),
(15, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 90, 120.00),
(16, 3, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 45, 40.00),
(17, 4, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 60, 80.00),
(18, 5, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 45, 100.00),
(19, 6, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 30, 35.00),
(20, 7, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 45, 45.00),
(21, 8, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 60, 90.00),
(22, 9, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 60, 110.00),
(23, 10, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 45, 65.00),
(24, 11, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 90, 150.00),
(25, 12, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 75, 120.00),
(26, 13, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 60, 85.00),
(27, 14, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 45, 70.00),
(28, 15, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 60, 95.00),
(29, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 30, 50.00),
(30, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 90, 120.00);


-- Insert appointment products (products sold during appointments)
INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(1, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 2, 25.00, 50.00),  -- Shampoo
(1, 3, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 35.00, 35.00),  -- Hair Serum
(2, 5, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 40.00, 40.00),  -- Moisturizer
(3, 8, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30.00, 30.00),  -- Massage Oil
(4, 6, 'f23da762-5f27-4eb5-864d-aab759e29797', 2, 15.00, 30.00),  -- Nail Polish
(5, 9, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 18.00, 18.00),  -- Makeup Remover
(6, 4, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30.00, 30.00),  -- Face Cleanser
(7, 10, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 45.00, 45.00), -- Foundation
(8, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 25.00, 25.00),  -- Conditioner
(9, 7, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 20.00, 20.00),  -- Cuticle Oil
(10, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 25.00, 25.00), -- Shampoo
(11, 3, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 35.00, 35.00),  -- Hair Serum
(12, 5, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 40.00, 40.00),  -- Moisturizer
(13, 8, 'f869fbe8-3c77-42de-8f15-76d47362b2ac', 1, 30.00, 30.00), -- Massage Oil
(14, 6, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 15.00, 15.00),  -- Nail Polish
(15, 9, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 18.00, 18.00),  -- Makeup Remover
(16, 4, '85e4bf01-bbac-4e1a-bf3e-20f73970f14b', 1, 30.00, 30.00),  -- Face Cleanser
(17, 10, '3d05df6b-0e87-4e15-9cdd-a9a7ee0a60f5', 1, 45.00, 45.00), -- Foundation
(18, 2, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 25.00, 25.00),  -- Conditioner
(19, 7, 'f23da762-5f27-4eb5-864d-aab759e29797', 1, 20.00, 20.00),  -- Cuticle Oil
(20, 1, '4a178f20-00e4-4567-a7d4-3eaca7e1e511', 1, 25.00, 25.00); -- Shampoo

-- Insert payments (various payment methods for appointments)
INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(1, 'income', 'card', 141.00, 'POS Terminal 1'),
(2, 'income', 'cash', 177.00, 'Front Desk'),
(3, 'income', 'bank', 329.00, 'Online Transfer'),
(4, 'income', 'pos', 318.00, 'POS Terminal 2'),
(5, 'income', 'cash', 229.00, 'Front Desk'),
(6, 'income', 'card', 304.00, 'POS Terminal 1'),
(7, 'income', 'bank', 318.00, 'Online Transfer'),
(8, 'income', 'pos', 173.00, 'POS Terminal 2'),
(9, 'income', 'cash', 201.00, 'Front Desk'),
(10, 'income', 'card', 200.00, 'POS Terminal 1'),
(11, 'income', 'bank', 206.00, 'Online Transfer'),
(12, 'income', 'pos', 178.00, 'POS Terminal 2'),
(13, 'income', 'cash', 243.00, 'Front Desk'),
(14, 'income', 'card', 243.00, 'POS Terminal 1'),
(15, 'income', 'bank', 156.00, 'Online Transfer'),
(16, 'income', 'pos', 243.00, 'POS Terminal 2'),
(17, 'income', 'cash', 159.00, 'Front Desk'),
(18, 'income', 'card', 336.00, 'POS Terminal 1'),
(19, 'income', 'bank', 300.00, 'Online Transfer'),
(20, 'income', 'pos', 279.00, 'POS Terminal 2');

-- Insert promo codes (discount codes for customers)
INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('SPRING20', 20, '2023-03-01', '2023-05-31', 100, '5599e156-42b5-4d8b-882e-2ef1ede5de45'),
('SUMMER25', 25, '2023-06-01', '2023-08-31', 75, '5599e156-42b5-4d8b-882e-2ef1ede5de45'),
('NEWCUSTOMER', 15, '2023-01-01', '2023-12-31', 200, '5599e156-42b5-4d8b-882e-2ef1ede5de45'),
('LOYALTY10', 10, '2023-01-01', '2023-12-31', NULL, '5599e156-42b5-4d8b-882e-2ef1ede5de45'),
('BIRTHDAY', 30, '2023-01-01', '2023-12-31', 1, '5599e156-42b5-4d8b-882e-2ef1ede5de45');

-- Insert invoices (official receipts for appointments)
INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(1, 'INV-2023-001', 141.00),
(2, 'INV-2023-002', 177.00),
(3, 'INV-2023-003', 329.00),
(4, 'INV-2023-004', 318.00),
(5, 'INV-2023-005', 229.00),
(6, 'INV-2023-006', 304.00),
(7, 'INV-2023-007', 318.00),
(8, 'INV-2023-008', 173.00),
(9, 'INV-2023-009', 201.00),
(10, 'INV-2023-010', 200.00),
(11, 'INV-2023-011', 206.00),
(12, 'INV-2023-012', 178.00),
(13, 'INV-2023-013', 243.00),
(14, 'INV-2023-014', 243.00),
(15, 'INV-2023-015', 156.00),
(16, 'INV-2023-016', 243.00),
(17, 'INV-2023-017', 159.00),
(18, 'INV-2023-018', 336.00),
(19, 'INV-2023-019', 300.00),
(20, 'INV-2023-020', 279.00);









-- Create settings table for multilingual support
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert initial settings data
INSERT INTO settings (key, value) VALUES
('site_name', '{"az": "Glamour Studio", "en": "Glamour Studio", "ru": "Glamour Studio", "uz": "Glamour Studio"}'),
('contact_phone', '{"az": "+994 50 123 4567", "en": "+994 50 123 4567", "ru": "+994 50 123 4567", "uz": "+994 50 123 4567"}'),
('contact_email', '{"az": "info@glamourstudio.az", "en": "info@glamourstudio.az", "ru": "info@glamourstudio.az", "uz": "info@glamourstudio.az"}'),
('address', '{"az": "123 Gözəllik Küçəsi, Bakı, Azərbaycan", "en": "123 Beauty Street, Baku, Azerbaijan", "ru": "123 Улица Красоты, Баку, Азербайджан", "uz": "123 Go''zallik ko''chasi, Boku, Ozarbayjon"}'),
('working_hours', '{"az": "B.e - Cümə: 9:00 - 19:00<br>Şənbə: 10:00 - 18:00<br>Bazar: Bağlı", "en": "Monday - Friday: 9:00 - 19:00<br>Saturday: 10:00 - 18:00<br>Sunday: Closed", "ru": "Понедельник - Пятница: 9:00 - 19:00<br>Суббота: 10:00 - 18:00<br>Воскресенье: Закрыто", "uz": "Dushanba - Juma: 9:00 - 19:00<br>Shanba: 10:00 - 18:00<br>Yakshanba: Yopiq"}'),
('about_us', '{"az": "2020-ci ildən bəri premium gözəllik xidmətləri təqdim edirik. Təbii gözəlliyinizi artırmaq və özünüzə inamınızı artırmaq üçün həsr olunmuşuq.", "en": "Providing premium beauty services since 2020. We are dedicated to enhancing your natural beauty and building your confidence.", "ru": "Предоставляем премиум услуги красоты с 2020 года. Мы посвящены улучшению вашей естественной красоты и повышению уверенности в себе.", "uz": "2020 yildan beri premium go''zallik xizmatlarini taqdim etamiz. Tabiiy go''zalligingizni oshirish va o''zingizga ishonchingizni mustahkamlash uchun bag''ishlanganmiz."}'),
('max_booking_days', '{"value": 30}'),
('working_hours_start', '{"value": "09:00"}'),
('working_hours_end', '{"value": "19:00"}'),
('bank_info', '{"az": {"bank_name": "Kapital Bank", "account_name": "Glamour Studio MMC", "account_number": "AZ21AIIB33009803804954123456", "swift": "AIIBAZ2X"}, "en": {"bank_name": "Kapital Bank", "account_name": "Glamour Studio LLC", "account_number": "AZ21AIIB33009803804954123456", "swift": "AIIBAZ2X"}, "ru": {"bank_name": "Капитал Банк", "account_name": "Glamour Studio ООО", "account_number": "AZ21AIIB33009803804954123456", "swift": "AIIBAZ2X"}, "uz": {"bank_name": "Kapital Bank", "account_name": "Glamour Studio MChJ", "account_number": "AZ21AIIB33009803804954123456", "swift": "AIIBAZ2X"}}');

-- Enable RLS on settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for reading settings (public access)
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (true);

-- Create policy for admin users to manage settings
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Create contact_messages table for contact form submissions
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create trigger for contact_messages updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can send contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admins can read contact messages
CREATE POLICY "Admins can read contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update contact message status
CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );



-- First, let's restructure the settings table to have separate rows for each language
-- We'll create a new table structure and migrate the existing data

-- Create a backup of current settings
CREATE TABLE settings_backup AS SELECT * FROM settings;

-- Drop existing policies and table
DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
DROP TABLE settings;

-- Create new settings table with lang column
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'az',
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  UNIQUE(key, lang)
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert restructured settings data with separate rows for each language
INSERT INTO settings (key, value, lang) VALUES
-- Site name
('site_name', 'Glamour Studio', 'az'),
('site_name', 'Glamour Studio', 'en'),
('site_name', 'Glamour Studio', 'ru'),
('site_name', 'Glamour Studio', 'uz'),

-- Contact phone
('contact_phone', '+994 50 123 4567', 'az'),
('contact_phone', '+994 50 123 4567', 'en'),
('contact_phone', '+994 50 123 4567', 'ru'),
('contact_phone', '+994 50 123 4567', 'uz'),

-- Contact email
('contact_email', 'info@glamourstudio.az', 'az'),
('contact_email', 'info@glamourstudio.az', 'en'),
('contact_email', 'info@glamourstudio.az', 'ru'),
('contact_email', 'info@glamourstudio.az', 'uz'),

-- Address
('address', '123 Gözəllik Küçəsi, Bakı, Azərbaycan', 'az'),
('address', '123 Beauty Street, Baku, Azerbaijan', 'en'),
('address', '123 Улица Красоты, Баку, Азербайджан', 'ru'),
('address', '123 Go''zallik ko''chasi, Boku, Ozarbayjon', 'uz'),

-- Working hours
('working_hours', 'B.e - Cümə: 9:00 - 19:00<br>Şənbə: 10:00 - 18:00<br>Bazar: Bağlı', 'az'),
('working_hours', 'Monday - Friday: 9:00 - 19:00<br>Saturday: 10:00 - 18:00<br>Sunday: Closed', 'en'),
('working_hours', 'Понедельник - Пятница: 9:00 - 19:00<br>Суббота: 10:00 - 18:00<br>Воскресенье: Закрыто', 'ru'),
('working_hours', 'Dushanba - Juma: 9:00 - 19:00<br>Shanba: 10:00 - 18:00<br>Yakshanba: Yopiq', 'uz'),

-- About us
('about_us', '2020-ci ildən bəri premium gözəllik xidmətləri təqdim edirik. Təbii gözəlliyinizi artırmaq və özünüzə inamınızı artırmaq üçün həsr olunmuşuq.', 'az'),
('about_us', 'Providing premium beauty services since 2020. We are dedicated to enhancing your natural beauty and building your confidence.', 'en'),
('about_us', 'Предоставляем премиум услуги красоты с 2020 года. Мы посвящены улучшению вашей естественной красоты и повышению уверенности в себе.', 'ru'),
('about_us', '2020 yildan beri premium go''zallik xizmatlarini taqdim etamiz. Tabiiy go''zalligingizni oshirish va o''zingizga ishonchingizni mustahkamlash uchun bag''ishlanganmiz.', 'uz'),

-- Non-language specific settings (using 'az' as default)
('max_booking_days', '30', 'az'),
('working_hours_start', '09:00', 'az'),
('working_hours_end', '19:00', 'az'),

-- Bank info for each language
('bank_name', 'Kapital Bank', 'az'),
('bank_name', 'Kapital Bank', 'en'),
('bank_name', 'Капитал Банк', 'ru'),
('bank_name', 'Kapital Bank', 'uz'),

('bank_account_name', 'Glamour Studio MMC', 'az'),
('bank_account_name', 'Glamour Studio LLC', 'en'),
('bank_account_name', 'Glamour Studio ООО', 'ru'),
('bank_account_name', 'Glamour Studio MChJ', 'uz'),

('bank_account_number', 'AZ21AIIB33009803804954123456', 'az'),
('bank_account_number', 'AZ21AIIB33009803804954123456', 'en'),
('bank_account_number', 'AZ21AIIB33009803804954123456', 'ru'),
('bank_account_number', 'AZ21AIIB33009803804954123456', 'uz'),

('bank_swift', 'AIIBAZ2X', 'az'),
('bank_swift', 'AIIBAZ2X', 'en'),
('bank_swift', 'AIIBAZ2X', 'ru'),
('bank_swift', 'AIIBAZ2X', 'uz');

-- Enable RLS on new settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for reading settings (public access)
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (true);

-- Create policy for admin users to manage settings
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Add bio and photo fields to users table for team section
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url TEXT;



-- Add discount column to services table
ALTER TABLE public.services 
ADD COLUMN discount numeric DEFAULT 0;

-- Update services table to include sample discount data for testing
UPDATE public.services 
SET discount = 10 
WHERE id IN (SELECT id FROM public.services LIMIT 2);

UPDATE public.services 
SET discount = 15 
WHERE id IN (SELECT id FROM public.services LIMIT 1 OFFSET 2);


drop view if exists staff_with_services_json;
create or replace view staff_with_services_json as
select * from (select
  u.id as user_id,
  jsonb_build_object(
    'full_name', u.full_name,
    'bio', u.bio,
    'photo_url', u.photo_url
  ) as user,
  (
    select jsonb_agg(
      jsonb_build_object(
        'position', s.position,
        'services', (
          select jsonb_agg(
            jsonb_build_object(
              'id', svc.id,
              'name', svc.name,
              'price', svc.price,
              'duration', svc.duration,
              'discount', svc.discount
            )
          )
          from unnest(s.specializations) as spec_id
          join services svc on svc.id = spec_id
        )
      )
    )
    from staff s
    where s.user_id = u.id
  ) as positions
from users u
where u.role not in ('customer')) as t where t.positions is not null;



create or replace function get_available_staff_by_service_and_date(
  service_id int,
  reservation_date date
)
returns table (
  user_id uuid,
  full_name text,
  position text
) as $$
begin
  return query
  select
    u.id,
    u.full_name,
    s.position
  from staff s
  join users u on u.id = s.user_id
  join staff_availability sa on sa.staff_user_id = s.user_id
  where service_id = any(s.specializations)
    and sa.weekday = extract(dow from reservation_date)::int;
end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION process_invoice_appointment_json()
RETURNS TRIGGER AS $$
DECLARE
    customer_data JSONB;
    service_data JSONB;
    product_data JSONB;
    payment_data JSONB;
    customer_id UUID;
    app_id INTEGER;
    total_duration INT := 0;
BEGIN
    -- 1. JSON sahələrini çıxar
    customer_data := NEW.appointment_json->'customer_info';
    service_data := NEW.appointment_json->'services';
    product_data := NEW.appointment_json->'products';
    payment_data := NEW.appointment_json->'payment_details';
	
    -- 2. Yeni istifadəçi insert et və ya mövcudsa id-sini al
    INSERT INTO users (email, phone, full_name, gender, note, role, hashed_password, created_at, updated_at)
    VALUES (
        customer_data->>'email',
        customer_data->>'number',
        customer_data->>'full_name',
        (customer_data->>'gender')::gender_enum,
        customer_data->>'note',
        'customer',
        'autogenerated',
        now(), 
        now()
    )
    ON CONFLICT (email, phone) DO UPDATE SET updated_at = now()
    RETURNING id INTO customer_id;
    
    -- 3. Yeni appointment insert et
    FOR i IN 0..jsonb_array_length(service_data) - 1 LOOP
        total_duration := total_duration + (service_data->i->>'duration')::int;
    END LOOP;
    
    INSERT INTO appointments (
        customer_user_id, appointment_date, start_time, end_time, total, status, created_at, updated_at
    )
    VALUES (
        customer_id,
        (customer_data->>'date')::date,
        (customer_data->>'time')::time,
        (customer_data->>'time')::time + make_interval(mins => total_duration),
        (payment_data->>'paid_amount')::numeric,
        'awaiting_payment'::appointment_status,
        now(), 
        now()
    )
    RETURNING id INTO app_id;
    
    -- 4. appointment_services
    FOR i IN 0..jsonb_array_length(service_data) - 1 LOOP
        INSERT INTO appointment_services (
            appointment_id, service_id, staff_user_id, quantity, duration, price
        ) VALUES (
            app_id,
            (service_data->i->>'id')::int,
            (service_data->i->>'user_id')::uuid,
            1,
            (service_data->i->>'duration')::int,
            (service_data->i->>'discounted_price')::numeric
        );
    END LOOP;
    
    -- 5. appointment_products
    FOR i IN 0..jsonb_array_length(product_data) - 1 LOOP
        INSERT INTO appointment_products (
            appointment_id, product_id, quantity, price, amount
        ) VALUES (
            app_id,
            (product_data->i->>'id')::int,
            (product_data->i->>'quantity')::int,
            (product_data->i->>'discounted_price')::numeric,
            ((product_data->i->>'quantity')::int * (product_data->i->>'discounted_price')::numeric)
        );
    END LOOP;
    
    -- 6. payments
    INSERT INTO payments (
        appointment_id, type, method, amount, source, created_at, updated_at
    ) VALUES (
        app_id,
        'income',
        (payment_data->>'method')::payment_method,
        (payment_data->>'paid_amount')::numeric,
        COALESCE(payment_data->>'promo_code', ''),
        now(), 
        now()
    );
    
	
    -- 7. invoices cədvəlində appointment_id-ni yenilə
    UPDATE invoices
    SET appointment_id = app_id
    WHERE id = NEW.id;
	
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE invoices
ADD COLUMN appointment_json JSONB;

DROP TRIGGER IF EXISTS trg_process_invoice_appointment_json ON invoices;

CREATE TRIGGER trg_process_invoice_appointment_json
AFTER INSERT ON invoices
FOR EACH ROW
WHEN (NEW.appointment_json IS NOT NULL)
EXECUTE FUNCTION process_invoice_appointment_json();


-- Add status column to invoices table
ALTER TABLE public.invoices 
ADD COLUMN status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'confirmed', 'canceled', 'declined'));

-- Add created_at timestamp if not exists (for automatic cancellation after 1 hour)
ALTER TABLE public.invoices 
ALTER COLUMN issued_at SET DEFAULT timezone('utc', now());

-- Create an index on status and issued_at for efficient queries
CREATE INDEX IF NOT EXISTS idx_invoices_status_issued_at ON public.invoices(status, issued_at);



-- Create a function to properly insert invoices with appointment JSON
CREATE OR REPLACE FUNCTION create_invoice_with_appointment(
  p_invoice_number text,
  p_total_amount numeric,
  p_status text,
  p_appointment_json jsonb
) RETURNS TABLE(
  id integer,
  invoice_number text,
  total_amount numeric,
  status text,
  appointment_json jsonb,
  appointment_id integer,
  issued_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO invoices (invoice_number, total_amount, status, appointment_json)
  VALUES (p_invoice_number, p_total_amount, p_status, p_appointment_json)
  RETURNING invoices.id, invoices.invoice_number, invoices.total_amount, invoices.status, invoices.appointment_json, invoices.appointment_id, invoices.issued_at;
END;
$$ LANGUAGE plpgsql;




-- Fix the get_available_staff_by_service_and_date function
-- The issue is likely with the weekday calculation and join conditions

CREATE OR REPLACE FUNCTION public.get_available_staff_by_service_and_date(
  service_id integer, 
  reservation_date date
)
RETURNS TABLE(user_id uuid, full_name text)
LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    u.id,
    u.full_name
  from staff s
  join users u on u.id = s.user_id
  left join staff_availability sa on sa.staff_user_id = s.user_id
  where service_id = any(s.specializations)
    and (
      sa.weekday is null 
      or sa.weekday = extract(dow from reservation_date)::int
    )
    and u.role = 'staff'
  group by u.id, u.full_name;
end;
$function$




ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_phone_key;

ALTER TABLE users
ADD CONSTRAINT unique_email_phone UNIQUE (email, phone);



-- Create transactions table with correct appointment_id type
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(10,2) NOT NULL,
    
    -- Income specific fields (appointment_id should be integer to match appointments table)
    appointment_id INTEGER REFERENCES appointments(id),
    customer_name TEXT,
    source TEXT,
    payment_type TEXT CHECK (payment_type IN ('card', 'cash', 'bank', 'pos')),
    status TEXT CHECK (status IN ('approved', 'pending', 'rejected')),
    
    -- Expense specific fields
    category TEXT,
    description TEXT,
    
    -- Common fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    
    -- Constraint to ensure income has either appointment_id or customer_name
    CHECK (
        type = 'expense'
        OR appointment_id IS NOT NULL
        OR customer_name IS NOT NULL
    )
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Enable all operations for authenticated users" ON public.transactions
    FOR ALL USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_transactions_updated_at();


ALTER TABLE invoices
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();




