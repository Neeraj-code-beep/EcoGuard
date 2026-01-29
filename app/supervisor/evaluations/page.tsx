import { DashboardLayout } from "@/components/dashboard-layout";
import { EvaluationsContent } from "@/components/supervisor/evaluations-content";

export default function SupervisorEvaluationsPage() {
  return (
    <DashboardLayout requiredRole="supervisor">
      <EvaluationsContent />
    </DashboardLayout>
  );
}
