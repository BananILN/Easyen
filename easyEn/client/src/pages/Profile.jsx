import React, { memo } from "react";
import SettingsNavigation from "../components/SettingNavigation";
import { Outlet } from "react-router";

const Profile = memo(() => {
  return (
    <div className="user-cont">
      <SettingsNavigation />
      <Outlet />
    </div>
  );
});

export default Profile;