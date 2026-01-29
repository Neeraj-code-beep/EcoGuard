import { DashboardLayout } from "@/components/dashboard-layout";
import { TeamPerformanceContent } from "@/components/supervisor/team-content";

export default function SupervisorTeamPage() {
  return (
    <DashboardLayout requiredRole="supervisor">
      <TeamPerformanceContent />
    </DashboardLayout>
  );
}
