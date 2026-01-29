import { DashboardLayout } from "@/components/dashboard-layout";
import { AgentDashboardContent } from "@/components/agent/dashboard-content";

export default function AgentDashboardPage() {
  return (
    <DashboardLayout requiredRole="agent">
      <AgentDashboardContent />
    </DashboardLayout>
  );
}
