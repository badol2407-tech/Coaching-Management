import { Wallet } from "lucide-react";
import AdministrativeStaffPlaceholder from "./AdministrativeStaffPlaceholder";

export default function FeeCollection() {
  return (
    <AdministrativeStaffPlaceholder
      title="Fee Collection"
      description="A clear starting point for organization fee administration."
      icon={Wallet}
    />
  );
}