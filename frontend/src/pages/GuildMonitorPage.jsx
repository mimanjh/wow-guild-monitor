import React, { useEffect, useState } from "react";
import {
    Spin,
    Table,
    Typography,
    Modal,
    Button,
    Layout,
    Input,
    Select,
    message,
    AutoComplete,
} from "antd";
import dayjs from "dayjs";
import "./GuildMonitorPage.scss";
import axios from "axios";

const VITE_API_PREFIX = import.meta.env.VITE_API_PREFIX;
const { Title } = Typography;

const guildName = "Awaken Reunited";
const guildServer = "Tichondrius";

const { Header, Content } = Layout;
const { Option } = Select;

const normalizeClassName = (id) => {
    const classMap = {
        1: "Warrior",
        2: "Paladin",
        3: "Hunter",
        4: "Rogue",
        5: "Priest",
        6: "DeathKnight",
        7: "Shaman",
        8: "Mage",
        9: "Warlock",
        10: "Monk",
        11: "Druid",
        12: "DemonHunter",
        13: "Evoker",
    };
    return classMap[id] || "Unknown";
};

function GuildMonitorPage() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedChar, setSelectedChar] = useState(null);
    const [role, setRole] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [options, setOptions] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        refreshRoster();
        fetchGuildRoster();
    }, []);

    function refreshRoster() {
        setLoading(true);
        axios.get(`${VITE_API_PREFIX}/wow_api/users/update_db`).then(() => {
            axios
                .get(`${VITE_API_PREFIX}/wow_api/users`)
                .then((res) => {
                    setDataSource(res.data);
                })
                .finally(() => setLoading(false));
        });
    }

    function fetchGuildRoster() {
        const params = new URLSearchParams({
            server: guildServer.toLowerCase().replace(" ", "-"),
            name: guildName.toLowerCase(),
        });
        axios
            .get(`${VITE_API_PREFIX}/wow_api/guild/roaster?${params}`)
            .then((res) => {
                const rawMembers = res.data.members;
                const membersArray = Array.isArray(rawMembers)
                    ? rawMembers
                    : Object.values(rawMembers); // fallback in case it's an object

                setMembers(membersArray);
            })
            .catch((err) => {
                console.error("Failed to fetch guild roster: ", err);
                message.error("Could not load guild roster");
            });
    }

    function openAddDialog() {
        setAddDialogOpen(true);
    }

    function handleSubmit() {
        if (!selectedChar || !role) {
            message.error("Please select a character and role.");
            return;
        }

        axios
            .post(`${VITE_API_PREFIX}/wow_api/users/add`, {
                character: selectedChar,
                role,
            })
            .then(() => {
                message.success(`${selectedChar} added as ${role}`);
                setAddDialogOpen(false);
                setSelectedChar(null);
                setRole(null);
                setSearchText("");
                refreshRoster();
            })
            .catch((err) => {
                console.error(err);
                message.error("Failed to add user.");
            });
    }

    const columns = [
        {
            title: "Character Name",
            dataIndex: "character",
            render: (text, record) => {
                if (record.isGroupRow) return null;

                const className =
                    record.character_class?.replace(/\s/g, "") || "default";
                const iconPath = `/class_icons/${className.toLowerCase()}.png`;
                return (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <img
                            src={iconPath}
                            alt={className}
                            style={{
                                width: 32,
                                height: 32,
                                objectFit: "contain",
                            }}
                        />
                        {text}
                    </span>
                );
            },
        },
        {
            title: "Realm",
            dataIndex: "realm",
        },
        {
            title: "Item Level",
            dataIndex: "average_item_level",
        },
        {
            title: "Faction",
            dataIndex: "faction",
        },
        {
            title: "Class",
            dataIndex: "character_class",
            render: (cls, record) =>
                cls && record.character_spec
                    ? `${cls} - ${record.character_spec}`
                    : cls || "",
        },
        {
            title: "Role",
            dataIndex: "role",
            filters: ["Tank", "Healer", "Dealer"].map((role) => ({
                text: role,
                value: role,
            })),
            onFilter: (value, record) => record.role === value,
        },
        {
            title: "Last Played At",
            dataIndex: "last_login_timestamp",
            render: (ts, record) => {
                if (record.isGroupRow) return null;

                dayjs(ts).format("YYYY-MM-DD h:mma");
            },
        },
    ];

    const groupedData = dataSource.sort((a, b) => {
        if (a.role === b.role) return 0;
        const order = ["Tank", "Healer", "Dealer"];
        return order.indexOf(a.role) - order.indexOf(b.role);
    });

    const finalData = [];
    let lastRole = null;
    groupedData.forEach((item) => {
        if (item.role !== lastRole) {
            finalData.push({
                isGroupRow: true,
                role: item.role,
                key: `grp-${item.role}`,
            });
            lastRole = item.role;
        }
        finalData.push({
            ...item,
            isGroupRow: false,
            key: `${item.character}-${item.realm}`,
        });
    });

    return (
        <Layout>
            <Header
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    height: "70px",
                }}
            >
                <Title level={3} style={{ margin: 0 }}>
                    {guildName}
                </Title>
                <button
                    className="add-character-btn"
                    onClick={() => openAddDialog()}
                    style={{
                        display: "flex",
                        height: "70%",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "10%",
                    }}
                >
                    Add to Roster
                </button>
            </Header>
            <Modal
                title="Add to Roster"
                open={addDialogOpen}
                onCancel={() => setAddDialogOpen(false)}
                onOk={handleSubmit}
                okButtonProps={{ disabled: !selectedChar || !role }}
            >
                <p>Select a character:</p>
                <AutoComplete
                    style={{ width: "100%", marginBottom: 12 }}
                    options={options}
                    value={searchText}
                    onSearch={(text) => {
                        setSearchText(text);
                        const filtered = members
                            .filter((m) =>
                                m.character.name
                                    .toLowerCase()
                                    .includes(text.toLowerCase())
                            )
                            .map((m) => ({
                                value: m.character.name, // for backend
                                label: `${
                                    m.character.name
                                } - ${normalizeClassName(
                                    m.character.playable_class.id
                                )}`, // for UI
                            }));
                        setOptions(filtered);
                    }}
                    onSelect={(value) => {
                        setSelectedChar(value);
                        setSearchText(value);
                    }}
                    optionLabelProp="label" // ✅ important when using custom labels
                    placeholder="Start typing character name..."
                />
                <p>Set role:</p>
                <Select
                    placeholder="Role"
                    style={{ width: "100%" }}
                    onChange={(val) => setRole(val)}
                    value={role}
                >
                    <Option value="Tank">Tank</Option>
                    <Option value="Healer">Healer</Option>
                    <Option value="Dealer">Dealer</Option>
                </Select>
            </Modal>
            <Content>
                <Table
                    columns={columns}
                    dataSource={finalData}
                    loading={loading}
                    pagination={false}
                    rowKey={(record) => record.key}
                    rowClassName={(record) =>
                        record.isGroupRow
                            ? "table-group-row"
                            : record.character_class
                            ? `row-${record.character_class.replace(/\s/g, "")}`
                            : ""
                    }
                    components={{
                        body: {
                            row: ({ record, ...restProps }) => {
                                if (record?.isGroupRow) {
                                    return (
                                        <tr className="table-group-row">
                                            <td colSpan={columns.length}>
                                                <strong>Role:</strong>{" "}
                                                {record.role}
                                            </td>
                                        </tr>
                                    );
                                }
                                return <tr {...restProps} />;
                            },
                        },
                    }}
                />
            </Content>
        </Layout>
    );
}

export default GuildMonitorPage;
