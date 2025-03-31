import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar.component";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
const { Content } = Layout;

function App() {
  const location = useLocation(); // Get current URL for menu selection

  return (
    // <Layout style={{ minHeight: "100vh" }}>
    //   <Sidebar pathname={location.pathname} />
    //   <Layout>
    //     <Content style={{ padding: "24px", background: "#fff" }}>
    //       <Routes>
    //         <Route path="/page1" element={<Page1 />} />
    //         <Route path="/page2" element={<Page2 />} />
    //         <Route path="/" element={<Page1 />} /> {/* Default route */}
    //       </Routes>
    //     </Content>
    //   </Layout>
    // </Layout>
    <p>test</p>
  );
}

export default App;
