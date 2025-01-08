import React from "react";
import { User, Calendar, Hash, Crown } from "lucide-react";
import ProfileItem from "../../common/ProfileItem";
import { LEVELS } from "@/lib/constants/levels";
import { UserProfileData } from "@/types/contract";

interface ProfileDetailsProps {
  userProfileData: UserProfileData | null;
  currentLevel: number;
  directSponsorId: string | null;
  matrixSponsorId: string | null;
}

const ProfileDetails = ({
  userProfileData,
  currentLevel,
  directSponsorId,
  matrixSponsorId,
}: ProfileDetailsProps) => {
  return (
    <section className="relative p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
      <div className="flex items-center space-x-2 text-lg font-bold">
        <User className="h-5 w-5" />
        <span>Profile Details</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 mt-4">
        <ProfileItem
          icon={Hash}
          label="User ID"
          value={userProfileData?.frontend_id || "Not Available"}
        />
        <ProfileItem
          icon={Crown}
          label="Rank"
          value={`${currentLevel} - ${
            LEVELS.find((l) => l.level === currentLevel)?.name || "Unknown"
          }`}
        />
        <ProfileItem
          icon={Calendar}
          label="Activation Date"
          value={
            userProfileData
              ? new Date(userProfileData.created_at).toLocaleDateString()
              : "Not Available"
          }
        />
        <div className="flex flex-col items-start justify-center px-4 py-4 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
          <div className="flex flex-row items-center space-x-2">
            <span className="text-sm font-medium">Direct Sponsor</span>
            <span className="text-sm font-bold">{directSponsorId}</span>
          </div>
          <div className="flex flex-row items-center space-x-2">
            <span className="text-sm font-medium">Matrix Sponsor</span>
            <span className="text-sm font-bold">{matrixSponsorId}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetails;
