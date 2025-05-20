import { faker } from "@faker-js/faker";

// Helper function to generate a random UUID
const generateUUID = () => faker.string.uuid();

// Helper function to generate a random date within a range
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to format date for SQL
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Helper function to format time for SQL
const formatTime = (date) => {
  return date.toTimeString().split(" ")[0];
};

// Helper function to generate a random enum value
const randomEnum = (enumValues) => {
  return enumValues[Math.floor(Math.random() * enumValues.length)];
};

// Generate SQL INSERT statements for all tables
const generateMockData = () => {
  let sql = "";

  // Clear existing data (optional)
  sql += "-- Clear existing data\n";
  sql +=
    "TRUNCATE TABLE histories, staff_availability, invoices, promo_codes, payments, appointment_products, appointment_services, appointments, service_products, product_categories, products, services, service_categories, staff, customers, users CASCADE;\n\n";

  // Generate users
  sql += "-- Insert users\n";
  const userIds = [];
  const userRoles = [
    "customer",
    "super_admin",
    "admin",
    "staff",
    "appointment",
    "reception",
    "service",
    "product",
    "cash",
  ];

  // Admin user
  const adminId = generateUUID();
  userIds.push(adminId);
  sql += `INSERT INTO users (id, email, hashed_password, number, first_name, last_name, avatar_url, role) VALUES
('${adminId}', 'admin@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '${faker.phone.number()}', '${faker.person.firstName()}', '${faker.person.lastName()}', '${faker.image.avatar()}', 'super_admin');\n`;

  // Staff users
  const staffIds = [];
  for (let i = 0; i < 5; i++) {
    const userId = generateUUID();
    userIds.push(userId);
    staffIds.push(userId);
    sql += `INSERT INTO users (id, email, hashed_password, number, first_name, last_name, avatar_url, role) VALUES
('${userId}', '${faker.internet.email()}', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '${faker.phone.number()}', '${faker.person.firstName()}', '${faker.person.lastName()}', '${faker.image.avatar()}', 'staff');\n`;
  }

  // Customer users
  const customerIds = [];
  for (let i = 0; i < 20; i++) {
    const userId = generateUUID();
    userIds.push(userId);
    customerIds.push(userId);
    sql += `INSERT INTO users (id, email, hashed_password, number, first_name, last_name, avatar_url, role) VALUES
('${userId}', '${faker.internet.email()}', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '${faker.phone.number()}', '${faker.person.firstName()}', '${faker.person.lastName()}', '${faker.image.avatar()}', 'customer');\n`;
  }

  // Other role users
  const otherRoles = userRoles.filter(
    (role) => role !== "customer" && role !== "staff" && role !== "super_admin"
  );
  for (const role of otherRoles) {
    const userId = generateUUID();
    userIds.push(userId);
    sql += `INSERT INTO users (id, email, hashed_password, number, first_name, last_name, avatar_url, role) VALUES
('${userId}', '${role}@example.com', '$2a$10$X4jD78lGC7jxDhGhpj7xF.dJ5JvTl1MNVgQZGG8QDrDPYOcgUtUcG', '${faker.phone.number()}', '${faker.person.firstName()}', '${faker.person.lastName()}', '${faker.image.avatar()}', '${role}');\n`;
  }

  // Generate customers
  sql += "\n-- Insert customers\n";
  for (const customerId of customerIds) {
    const gender = randomEnum(["male", "female", "other"]);
    const birthDate = randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1));

    sql += `INSERT INTO customers (user_id, full_name, email, phone, gender, birth_date, note) VALUES
('${customerId}', '${faker.person.fullName()}', '${faker.internet.email()}', '${faker.phone.number()}', '${gender}', '${formatDate(
      birthDate
    )}', '${faker.lorem.sentence()}');\n`;
  }

  // Generate service categories
  sql += "\n-- Insert service categories\n";
  const categoryIds = [];
  const categoryNames = [
    "Hair Care",
    "Skin Care",
    "Nail Care",
    "Massage",
    "Makeup",
    "Spa Treatments",
    "Body Treatments",
  ];

  for (let i = 0; i < categoryNames.length; i++) {
    const categoryId = i + 1;
    categoryIds.push(categoryId);
    sql += `INSERT INTO service_categories (id, user_id, name) VALUES
(${categoryId}, '${adminId}', '${categoryNames[i]}');\n`;
  }

  // Generate services
  sql += "\n-- Insert services\n";
  const serviceIds = [];
  const services = [
    { name: "Haircut", category: 1, price: 50, duration: 30 },
    { name: "Hair Coloring", category: 1, price: 120, duration: 90 },
    { name: "Blowout", category: 1, price: 40, duration: 45 },
    { name: "Facial", category: 2, price: 80, duration: 60 },
    { name: "Chemical Peel", category: 2, price: 100, duration: 45 },
    { name: "Manicure", category: 3, price: 35, duration: 30 },
    { name: "Pedicure", category: 3, price: 45, duration: 45 },
    { name: "Swedish Massage", category: 4, price: 90, duration: 60 },
    { name: "Deep Tissue Massage", category: 4, price: 110, duration: 60 },
    { name: "Makeup Application", category: 5, price: 65, duration: 45 },
    { name: "Bridal Makeup", category: 5, price: 150, duration: 90 },
    { name: "Hot Stone Therapy", category: 6, price: 120, duration: 75 },
    { name: "Aromatherapy", category: 6, price: 85, duration: 60 },
    { name: "Body Scrub", category: 7, price: 70, duration: 45 },
    { name: "Body Wrap", category: 7, price: 95, duration: 60 },
  ];

  for (let i = 0; i < services.length; i++) {
    const serviceId = i + 1;
    serviceIds.push(serviceId);
    const service = services[i];
    const benefits = [
      faker.lorem.sentence(),
      faker.lorem.sentence(),
      faker.lorem.sentence(),
    ];

    sql += `INSERT INTO services (id, user_id, category_id, name, description, benefits, price, duration) VALUES
(${serviceId}, '${adminId}', ${service.category}, '${
      service.name
    }', '${faker.lorem.paragraph()}', ARRAY['${benefits.join("','")}'], ${
      service.price
    }, ${service.duration});\n`;
  }

  // Generate products
  sql += "\n-- Insert products\n";
  const productIds = [];
  const products = [
    { name: "Shampoo", price: 25 },
    { name: "Conditioner", price: 25 },
    { name: "Hair Serum", price: 35 },
    { name: "Face Cleanser", price: 30 },
    { name: "Moisturizer", price: 40 },
    { name: "Nail Polish", price: 15 },
    { name: "Cuticle Oil", price: 20 },
    { name: "Massage Oil", price: 30 },
    { name: "Makeup Remover", price: 18 },
    { name: "Foundation", price: 45 },
  ];

  for (let i = 0; i < products.length; i++) {
    const productId = i + 1;
    productIds.push(productId);
    const product = products[i];

    sql += `INSERT INTO products (id, user_id, name, stock, price, description, details, how_to_use, ingredients) VALUES
(${productId}, '${adminId}', '${product.name}', ${faker.number.int({
      min: 10,
      max: 100,
    })}, ${
      product.price
    }, '${faker.lorem.paragraph()}', '${faker.lorem.paragraph()}', '${faker.lorem.paragraph()}', '${faker.lorem.paragraph()}');\n`;
  }

  // Generate product categories
  sql += "\n-- Insert product categories\n";
  for (const productId of productIds) {
    const categoryId =
      categoryIds[Math.floor(Math.random() * categoryIds.length)];
    sql += `INSERT INTO product_categories (product_id, category_id) VALUES
(${productId}, ${categoryId});\n`;
  }

  // Generate service products
  sql += "\n-- Insert service products\n";
  for (let i = 0; i < 15; i++) {
    const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    sql += `INSERT INTO service_products (service_id, product_id) VALUES
(${serviceId}, ${productId});\n`;
  }

  // Generate staff
  sql += "\n-- Insert staff\n";
  for (let i = 0; i < staffIds.length; i++) {
    const staffId = i + 1;
    const positions = [
      "Stylist",
      "Esthetician",
      "Nail Technician",
      "Massage Therapist",
      "Makeup Artist",
    ];
    const position = positions[Math.floor(Math.random() * positions.length)];

    // Randomly assign 1-3 services to each staff member
    const specializations = [];
    const numSpecializations = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numSpecializations; j++) {
      const serviceId =
        serviceIds[Math.floor(Math.random() * serviceIds.length)];
      if (!specializations.includes(serviceId)) {
        specializations.push(serviceId);
      }
    }

    sql += `INSERT INTO staff (id, user_id, position, specializations) VALUES
(${staffId}, '${staffIds[i]}', '${position}', ARRAY[${specializations.join(
      ","
    )}]);\n`;
  }

  // Generate staff availability
  sql += "\n-- Insert staff availability\n";
  for (const staffId of staffIds) {
    for (let weekday = 0; weekday < 7; weekday++) {
      // Skip some days randomly to create days off
      if (Math.random() > 0.8) continue;

      const startHour = 8 + Math.floor(Math.random() * 3); // 8-10 AM
      const endHour = 16 + Math.floor(Math.random() * 4); // 4-7 PM

      sql += `INSERT INTO staff_availability (staff_user_id, weekday, start_time, end_time) VALUES
('${staffId}', ${weekday}, '${startHour}:00:00', '${endHour}:00:00');\n`;
    }
  }

  // Generate appointments
  sql += "\n-- Insert appointments\n";
  const appointmentIds = [];
  const appointmentStatuses = ["scheduled", "completed", "cancelled"];

  for (let i = 0; i < 30; i++) {
    const appointmentId = i + 1;
    appointmentIds.push(appointmentId);

    const customerId =
      customerIds[Math.floor(Math.random() * customerIds.length)];
    const appointmentDate = randomDate(
      new Date(2023, 0, 1),
      new Date(2023, 11, 31)
    );

    // Generate random start time between 9 AM and 5 PM
    const startHour = 9 + Math.floor(Math.random() * 8);
    const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
    appointmentDate.setHours(startHour, startMinute, 0);

    // End time is 30-120 minutes after start time
    const durationMinutes = (Math.floor(Math.random() * 4) + 1) * 30; // 30, 60, 90, or 120 minutes
    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);

    const status = randomEnum(appointmentStatuses);
    const total = Math.floor(Math.random() * 300) + 50; // $50-$350

    sql += `INSERT INTO appointments (id, user_id, customer_user_id, appointment_date, start_time, end_time, total, status, cancel_reason, is_no_show) VALUES
(${appointmentId}, '${adminId}', '${customerId}', '${formatDate(
      appointmentDate
    )}', '${formatTime(appointmentDate)}', '${formatTime(
      endTime
    )}', ${total}, '${status}', ${
      status === "cancelled" ? `'${faker.lorem.sentence()}'` : "NULL"
    }, ${Math.random() > 0.9 ? "TRUE" : "FALSE"});\n`;
  }

  // Generate appointment services
  sql += "\n-- Insert appointment services\n";
  for (const appointmentId of appointmentIds) {
    // Each appointment has 1-3 services
    const numServices = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numServices; i++) {
      const serviceId =
        serviceIds[Math.floor(Math.random() * serviceIds.length)];
      const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];
      const service = services.find((s) => s.id === serviceId) || services[0];
      const price = service.price * (0.9 + Math.random() * 0.2); // Vary price slightly

      sql += `INSERT INTO appointment_services (appointment_id, service_id, staff_id, quantity, duration, price) VALUES
(${appointmentId}, ${serviceId}, '${staffId}', 1, ${
        service.duration
      }, ${price.toFixed(2)});\n`;
    }
  }

  // Generate appointment products
  sql += "\n-- Insert appointment products\n";
  for (const appointmentId of appointmentIds) {
    // 50% chance of having products
    if (Math.random() > 0.5) {
      // Each appointment has 1-2 products
      const numProducts = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < numProducts; i++) {
        const productId =
          productIds[Math.floor(Math.random() * productIds.length)];
        const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];
        const product = products.find((p) => p.id === productId) || products[0];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = product.price;
        const amount = price * quantity;

        sql += `INSERT INTO appointment_products (appointment_id, product_id, staff_id, quantity, price, amount) VALUES
(${appointmentId}, ${productId}, '${staffId}', ${quantity}, ${price.toFixed(
          2
        )}, ${amount.toFixed(2)});\n`;
      }
    }
  }

  // Generate payments
  sql += "\n-- Insert payments\n";
  const paymentMethods = ["cash", "card", "bank", "pos"];

  for (const appointmentId of appointmentIds) {
    const method = randomEnum(paymentMethods);
    const amount = Math.floor(Math.random() * 300) + 50; // $50-$350

    sql += `INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(${appointmentId}, 'income', '${method}', ${amount.toFixed(
      2
    )}, '${faker.lorem.word()}');\n`;

    // 20% chance of having a second payment (split payment)
    if (Math.random() > 0.8) {
      const secondMethod = randomEnum(
        paymentMethods.filter((m) => m !== method)
      );
      const secondAmount = Math.floor(Math.random() * 100) + 20; // $20-$120

      sql += `INSERT INTO payments (appointment_id, type, method, amount, source) VALUES
(${appointmentId}, 'income', '${secondMethod}', ${secondAmount.toFixed(
        2
      )}, '${faker.lorem.word()}');\n`;
    }
  }

  // Generate promo codes
  sql += "\n-- Insert promo codes\n";
  for (let i = 0; i < 5; i++) {
    const code = faker.string.alphanumeric(8).toUpperCase();
    const discountPercent = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
    const validFrom = randomDate(new Date(2023, 0, 1), new Date(2023, 6, 1));
    const validTo = randomDate(new Date(2023, 6, 1), new Date(2023, 11, 31));
    const maxUsage = Math.floor(Math.random() * 50) + 10;

    sql += `INSERT INTO promo_codes (code, discount_percent, valid_from, valid_to, max_usage, created_by) VALUES
('${code}', ${discountPercent}, '${formatDate(validFrom)}', '${formatDate(
      validTo
    )}', ${maxUsage}, '${adminId}');\n`;
  }

  // Generate invoices
  sql += "\n-- Insert invoices\n";
  for (const appointmentId of appointmentIds) {
    const invoiceNumber = `INV-${faker.string.numeric(6)}`;
    const totalAmount = Math.floor(Math.random() * 300) + 50; // $50-$350

    sql += `INSERT INTO invoices (appointment_id, invoice_number, total_amount) VALUES
(${appointmentId}, '${invoiceNumber}', ${totalAmount.toFixed(2)});\n`;
  }

  return sql;
};

// Generate and output the SQL
const mockDataSQL = generateMockData();
console.log(mockDataSQL);
