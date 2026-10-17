import { ProtectedPage } from "@/components/protected-page";
import PageContent from "./DashboardClient";

export default function Page() {
  return <ProtectedPage><PageContent /></ProtectedPage>;
}
