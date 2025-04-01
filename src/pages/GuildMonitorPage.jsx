import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";

const { Title } = Typography;

const characterPool = ["givemebamboo-tichondrius", "angrybites-tichondrius"];

const API_CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID;
const API_CLIENT_SECRET = import.meta.env.VITE_API_CLIENT_SECRET;
const API_TOKEN = import.meta.env.VITE_API_TOKEN; //Needs to be replaced later

function GuildMonitorPage() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [name, server] = characterPool[0].split("-");
      const url = `https://us.api.blizzard.com/profile/wow/character/${server}/${name}?namespace=profile-us&locale=en_US`;
      const response = await fetch(url, {
        headers: new Headers({
          Authorization: `Bearer ${API_TOKEN}`,
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setDataSource([json]);
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: "Character Name",
      dataIndex: "name",
    },
    {
      title: "Server",
      dataIndex: ["realm", "name"],
    },
    {
      title: "Item Level",
      dataIndex: "average_item_level",
    },
    {
      title: "Faction",
      dataIndex: ["faction", "name"],
    },
  ];

  return (
    <div>
      <Title level={2}>Guild Monitor</Title>
      <p>Welcome to Guild Monitor! This data is for Awaken Reunited - Tichondrius Guild.</p>
      <Table title={() => "Awaken Reunited"} columns={columns} dataSource={dataSource} rowKey={"id"} />
    </div>
  );
}
export default GuildMonitorPage;
