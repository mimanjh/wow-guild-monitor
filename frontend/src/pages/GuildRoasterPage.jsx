import React, { useEffect, useState } from "react";
import { Spin, Table, Typography } from "antd";
// import { generateWowApiToken, wowApiToken } from "../functions/wowApi";
import dayjs from "dayjs";
import "./GuildMonitorPage.scss";
const VITE_API_PREFIX = import.meta.env.VITE_API_PREFIX;

const { Title } = Typography;

const guildName = "Awaken Reunited";
const guildServer = "Tichondrius";

function GuildRoasterPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = dayjs().format("YYYY-MM-DD HH:mm");

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
          throw new Error(`Response status: ${response.status} for guild ${guildName}`);
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
      render: (text, record) => (record.loading ? <Spin spinning /> : text),
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
    <div>
      <Title level={2}>Guild Roaster</Title>
      <p>Welcome to Guild Roaster! This data is for Awaken Reunited - Tichondrius Guild.</p>
      <Table
        title={() => (
          <div style={{ display: "flex", gap: "10px" }}>
            <h2>
              Awaken Reunited - <span>{dataSource.length} members</span>
            </h2>
            <span style={{ marginLeft: "auto" }}>
              <b>As of [{now}]</b>
            </span>
          </div>
        )}
        columns={columns}
        dataSource={dataSource}
        rowKey={["character", "id"]}
        pagination={false}
        loading={loading}
      />
    </div>
  );
}
export default GuildRoasterPage;
