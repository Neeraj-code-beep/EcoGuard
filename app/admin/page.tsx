import { DashboardLayout } from "@/components/dashboard-layout";
import { AdminDashboardContent } from "@/components/admin/dashboard-content";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <AdminDashboardContent />
    </DashboardLayout>
  );
}
