import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { requireAuth } from "@/lib/auth";

// Create new product
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const {
      name,
      slug,
      description,
      category_id,
      subcategory_id,
      location,
      latitude,
      longitude,
      size_width,
      size_height,
      illumination,
      visibility,
      price_daily,
      price_weekly,
      price_monthly,
      price_yearly,
      stock_quantity,
      images,
      specifications,
      featured,
      published,
    } = await request.json();

// Validate required fields
    if (!name || !slug || !location || !price_daily) {
      return NextResponse.json({ error: "Name, slug, location, and daily price are required" }, { status: 400 });
    }

    // Validate name length
    if (name.trim().length < 3 || name.trim().length > 255) {
      return NextResponse.json({ error: "Name must be between 3 and 255 characters" }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json({ error: "Slug must contain only lowercase letters, numbers, and hyphens" }, { status: 400 });
    }

    // Validate prices are greater than 0
    if (price_daily <= 0) {
      return NextResponse.json({ error: "Daily price must be greater than 0" }, { status: 400 });
    }
    
    if (price_weekly !== undefined && price_weekly <= 0) {
      return NextResponse.json({ error: "Weekly price must be greater than 0" }, { status: 400 });
    }
    
    if (price_monthly !== undefined && price_monthly <= 0) {
      return NextResponse.json({ error: "Monthly price must be greater than 0" }, { status: 400 });
    }
    
    if (price_yearly !== undefined && price_yearly <= 0) {
      return NextResponse.json({ error: "Yearly price must be greater than 0" }, { status: 400 });
    }

    // Validate stock quantity
    if (stock_quantity !== undefined && (stock_quantity < 0 || stock_quantity > 1000)) {
      return NextResponse.json({ error: "Stock quantity must be between 0 and 1000" }, { status: 400 });
    }

    // Validate dimensions
    if (size_width !== undefined && (size_width < 1 || size_width > 1000)) {
      return NextResponse.json({ error: "Width must be between 1 and 1000 meters" }, { status: 400 });
    }
    
    if (size_height !== undefined && (size_height < 1 || size_height > 1000)) {
      return NextResponse.json({ error: "Height must be between 1 and 1000 meters" }, { status: 400 });
    }

    // Validate coordinates
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      return NextResponse.json({ error: "Latitude must be between -90 and 90" }, { status: 400 });
    }
    
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      return NextResponse.json({ error: "Longitude must be between -180 and 180" }, { status: 400 });
    }

    // Validate visibility type
    const validVisibilities = ["DAYTIME", "NIGHTTIME", "ALWAYSON"];
    if (visibility && !validVisibilities.includes(visibility)) {
      return NextResponse.json({ error: "Invalid visibility type" }, { status: 400 });
    }

    // Validate images format
    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return NextResponse.json({ error: "Images must be an array" }, { status: 400 });
      }
      
      if (images.length > 10) {
        return NextResponse.json({ error: "Maximum 10 images allowed" }, { status: 400 });
      }
      
      for (const image of images) {
        if (typeof image !== "string") {
          return NextResponse.json({ error: "Each image must be a URL string" }, { status: 400 });
        }
      }
    }

    // Create product
    const product = await productService.create({
      name,
      slug,
      description,
      category_id,
      subcategory_id,
      location,
      latitude,
      longitude,
      size_width,
      size_height,
      illumination,
      visibility,
      price_daily,
      price_weekly,
      price_monthly,
      price_yearly,
      stock_quantity,
      images,
      specifications,
      featured,
      published,
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

// Get all published products for customers (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category_id = searchParams.get("category_id") || "";
    const subcategory_id = searchParams.get("subcategory_id") || "";
    const type = searchParams.get("type") || "";
    const published = searchParams.get("published") || "true";

    // Build filters
    const filters: any = {
      published: published === "true",
    };

    if (search) {
      filters.search = search;
    }

    if (category_id) {
      filters.category_id = parseInt(category_id);
    }

    if (subcategory_id) {
      filters.subcategory_id = parseInt(subcategory_id);
    }

    if (type && type !== "Semua") {
      filters.type = type;
    }

    const result = await productService.getAll(page, limit, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
  }
}
