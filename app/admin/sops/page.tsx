import { DashboardLayout } from "@/components/dashboard-layout";
import { SOPsContent } from "@/components/shared/sops-content";

export default function AdminSOPsPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <SOPsContent canEdit={true} />
    </DashboardLayout>
  );
}
