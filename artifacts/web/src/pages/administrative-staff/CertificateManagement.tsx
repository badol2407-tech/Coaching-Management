import { Award } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function CertificateManagement() {
  return (
    <AdministrativeStaffPlaceholder
      title="Certificate Management"
      description="A reserved workspace for certificate administration."
      icon={Award}
    />
  );
}