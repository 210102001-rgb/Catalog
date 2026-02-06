import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { requireAdmin } from "@/lib/auth";
import { writeFile, access, mkdir } from "fs/promises";
import { join } from "path";

// Helper function to save uploaded file and return the public URL
async function saveUploadedFile(file: File): Promise<string> {
  try {
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get the file extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.round(Math.random() * 10000)}.${ext}`;

    // Define upload directory path
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Create uploads directory if it doesn't exist
    try {
      await access(uploadDir);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    // Define file path
    const filePath = join(uploadDir, fileName);

    // Write the file to disk
    await writeFile(filePath, buffer);

    // Return the public URL (relative to public directory)
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error saving uploaded file:", error);
    throw error;
  }
}

// Handle GET, POST, and PUT requests
export const GET = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const categoryIdParam = searchParams.get("category_id");
    const subcategoryIdParam = searchParams.get("subcategory_id");
    const search = searchParams.get("search") || undefined;
    const publishedParam = searchParams.get("published");

    const category_id = categoryIdParam ? parseInt(categoryIdParam) : undefined;
    const subcategory_id = subcategoryIdParam ? parseInt(subcategoryIdParam) : undefined;
    const published = publishedParam ? publishedParam === "true" : undefined;

    // Enhanced filters
    const filters: any = {
      status,
      category_id,
      subcategory_id,
      search,
      published,
    };

    // Add type filter if provided
    const type = searchParams.get("type");
    if (type && type !== "Semua") {
      filters.type = type;
    }

    // Add sorting
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const orderBy: any = {};
    orderBy[sort] = order;

    const result = await productService.getAll(page, limit, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get all products error:", error);
    return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
  }
});

// Create a new product (POST request)
export const POST = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    // Check if request is multipart/form-data (contains file uploads)
    const contentType = request.headers.get("content-type");

    let productData;
    let imageUrls: string[] = [];

    if (contentType?.startsWith("multipart/form-data")) {
      // Handle form data with file uploads
      const formData = await request.formData();

      // Process uploaded images
      const imageFile = formData.get("image") as File | null;
      const existingImage = formData.get("existingImage") as string | null;

      if (imageFile) {
        // Save the uploaded image and get its URL
        try {
          const imageUrl = await saveUploadedFile(imageFile);
          imageUrls.push(imageUrl);
        } catch (error) {
          console.error("Failed to save image:", error);
          return NextResponse.json({ error: "Failed to save uploaded image" }, { status: 500 });
        }
      } else if (existingImage) {
        // Preserve existing image if no new image was uploaded
        imageUrls.push(existingImage);
      }

      productData = {
        name: formData.get("name") as string,
        slug: (formData.get("name") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product-" + Date.now(),
        description: (formData.get("description") as string) || (formData.get("name") as string),
        location: formData.get("location") as string,
        latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : undefined,
        longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : undefined,
        size_width: formData.get("size_width") ? parseInt(formData.get("size_width") as string) : undefined,
        size_height: formData.get("size_height") ? parseInt(formData.get("size_height") as string) : undefined,
        illumination: formData.get("illumination") === "true",
        price_daily: parseFloat(formData.get("price_daily") as string) || 0,
        price_weekly: parseFloat(formData.get("price_weekly") as string) || 0,
        price_monthly: parseFloat(formData.get("price_monthly") as string) || 0,
        price_yearly: parseFloat(formData.get("price_yearly") as string) || 0,
        stock_quantity: parseInt(formData.get("stock_quantity") as string) || 1,
        status: (formData.get("status") as string) || "DRAFT",
        visibility: (formData.get("visibility") as string) || "DAYTIME",
        images: imageUrls,
        featured: formData.get("featured") === "true",
        published: formData.get("published") === "true",
      };
    } else {
      // Handle JSON data
      // Handle JSON data
      const jsonData = await request.json();
      productData = {
        name: jsonData.name,
        slug: jsonData.slug || jsonData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product-" + Date.now(),
        description: jsonData.description || jsonData.name,
        location: jsonData.location,
        latitude: jsonData.latitude,
        longitude: jsonData.longitude,
        size_width: jsonData.size_width,
        size_height: jsonData.size_height,
        illumination: jsonData.illumination || false,
        price_daily: jsonData.price_daily || 0,
        price_weekly: jsonData.price_weekly || 0,
        price_monthly: jsonData.price_monthly || 0,
        price_yearly: jsonData.price_yearly || 0,
        stock_quantity: jsonData.stock_quantity || 1,
        type: jsonData.type || "Digital",
        status: jsonData.status || "DRAFT",
        visibility: jsonData.visibility || "DAYTIME",
        images: jsonData.images || [],
        featured: jsonData.featured || false,
        published: jsonData.published || false,
      };
    }

    // Validate required fields
    if (!productData.name || !productData.slug || !productData.location || !productData.price_daily || productData.price_daily <= 0) {
      return NextResponse.json({ error: "Name, slug, location, and valid daily price are required" }, { status: 400 });
    }

    // Create product - assign to admin who is creating it
    const product = await productService.create({
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      location: productData.location,
      latitude: productData.latitude,
      longitude: productData.longitude,
      size_width: productData.size_width,
      size_height: productData.size_height,
      illumination: productData.illumination,
      visibility: productData.visibility,
      price_daily: productData.price_daily,
      price_weekly: productData.price_weekly,
      price_monthly: productData.price_monthly,
      price_yearly: productData.price_yearly,
      stock_quantity: productData.stock_quantity,
      images: productData.images,
      featured: productData.featured,
      published: productData.published,
      created_by: user.id,
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
});

// Handle PUT for approving/rejecting products or updating product details
export const PUT = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const { productId, action, reason, updateData } = await request.json();

    // If it's an approval/rejection action
    if (productId && action) {
      if (action === "approve") {
        const updatedProduct = await productService.approve(productId, user.id);

        return NextResponse.json({
          message: "Product approved successfully",
          product: updatedProduct,
        });
      } else if (action === "reject") {
        const updatedProduct = await productService.reject(productId, reason);

        return NextResponse.json({
          message: "Product rejected successfully",
          product: updatedProduct,
        });
      } else {
        return NextResponse.json({ error: "Action must be either 'approve' or 'reject'" }, { status: 400 });
      }
    }
    // If it's an update request
    else if (productId && updateData) {
      const updatedProduct = await productService.update(productId, updateData);

      return NextResponse.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      return NextResponse.json({ error: "Either productId with action (for approve/reject) or productId with updateData (for update) is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Approve/reject/update product error:", error);
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
});
