import { DashboardLayout } from "@/components/dashboard-layout";
import { AdminCallsContent } from "@/components/admin/calls-content";

export default function AdminCallsPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <AdminCallsContent />
    </DashboardLayout>
  );
}
