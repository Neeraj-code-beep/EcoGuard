import { DashboardLayout } from "@/components/dashboard-layout";
import { UsersContent } from "@/components/admin/users-content";

export default function AdminUsersPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <UsersContent />
    </DashboardLayout>
  );
}
