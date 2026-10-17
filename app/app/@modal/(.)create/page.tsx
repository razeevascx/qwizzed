import { ProtectedPage } from "@/components/protected-page";
import CreateQuizPage from "../../(qwizzes)/create/CreateQuizClient";

export default function Page() {
  return <ProtectedPage><CreateQuizPage intercepted /></ProtectedPage>;
}
