import { ClipboardList } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function AdmissionManagement() {
  return (
    <AdministrativeStaffPlaceholder
      title="Admission Management"
      description="A dedicated workspace for admission administration."
      icon={ClipboardList}
    />
  );
}