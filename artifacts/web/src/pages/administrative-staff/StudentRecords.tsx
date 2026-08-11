import { Users } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function StudentRecords() {
  return (
    <AdministrativeStaffPlaceholder
      title="Student Records"
      description="Keep student information organized for your organization."
      icon={Users}
    />
  );
}