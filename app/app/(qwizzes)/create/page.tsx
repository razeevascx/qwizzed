import { ProtectedPage } from "@/components/protected-page";
import PageContent from "./CreateQuizClient";

export default function Page() {
  return <ProtectedPage><PageContent /></ProtectedPage>;
}
