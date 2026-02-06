import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/auth";
import { prisma } from "@/lib/db";

export const GET = requireAuth(async (req: NextRequest, user: any) => {
  try {
    // Get recently viewed or popular products
    const recommendations = await prisma.product.findMany({
      where: {
        published: true,
        status: "APPROVED",
      },
      take: 5,
      orderBy: [{ rating: "desc" }, { review_count: "desc" }],
      select: {
        id: true,
        name: true,
        visibility: true,
        price_daily: true,
        location: true,
        images: true,
        rating: true,
        review_count: true,
      },
    });

    // Transform the data to match the expected format
    const transformedRecommendations = recommendations.map((product) => {
      // Calculate match percentage based on rating and reviews
      const baseMatch = Math.min(95, Math.floor(product.rating * 15) + Math.min(10, product.review_count));
      const match = `${baseMatch}%`;

      return {
        id: product.id,
        name: product.name,
        type: product.visibility,
        match,
        price: `Rp ${product.price_daily.toLocaleString()}`,
        impressions: `${Math.floor(product.rating * 50000).toLocaleString()}/minggu`,
        location: product.location,
        image: Array.isArray(product.images) && product.images.length > 0 ? (product.images[0] as string) : "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format",
      };
    });

    return NextResponse.json(transformedRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
});
