import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

function Sidebar({ pathname }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/page1",
      icon: <HomeOutlined />,
      label: "Page 1",
      onClick: () => navigate("/page1"),
    },
    {
      key: "/page2",
      icon: <UserOutlined />,
      label: "Page 2",
      onClick: () => navigate("/page2"),
    },
  ];

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        selectedKeys={[pathname]} // Highlight current page
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}

export default Sidebar;
