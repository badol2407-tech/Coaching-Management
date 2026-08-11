import { Settings } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function AdministrativeStaffProfileSettings() {
  return (
    <AdministrativeStaffPlaceholder
      title="Profile & Settings"
      description="Manage your administrative staff profile in your organization."
      icon={Settings}
    />
  );
}