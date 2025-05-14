import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router";

export default function SettingsNavigation() {
  const location = useLocation();

  return (
    <div className="setting-navigation">
      <h1>Settings</h1>
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname === "/profile/appearance" ? "2" : "1"]}
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            label: <Link to="/profile/personal-info">Personal Info</Link>,
          },
          {
            key: "2",
            label: <Link to="/profile/appearance">Appearance</Link>,
          },
        ]}
        style={{ backgroundColor: "transparent", border: "none", color: "rgb(12, 11, 11)" }}
      />
    </div>
  );
}