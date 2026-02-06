// Comprehensive backend test script
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function runTests() {
  console.log("🚀 Starting backend tests...\n");

  try {
    // Test 1: Database Connection
    console.log("1. Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful\n");

    // Test 2: Create Admin User
    console.log("2. Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        uuid: uuidv4(),
        name: "Test Admin",
        email: "admin@test.com",
        password_hash: adminPassword,
        role: "ADMIN",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });
    console.log("✅ Admin user created:", admin.email, "\n");

    // Test 3: Create Customer User
    console.log("3. Creating customer user...");
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customer = await prisma.user.upsert({
      where: { email: "customer@test.com" },
      update: {},
      create: {
        uuid: uuidv4(),
        name: "Test Customer",
        email: "customer@test.com",
        password_hash: customerPassword,
        role: "CUSTOMER",
        user_type: "INDIVIDUAL",
        status: "ACTIVE",
        email_verified: true,
      },
    });
    console.log("✅ Customer user created:", customer.email, "\n");

    // Test 4: Create Category
    console.log("4. Creating category...");
    const category = await prisma.category.upsert({
      where: { slug: "test-category" },
      update: {},
      create: {
        name: "Test Category",
        slug: "test-category",
        description: "Test category for products",
        active: true,
      },
    });
    console.log("✅ Category created:", category.name, "\n");

    // Test 5: Create Product
    console.log("5. Creating product...");
    const product = await prisma.product.upsert({
      where: { slug: "test-product" },
      update: {},
      create: {
        uuid: uuidv4(),
        name: "Test Product",
        slug: "test-product",
        description: "Test product description",
        location: "Test Location",
        price_daily: 100000,
        price_weekly: 500000,
        price_monthly: 2000000,
        price_yearly: 20000000,
        stock_quantity: 1,
        images: ["test-image.jpg"],
        specifications: { width: 100, height: 200 },
        featured: false,
        published: true,
        created_by: customer.id,
        status: "APPROVED",
        category_id: category.id,
      },
    });
    console.log("✅ Product created:", product.name, "\n");

    // Test 6: Create Order
    console.log("6. Creating order...");
    const order = await prisma.order.create({
      data: {
        uuid: uuidv4(),
        order_number: `ORD-${Date.now()}`,
        user_id: customer.id,
        total_amount: 100000,
        final_amount: 100000,
        status: "PENDING",
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        order_items: {
          create: [
            {
              product_id: product.id,
              quantity: 1,
              unit_price: 100000,
              total_price: 100000,
              start_date: new Date(),
              end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
    });
    console.log("✅ Order created:", order.order_number, "\n");

    // Test 7: Create Chat Message
    console.log("7. Creating chat message...");
    const chat = await prisma.chat.create({
      data: {
        sender_id: customer.id,
        receiver_id: admin.id,
        message: "Hello, I have a question about the product.",
        type: "TEXT",
      },
    });
    console.log("✅ Chat message created\n");

    // Test 8: Create Notification
    console.log("8. Creating notification...");
    const notification = await prisma.notification.create({
      data: {
        user_id: customer.id,
        title: "Order Created",
        message: "Your order has been created successfully",
        type: "ORDER_STATUS",
        order_id: order.id,
      },
    });
    console.log("✅ Notification created\n");

    // Test 9: Query Data
    console.log("9. Testing data queries...");

    // Get all users
    const users = await prisma.user.findMany({
      where: { deleted_at: null },
      select: { id: true, name: true, email: true, role: true },
    });
    console.log(`✅ Found ${users.length} users`);

    // Get all products
    const products = await prisma.product.findMany({
      where: { deleted_at: null },
      include: { category: true, creator: true },
    });
    console.log(`✅ Found ${products.length} products`);

    // Get all orders
    const orders = await prisma.order.findMany({
      where: { deleted_at: null },
      include: { user: true, order_items: { include: { product: true } } },
    });
    console.log(`✅ Found ${orders.length} orders\n`);

    // Test 10: Update Operations
    console.log("10. Testing update operations...");

    // Update product
    await prisma.product.update({
      where: { id: product.id },
      data: { featured: true },
    });
    console.log("✅ Product updated");

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED" },
    });
    console.log("✅ Order status updated");

    // Mark notification as read
    await prisma.notification.update({
      where: { id: notification.id },
      data: { read: true, read_at: new Date() },
    });
    console.log("✅ Notification marked as read\n");

    console.log("🎉 All tests passed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Orders: ${orders.length}`);
    console.log(`- Chats: 1`);
    console.log(`- Notifications: 1`);
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
runTests();
