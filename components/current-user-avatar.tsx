"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CurrentUserAvatarProps = React.ComponentProps<typeof Avatar>;

export const CurrentUserAvatar = ({
  size = "default",
  ...props
}: CurrentUserAvatarProps) => {
  const { name, image: profileImage } = useCurrentUser();
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
