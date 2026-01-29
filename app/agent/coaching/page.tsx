import { DashboardLayout } from "@/components/dashboard-layout";
import { CoachingContent } from "@/components/agent/coaching-content";

export default function AgentCoachingPage() {
  return (
    <DashboardLayout requiredRole="agent">
      <CoachingContent />
    </DashboardLayout>
  );
}
