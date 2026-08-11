import { LayoutDashboard } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function AdministrativeStaffDashboard() {
  return (
    <AdministrativeStaffPlaceholder
      title="Dashboard"
      description="A focused view of your organization’s administrative work."
      icon={LayoutDashboard}
    />
  );
}