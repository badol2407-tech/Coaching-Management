import { IdCard } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function IdCardManagement() {
  return (
    <AdministrativeStaffPlaceholder
      title="ID Card Management"
      description="Prepare the organization workspace for ID card operations."
      icon={IdCard}
    />
  );
}