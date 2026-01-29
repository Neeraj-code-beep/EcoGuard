import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "supervisor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    // Get team members count (agents under this supervisor)
    const teamSizeResult = await sql`
      SELECT COUNT(*) as count FROM users WHERE supervisor_id = ${user.id} AND role = 'agent'
    `;

    // Get today's calls count
    const todayCallsResult = await sql`
      SELECT COUNT(*) as count
      FROM calls c
      JOIN users u ON c.agent_id = u.id
      WHERE u.supervisor_id = ${user.id}
      AND c.created_at >= ${today.toISOString()}
    `;

    // Get yesterday's calls for trend
    const yesterdayCallsResult = await sql`
      SELECT COUNT(*) as count
      FROM calls c
      JOIN users u ON c.agent_id = u.id
      WHERE u.supervisor_id = ${user.id}
      AND c.created_at >= ${yesterday.toISOString()}
      AND c.created_at < ${today.toISOString()}
    `;

    // Get team average score (join through calls to get agent)
    const teamScoreResult = await sql`
      SELECT AVG(e.total_score) as avg_score
      FROM evaluations e
      JOIN calls c ON e.call_id = c.id
      JOIN users u ON c.agent_id = u.id
      WHERE u.supervisor_id = ${user.id}
      AND e.created_at >= ${weekAgo.toISOString()}
    `;

    // Get previous week's average for trend
    const prevTeamScoreResult = await sql`
      SELECT AVG(e.total_score) as avg_score
      FROM evaluations e
      JOIN calls c ON e.call_id = c.id
      JOIN users u ON c.agent_id = u.id
      WHERE u.supervisor_id = ${user.id}
      AND e.created_at >= ${twoWeeksAgo.toISOString()}
      AND e.created_at < ${weekAgo.toISOString()}
    `;

    // Get pending alerts
    const alertsResult = await sql`
      SELECT COUNT(*) as count
      FROM alerts
      WHERE user_id = ${user.id}
      AND read_at IS NULL
    `;

    // Get agent performance
    const agentPerformance = await sql`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        COUNT(DISTINCT c.id) as total_calls,
        COALESCE(AVG(e.total_score), 0) as avg_score
      FROM users u
      LEFT JOIN calls c ON c.agent_id = u.id AND c.created_at >= ${weekAgo.toISOString()}
      LEFT JOIN evaluations e ON e.call_id = c.id AND e.created_at >= ${weekAgo.toISOString()}
      WHERE u.supervisor_id = ${user.id} AND u.role = 'agent'
      GROUP BY u.id, u.name, u.avatar_url
      ORDER BY avg_score DESC
    `;

    // Get recent alerts
    const recentAlerts = await sql`
      SELECT id, alert_type, title, message, severity, created_at
      FROM alerts
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const todayCalls = Number(todayCallsResult[0]?.count) || 0;
    const yesterdayCalls = Number(yesterdayCallsResult[0]?.count) || 0;
    const callsTrend = yesterdayCalls > 0 
      ? Math.round(((todayCalls - yesterdayCalls) / yesterdayCalls) * 100) 
      : 0;

    const currentAvgScore = Number(teamScoreResult[0]?.avg_score) || 0;
    const prevAvgScore = Number(prevTeamScoreResult[0]?.avg_score) || 0;
    const scoreTrend = prevAvgScore > 0 
      ? Math.round(((currentAvgScore - prevAvgScore) / prevAvgScore) * 100) 
      : 0;

    // Format agent performance
    const formattedPerformance = agentPerformance.map((agent) => ({
      id: agent.id,
      name: agent.name,
      avatar_url: agent.avatar_url,
      total_calls: Number(agent.total_calls),
      avg_score: Math.round(Number(agent.avg_score)),
      trend: 0,
    }));

    // Top performers (score >= 80)
    const topPerformers = formattedPerformance
      .filter((a) => a.avg_score >= 80)
      .slice(0, 3);

    // Needs attention (score < 70 or significant drop)
    const needsAttention = formattedPerformance
      .filter((a) => a.avg_score < 70 && a.avg_score > 0)
      .slice(0, 3);

    return NextResponse.json({
      teamSize: Number(teamSizeResult[0]?.count) || 0,
      todayCalls,
      callsTrend,
      teamAvgScore: Math.round(currentAvgScore) || 0,
      scoreTrend,
      pendingAlerts: Number(alertsResult[0]?.count) || 0,
      agentPerformance: formattedPerformance,
      topPerformers,
      needsAttention,
      recentAlerts,
    });
  } catch (error) {
    console.error("Error fetching supervisor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
