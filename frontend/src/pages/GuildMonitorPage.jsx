import React, { useEffect, useState } from "react";
import { Spin, Table, Typography } from "antd";
import dayjs from "dayjs";
import "./GuildMonitorPage.scss";
import axios from "axios";

const VITE_API_PREFIX = import.meta.env.VITE_API_PREFIX;
const { Title } = Typography;

const colorPool = {
    DeathKnight: "#C41F3B",
    DemonHunter: "#A330C9",
    Druid: "#FF7D0A",
    Evoker: "#33937F",
    Hunter: "#ABD473",
    Mage: "#69CCF0",
    Monk: "#00FF96",
    Paladin: "#F58CBA",
    Priest: "#FFFFFF",
    Rogue: "#FFF569",
    Shaman: "#0070DE",
    Warlock: "#9482C9",
    Warrior: "#C79C6E",
};

const guildName = "Awaken Reunited";

function GuildMonitorPage() {
    const now = dayjs().format("YYYY-MM-DD HH:mm");
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${VITE_API_PREFIX}/wow_api/users/update_db`).then(() => {
            axios
                .get(`${VITE_API_PREFIX}/wow_api/users`)
                .then((res) => setDataSource(res.data))
                .catch((err) => console.error("Failed to fetch users:", err))
                .finally(() => setLoading(false));
        });
    }, []);

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
                                        <strong>Role:</strong> {record.role}
                                    </td>
                                </tr>
                            );
                        }
                        return <tr {...restProps} />;
                    },
                },
            }}
        />
    );
}

export default GuildMonitorPage;
