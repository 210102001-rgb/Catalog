import { prisma as db } from "../lib/db";
import { hashPassword } from "../lib/auth";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create default admin user
    const adminPassword = await hashPassword("admin123");
    const adminUser = await db.user.upsert({
      where: { email: "admin@solvia.com" },
      update: {},
      create: {
        uuid: crypto.randomUUID(),
        name: "Admin User",
        email: "admin@solvia.com",
        password_hash: adminPassword,
        role: "ADMIN",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });

    console.log("Admin user created:", adminUser.email);

    // Create default customer user
    const customerPassword = await hashPassword("customer123");
    const customerUser = await db.user.upsert({
      where: { email: "customer@solvia.com" },
      update: {},
      create: {
        uuid: crypto.randomUUID(),
        name: "Customer User",
        email: "customer@solvia.com",
        password_hash: customerPassword,
        role: "CUSTOMER",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });

    console.log("Customer user created:", customerUser.email);

    // Create default categories
    const category1 = await db.category.upsert({
      where: { slug: "billboard" },
      update: {},
      create: {
        name: "Billboard",
        slug: "billboard",
        description: "Various billboard advertisements",
        active: true,
      },
    });

    const category2 = await db.category.upsert({
      where: { slug: "digital-signage" },
      update: {},
      create: {
        name: "Digital Signage",
        slug: "digital-signage",
        description: "Digital signage solutions",
        active: true,
      },
    });

    console.log("Categories created:", category1.name, "and", category2.name);

    // Create subcategories
    const subcategory1 = await db.subCategory.upsert({
      where: { slug: "indoor-billboards" },
      update: {},
      create: {
        name: "Indoor Billboards",
        slug: "indoor-billboards",
        description: "Billboards for indoor use",
        category_id: category1.id,
        active: true,
      },
    });

    const subcategory2 = await db.subCategory.upsert({
      where: { slug: "outdoor-billboards" },
      update: {},
      create: {
        name: "Outdoor Billboards",
        slug: "outdoor-billboards",
        description: "Billboards for outdoor use",
        category_id: category1.id,
        active: true,
      },
    });

    console.log("Subcategories created:", subcategory1.name, "and", subcategory2.name);

    // Create sample products
    const product1 = await db.product.upsert({
      where: { slug: "premium-city-center-billboard" },
      update: {},
      create: {
        uuid: crypto.randomUUID(),
        name: "Premium City Center Billboard",
        slug: "premium-city-center-billboard",
        description: "High visibility billboard in the heart of the city",
        location: "Downtown Jakarta",
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
        created_by: adminUser.id,
        status: "APPROVED",
        approved_by: adminUser.id,
        approved_at: new Date(),
        category_id: category1.id,
        subcategory_id: subcategory2.id,
      },
    });

    const product2 = await db.product.upsert({
      where: { slug: "digital-indoor-display" },
      update: {},
      create: {
        uuid: crypto.randomUUID(),
        name: "Digital Indoor Display",
        slug: "digital-indoor-display",
        description: "High-resolution digital display for indoor environments",
        location: "Mall Grand Indonesia, Jakarta",
        latitude: -6.1927,
        longitude: 106.8215,
        size_width: 4,
        size_height: 3,
        illumination: true,
        visibility: "DAYTIME",
        price_daily: 200000,
        price_weekly: 1000000,
        price_monthly: 4000000,
        price_yearly: 48000000,
        stock_quantity: 1,
        images: ["https://example.com/digital-display.jpg"],
        specifications: {
          resolution: "1920x1080",
          brightness: "500 nits",
          connectivity: "WiFi, Ethernet",
        },
        featured: true,
        published: true,
        created_by: adminUser.id,
        status: "APPROVED",
        approved_by: adminUser.id,
        approved_at: new Date(),
        category_id: category2.id,
        subcategory_id: subcategory1.id,
      },
    });

    console.log("Sample products created:", product1.name, "and", product2.name);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Execute seeding if this file is run directly
if (require.main === module) {
  seedDatabase().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export default seedDatabase;
