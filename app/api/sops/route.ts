import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sops = await sql`
      SELECT id, title, content, category, version, created_at, updated_at
      FROM sops
      ORDER BY category, title
    `;

    // Get unique categories
    const categoriesResult = await sql`
      SELECT DISTINCT category FROM sops ORDER BY category
    `;
    const categories = categoriesResult.map((row) => row.category);

    return NextResponse.json({ sops, categories });
  } catch (error) {
    console.error("Error fetching SOPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch SOPs" },
      { status: 500 }
    );
  }
}
