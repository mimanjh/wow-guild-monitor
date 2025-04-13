import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar.component";
import GuildMonitorPage from "./pages/GuildMonitorPage";
import Page2 from "./pages/Page2";
import "./functions/wowApi";
const { Content, Header } = Layout;

const headerHeightPx = 64;
const contentPaddingPx = 24;

function App() {
  const location = useLocation(); // Get current URL for menu selection

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        style={{ position: "fixed", top: 0, width: "100%", height: headerHeightPx, zIndex: 1, background: "#001529" }}
      >
        <h2 style={{ color: "white", margin: 0 }}>WOW Guild Monitor</h2>
      </Header>
      <Layout style={{ flex: 1, marginTop: headerHeightPx }}>
        <Sidebar pathname={location.pathname} />
        <Layout style={{ padding: contentPaddingPx, overflow: "hidden" }}>
          <Content
            style={{
              padding: contentPaddingPx,
              background: "#fff",
              borderRadius: 10,
              maxHeight: `calc(100vh - ${headerHeightPx + contentPaddingPx * 2}px)`, // Vciewport height minus header and padding
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path="/guild-monitor" element={<GuildMonitorPage />} />
              <Route path="/page2" element={<Page2 />} />
              <Route path="/" element={<Navigate replace to={"/guild-monitor"} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
