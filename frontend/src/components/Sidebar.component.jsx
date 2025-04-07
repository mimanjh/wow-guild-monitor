import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

function Sidebar({ pathname }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/guild-monitor",
      icon: <HomeOutlined />,
      label: "Guild Monitor",
      onClick: () => navigate("/guild-monitor"),
    },
    {
      key: "/page2",
      icon: <UserOutlined />,
      label: "Page 2",
      onClick: () => navigate("/page2"),
    },
  ];

  return (
    <Sider
      width={200}
      // className="site-layout-background"
    >
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[pathname]} // Highlight current page
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}

export default Sidebar;
