import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar.component";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
const { Content, Header } = Layout;

const headerHeightPx = 64;
const contentPaddingPx = 24;

function App() {
  const location = useLocation(); // Get current URL for menu selection

  // return (
  //   <Layout style={{ minHeight: "100vh" }}>
  //     <Header>
  //       <h2 style={{ color: "white" }}>WOW Guild Monitor</h2>
  //     </Header>
  //     <Layout>
  //       <Sidebar pathname={location.pathname} />
  //       <Layout style={{ padding: 24 }}>
  //         <Content style={{ padding: "24px", background: "#fff", borderRadius: 10 }}>
  //           <Routes>
  //             <Route path="/page1" element={<Page1 />} />
  //             <Route path="/page2" element={<Page2 />} />
  //             <Route path="/" element={<Page1 />} /> {/* Default route */}
  //           </Routes>
  //         </Content>
  //       </Layout>
  //     </Layout>
  //   </Layout>
  // );

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
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
              <Route path="/" element={<Page1 />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
