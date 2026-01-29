import { DashboardLayout } from "@/components/dashboard-layout";
import { SupervisorDashboardContent } from "@/components/supervisor/dashboard-content";

export default function SupervisorDashboardPage() {
  return (
    <DashboardLayout requiredRole="supervisor">
      <SupervisorDashboardContent />
    </DashboardLayout>
  );
}
