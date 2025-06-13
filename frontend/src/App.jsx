import React, { useEffect, useState } from "react";
import {
    Routes,
    Route,
    useLocation,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar.component";
import GuildMonitorPage from "./pages/GuildMonitorPage";
import GuildRoasterPage from "./pages/GuildRoasterPage";
import axios from "axios";

const VITE_API_PREFIX = import.meta.env.VITE_API_PREFIX;

const { Content, Header } = Layout;

const headerHeightPx = 64;
const contentPaddingPx = 24;

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const serverName = "Tichondrius";
    const guildName = "Awaken Reunited";

    useEffect(() => {
        const authenticated = new URLSearchParams(window.location.search).get(
            "authenticated"
        );

        if (authenticated) {
            axios
                .get(
                    `${VITE_API_PREFIX}/wow_api/isAdmin?server=${serverName}&name=${guildName}`,
                    { withCredentials: true }
                )
                .then((res) => {
                    setIsAdmin(res.data.is_admin);
                })
                .catch((err) => {
                    console.error("Admin check failed:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            window.location.href = `${VITE_API_PREFIX}/wow_api/oauth/start`;
        }
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Layout
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header
                style={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    height: headerHeightPx,
                    zIndex: 1,
                    background: "#001529",
                }}
            >
                <h2 style={{ color: "white", margin: 0 }}>WoW Guild Monitor</h2>
            </Header>
            <Layout style={{ flex: 1, marginTop: headerHeightPx }}>
                <Sidebar pathname={location.pathname} isAdmin={isAdmin} />
                <Layout
                    style={{ padding: contentPaddingPx, overflow: "hidden" }}
                >
                    <Content
                        style={{
                            padding: contentPaddingPx,
                            background: "#fff",
                            borderRadius: 10,
                            maxHeight: `calc(100vh - ${
                                headerHeightPx + contentPaddingPx * 2
                            }px)`,
                            overflowY: "auto",
                        }}
                    >
                        <Routes>
                            <Route
                                path="/guild-monitor"
                                element={<GuildMonitorPage isAdmin={isAdmin} />}
                            />
                            <Route
                                path="/guild-roaster"
                                element={<GuildRoasterPage isAdmin={isAdmin} />}
                            />
                            <Route
                                path="/"
                                element={
                                    <Navigate replace to={"/guild-monitor"} />
                                }
                            />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default App;
