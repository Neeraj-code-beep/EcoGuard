import { DashboardLayout } from "@/components/dashboard-layout";
import { SOPsContent } from "@/components/shared/sops-content";

export default function SupervisorSOPsPage() {
  return (
    <DashboardLayout requiredRole="supervisor">
      <SOPsContent canEdit={false} />
    </DashboardLayout>
  );
}
