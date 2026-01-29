import { DashboardLayout } from "@/components/dashboard-layout";
import { SettingsContent } from "@/components/admin/settings-content";

export default function AdminSettingsPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <SettingsContent />
    </DashboardLayout>
  );
}
