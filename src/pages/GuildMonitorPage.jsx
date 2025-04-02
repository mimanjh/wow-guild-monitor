import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { generateWowApiToken, wowApiToken } from "../functions/wowApi";
import dayjs from "dayjs";

const { Title } = Typography;

const characterPool = [
  "givemebamboo-tichondrius",
  "angrybites-tichondrius",
  "Noahya-tichondrius",
  "Hayaks-tichondrius",
  "Lambda-tichondrius",
  "Soulpoww-tichondrius",
  "Qudans-tichondrius",
  "Typhoonsflow-tichondrius",
  "Pjjcs-tichondrius",
  "Fasolla-tichondrius",
  "Jollyzirinda-tichondrius",
  "Nadacow-tichondrius",
  "Runeforging-tichondrius",
  "Armysong-tichondrius",
];

function GuildMonitorPage() {
  const [dataSource, setDataSource] = useState(new Array(characterPool.length));
  const now = dayjs().format("YYYY-MM-DD HH:mm");

  useEffect(() => {
    async function fetchData() {
      let retryCount = 0;
      for (let i = 0; i < characterPool.length; i++) {
        try {
          const [name, server] = characterPool[i].split("-").map((str) => str.toLowerCase());
          const url = `https://us.api.blizzard.com/profile/wow/character/${server}/${name}?namespace=profile-us&locale=en_US`;
          const response = await fetch(url, {
            headers: new Headers({
              Authorization: `Bearer ${wowApiToken}`,
            }),
          });
          if (!response.ok) {
            if (response.status === 401) {
              if (retryCount < 3) {
                retryCount++;
                await generateWowApiToken();
                i--;
                continue;
              } else {
                throw new Error(`Failed to renew and use API token`);
              }
            }
            throw new Error(`Response status: ${response.status} for character [${characterPool[i]}]`);
          }
          const json = await response.json();
          setDataSource((prev) => {
            const copy = [...prev];
            copy[i] = json;
            return copy;
          });
        } catch (error) {
          console.log(error);
        }
      }
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
      <Table
        title={() => (
          <div style={{ display: "flex", gap: "10px" }}>
            <h2>Awaken Reunited</h2>
            <span style={{ marginLeft: "auto" }}>
              <b>As of [{now}]</b>
            </span>
          </div>
        )}
        columns={columns}
        dataSource={dataSource}
        rowKey={"id"}
        pagination={false}
      />
    </div>
  );
}
export default GuildMonitorPage;
