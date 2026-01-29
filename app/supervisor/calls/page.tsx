import { DashboardLayout } from "@/components/dashboard-layout";
import { SupervisorCallsContent } from "@/components/supervisor/calls-content";

export default function SupervisorCallsPage() {
  return (
    <DashboardLayout requiredRole="supervisor">
      <SupervisorCallsContent />
    </DashboardLayout>
  );
}
