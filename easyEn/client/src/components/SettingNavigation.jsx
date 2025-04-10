import React from "react";
import { Menu } from "antd";

export default function SettingsNavigation() {
  return (
    <div className="setting-navigation">
      <h1>Settings</h1>
      <Menu
        mode="vertical"
        defaultSelectedKeys={["1"]}
        items={[
          { key: "1", label: "Personal Info" },
          { key: "2", label: "Appearance" },
        ]}
        style={{ backgroundColor: "transparent", border: "none", color: "rgb(12, 11, 11)" }}
      />
    </div>
  );
}