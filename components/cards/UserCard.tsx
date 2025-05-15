import { Avatar, User } from "@nextui-org/react";
import Link from "next/link";

export const UserCard = ({ userData }: { userData: any }) => {
  
  return (
    <div className="bg-white rounded-md p-4">
      <Link href={`/profile/${userData.id}`}>
        <User
          name={`${userData.names} ${userData.lastname}`}
          description={userData.profession}
          avatarProps={{
            src: userData.profileImage,
            size: "lg",
          }}
        />
      </Link>
    </div>
  );
};
