"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CurrentUserAvatarProps = React.ComponentProps<typeof Avatar>;

export const CurrentUserAvatar = ({
  size = "default",
  ...props
}: CurrentUserAvatarProps) => {
  const { user } = useUser();
  const name = user?.fullName || user?.primaryEmailAddress?.emailAddress.split("@")[0] || "?";
  const profileImage = user?.imageUrl;
  const initials = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <Avatar size={size} {...props}>
      {profileImage && <AvatarImage src={profileImage} alt={initials} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
