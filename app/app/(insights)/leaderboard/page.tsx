import { ProtectedPage } from "@/components/protected-page";
import PageContent from "./LeaderboardClient";

export default function Page() {
  return <ProtectedPage><PageContent /></ProtectedPage>;
}
