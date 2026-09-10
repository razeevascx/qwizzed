import { createClient } from "./lib/supabase/server";

async function main() {
  const client = await createClient();
  const { data, error } = await client
    .from("quiz_submissions")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error fetching submissions:", error);
  } else {
    console.log("Success! Columns:", data);
  }
}

main().catch(console.error);
