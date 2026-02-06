import("node-fetch").then(({ default: fetch }) => {
  async function testApi() {
    try {
      // First, login to get a token
      const loginResponse = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "customer@example.com",
          password: "customer123",
          role: "CUSTOMER",
        }),
      });

      if (!loginResponse.ok) {
        console.error("Login failed:", await loginResponse.text());
        return;
      }

      const loginData = await loginResponse.json();
      console.log("Login successful, login data:", loginData);
      console.log("Token:", loginData.data.token.substring(0, 20) + "...");

      // Test products API
      const productsResponse = await fetch("http://localhost:3000/api/customer/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginData.data.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!productsResponse.ok) {
        console.error("Products API failed:", await productsResponse.text());
        return;
      }

      const productsData = await productsResponse.json();
      console.log("Products API response:", productsData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  testApi();
});
