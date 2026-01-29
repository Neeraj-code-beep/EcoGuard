import { DashboardLayout } from "@/components/dashboard-layout";
import { AgentCallsContent } from "@/components/agent/calls-content";

export default function AgentCallsPage() {
  return (
    <DashboardLayout requiredRole="agent">
      <AgentCallsContent />
    </DashboardLayout>
  );
}
