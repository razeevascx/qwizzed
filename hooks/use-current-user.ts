import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface UserProfile {
  name: string;
  image: string | null;
  loading: boolean;
}

export const useCurrentUser = (): UserProfile => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "?",
    image: null,
    loading: true,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await createClient().auth.getSession();
        if (error) {
          console.error(error);
          setProfile((prev) => ({ ...prev, loading: false }));
          return;
        }

        const user = data.session?.user;
        setProfile({
          name: user?.user_metadata?.full_name ?? "?",
          image: user?.user_metadata?.avatar_url ?? null,
          loading: false,
        });
      } catch (err) {
        console.error(err);
        setProfile((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchUserProfile();
  }, []);

  return profile;
};
