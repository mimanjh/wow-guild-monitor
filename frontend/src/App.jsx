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
        // If we just got redirected back from Blizzard, we should NOT call /oauth/callback from JS.
        // The browser already hit it during redirect and set the cookie.

        const codeInUrl = new URLSearchParams(window.location.search).get(
            "code"
        );

        if (codeInUrl) {
            // Clean the URL by removing the code param
            navigate("/", { replace: true });
            return;
        }

        // Try to call isAdmin, which relies on the signed cookie set by the backend
        axios
            .get(
                `${VITE_API_PREFIX}/wow_api/isAdmin?server=${serverName}&name=${guildName}`,
                {
                    withCredentials: true, // VERY important to send cookies
                }
            )
            .then((res) => {
                setIsAdmin(res.data.is_admin);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    // Not logged in → start auth
                    window.location.href = `${VITE_API_PREFIX}/wow_api/oauth/start/`;
                } else {
                    console.error("isAdmin check failed:", err);
                }
            })
            .finally(() => setLoading(false));
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
