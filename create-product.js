const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function createProduct() {
  try {
    // Create a customer user
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customer = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {},
      create: {
        uuid: uuidv4(),
        name: "Customer User",
        email: "customer@example.com",
        password_hash: customerPassword,
        role: "CUSTOMER",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });

    console.log("Customer created:", customer.email);

    // Create a category
    const category = await prisma.category.upsert({
      where: { slug: "billboard" },
      update: {},
      create: {
        name: "Billboard",
        slug: "billboard",
        description: "Various billboard advertisements",
        active: true,
      },
    });

    console.log("Category created:", category.name);

    // Create a product
    const product = await prisma.product.upsert({
      where: { slug: "test-product" },
      update: {},
      create: {
        uuid: uuidv4(),
        name: "Test Product",
        slug: "test-product",
        description: "Test product for customer",
        location: "Test Location",
        latitude: -6.2088,
        longitude: 106.8456,
        size_width: 10,
        size_height: 5,
        illumination: true,
        visibility: "ALWAYSON",
        price_daily: 500000,
        price_weekly: 3000000,
        price_monthly: 12000000,
        price_yearly: 144000000,
        stock_quantity: 1,
        images: ["https://example.com/billboard1.jpg"],
        specifications: {
          material: "Vinyl",
          mounting: "Wall mounted",
          wind_resistance: "Up to 120 km/h",
        },
        featured: true,
        published: true,
        created_by: customer.id,
        status: "DRAFT",
        category_id: category.id,
      },
    });

    console.log("Product created:", product.name);
  } catch (error) {
    console.error("Error creating product:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createProduct();
