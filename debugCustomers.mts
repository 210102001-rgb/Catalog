import { prisma as database } from "./src/lib/db";

async function main() {
  try {
    console.log("Checking database for customers...");

    // Check if there are any users at all
    const allUsers = await database.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
    console.log("All users:", allUsers);

    // Check specifically for customers
    const customers = await database.user.findMany({
      where: { role: "CUSTOMER" },
      select: { id: true, name: true, email: true, status: true },
    });
    console.log("Customers:", customers);
    console.log("Number of customers:", customers.length);

    // If no customers, create a test customer
    if (customers.length === 0) {
      console.log("Creating test customer...");
      const newCustomer = await database.user.create({
        data: {
          uuid: "test-customer-123",
          name: "Test Customer",
          email: "test@example.com",
          password_hash: "test123",
          role: "CUSTOMER",
          user_type: "INDIVIDUAL",
          status: "ACTIVE",
          email_verified: true,
        },
      });
      console.log("Created test customer:", newCustomer);
    } else {
      console.log("Found customers in database. Chat should work.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
