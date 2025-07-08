import React, { useEffect, useState } from "react";
import { Spin, Table, Typography, Modal, Select, Button } from "antd";
// import { generateWowApiToken, wowApiToken } from "../functions/wowApi";
import dayjs from "dayjs";
import "./GuildMonitorPage.scss";
const VITE_API_PREFIX = import.meta.env.VITE_API_PREFIX;

const { Title } = Typography;

const guildName = "Awaken Reunited";
const guildServer = "Tichondrius";

const classMap = {
    1: "Warrior",
    2: "Paladin",
    3: "Hunter",
    4: "Rogue",
    5: "Priest",
    6: "Death Knight",
    7: "Shaman",
    8: "Mage",
    9: "Warlock",
    10: "Monk",
    11: "Druid",
    12: "Demon Hunter",
    13: "Evoker",
};

function GuildRoasterPage() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const now = dayjs().format("YYYY-MM-DD HH:mm");
    const { Option } = Select;
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedChar, setSelectedChar] = useState(null);

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

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    server: guildServer.toLowerCase().replace(" ", "-"),
                    name: guildName.toLowerCase(),
                });
                const url = `${VITE_API_PREFIX}/wow_api/guild/roaster?${params}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(
                        `Response status: ${response.status} for guild ${guildName}`
                    );
                }
                const json = await response.json();
                if (json.members) {
                    json.members.sort((a, b) => a.rank - b.rank);
                    setDataSource(json.members);
                }
            } catch (error) {
                console.log("Error - fetchData", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const columns = [
        {
            title: "#",
            render: (item, record, index) => index + 1,
        },
        {
            title: "Character Name",
            dataIndex: ["character", "name"],
            render: (text, record) =>
                record.loading ? <Spin spinning /> : text,
        },
        {
            title: "Realm",
            dataIndex: ["character", "realm", "slug"],
        },
        {
            title: "Level",
            dataIndex: ["character", "level"],
        },
        {
            title: "Guild Rank",
            dataIndex: "rank",
        },
        {
            title: "Faction",
            dataIndex: ["character", "faction", "type"],
        },
        {
            title: "Class",
            render: (_, record) => {
                const classId = record.character.playable_class?.id;
                return classMap[classId] || "Unknown";
            },
        },
        // {
        //   title: "Item Level",
        //   dataIndex: "average_item_level",
        // },
        // {
        //   title: "Class",
        //   dataIndex: ["character_class", "name"],
        //   render: (name, record) => {
        //     if (!name) return null;
        //     const specName = record.active_spec.name;
        //     return `${name} - ${specName}`;
        //   },
        // },
    ];

    return (
        <>
            <Title level={2}>Guild Roaster</Title>
            <p>
                Welcome to Guild Roaster! This data is for Awaken Reunited -
                Tichondrius Guild.
            </p>
            <Table
                title={() => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <h2 style={{ margin: 0 }}>
                            Awaken Reunited –{" "}
                            <span>{dataSource.length} members</span>
                        </h2>
                        <Button
                            type="primary"
                            onClick={() => setAddDialogOpen(true)}
                            style={{ marginLeft: "auto" }}
                        >
                            Set Character
                        </Button>
                        <b>As of [{now}]</b>
                    </div>
                )}
                columns={columns}
                dataSource={dataSource}
                rowKey={["character", "id"]}
                pagination={false}
                loading={loading}
                rowClassName={(record) => {
                    const classId = record.character?.playable_class?.id;
                    const cssClass = normalizeClassName(classId);
                    return `row-${cssClass}`;
                }}
            />
            <Modal
                title="Add Character to Roster"
                open={addDialogOpen}
                onCancel={() => setAddDialogOpen(false)}
                onOk={() => {
                    if (selectedChar) {
                        console.log("Character added:", selectedChar);
                        setAddDialogOpen(false);
                    }
                }}
                okButtonProps={{ disabled: !selectedChar }}
            >
                <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Search by name or class"
                    onChange={(value) => setSelectedChar(value)}
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={dataSource.map((member) => {
                        const name = member.character.name;
                        const classId = member.character.playable_class?.id;
                        const className = classMap[classId] || "Unknown";

                        return {
                            label: `${name} (${className})`,
                            value: name,
                        };
                    })}
                />
            </Modal>
        </>
    );
}
export default GuildRoasterPage;
