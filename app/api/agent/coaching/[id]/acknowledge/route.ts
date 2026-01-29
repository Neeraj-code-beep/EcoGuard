import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await sql`
      UPDATE coaching_insights
      SET acknowledged_at = NOW()
      WHERE id = ${id} AND agent_id = ${user.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error acknowledging insight:", error);
    return NextResponse.json(
      { error: "Failed to acknowledge insight" },
      { status: 500 }
    );
  }
}
