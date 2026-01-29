import { DashboardLayout } from "@/components/dashboard-layout";
import { AnalyticsContent } from "@/components/admin/analytics-content";

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout requiredRole="admin">
      <AnalyticsContent />
    </DashboardLayout>
  );
}
