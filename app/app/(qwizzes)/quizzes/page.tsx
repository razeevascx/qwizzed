import { ProtectedPage } from "@/components/protected-page";
import PageContent from "./MyQuizzesClient";

export default function Page() {
  return <ProtectedPage><PageContent /></ProtectedPage>;
}
