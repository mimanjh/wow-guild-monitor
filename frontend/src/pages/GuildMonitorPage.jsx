import React, { useEffect, useState } from "react";
import { Spin, Table, Typography } from "antd";
// import { generateWowApiToken, wowApiToken } from "../functions/wowApi";
import dayjs from "dayjs";
import "./GuildMonitorPage.scss";
const VITE_API_PREFIX = import.meta.env.VITE_API_PREFIX;

const { Title } = Typography;

const characterPool = [
  "givemebamboo-tichondrius",
  "angrybites-tichondrius",
  "Noahya-tichondrius",
  "Hayaks-tichondrius",
  "Lambda-tichondrius",
  "Soullpow-tichondrius",
  "Qudans-tichondrius",
  "Typhoonsflow-tichondrius",
  "Pjjcs-tichondrius",
  "Fasolla-tichondrius",
  "Jollyzirinda-tichondrius",
  "Nadacow-tichondrius",
  "Runeforging-tichondrius",
  "Armysong-tichondrius",
  "Zero-echo isles",
];
const guildName = "Awaken Reunited";

function GuildMonitorPage() {
  const [dataSource, setDataSource] = useState(new Array(characterPool.length).fill({ loading: true }));
  const now = dayjs().format("YYYY-MM-DD HH:mm");

  useEffect(() => {
    // async function fetchData() {
    //   let retryCount = 0;
    //   for (let i = 0; i < characterPool.length; i++) {
    //     try {
    //       const [name, server] = characterPool[i].split("-").map((str) => str.replace(" ", "-").toLowerCase());
    //       const url = `https://us.api.blizzard.com/profile/wow/character/${server}/${name}?namespace=profile-us&locale=en_US`;
    //       const response = await fetch(url, {
    //         headers: new Headers({
    //           Authorization: `Bearer ${wowApiToken}`,
    //         }),
    //       });
    //       if (!response.ok) {
    //         if (response.status === 401) {
    //           if (retryCount < 3) {
    //             retryCount++;
    //             await generateWowApiToken();
    //             i--;
    //             continue;
    //           } else {
    //             throw new Error(`Failed to renew and use API token`);
    //           }
    //         }
    //         throw new Error(`Response status: ${response.status} for character [${characterPool[i]}]`);
    //       }
    //       const json = await response.json();
    //       setDataSource((prev) => {
    //         const copy = [...prev];
    //         copy[i] = json;
    //         return copy;
    //       });
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // }
    async function fetchData() {
      for (let i = 0; i < characterPool.length; i++) {
        const [name, server] = characterPool[i].split("-").map((str) => str.replace(" ", "-").toLowerCase());
        fetchAndUpdateCharacterDetail(name, server, i);
      }
    }
    fetchData();
  }, []);

  async function fetchAndUpdateCharacterDetail(name, server, index) {
    try {
      const params = new URLSearchParams({ server, name });
      const url = `${VITE_API_PREFIX}/wow_api/character?${params}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status} for character [${characterPool[index]}]`);
      }
      const json = await response.json();
      setDataSource((prev) => {
        const copy = [...prev];
        copy[index] = json;
        return copy;
      });
    } catch (error) {
      console.log("Error - fetchAndUpdateCharacterDetail", error);
    }
  }

  const columns = [
    {
      title: "Character Name",
      dataIndex: "name",
      render: (text, record) => (record.loading ? <Spin spinning /> : text),
    },
    {
      title: "Realm",
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
    {
      title: "Class",
      dataIndex: ["character_class", "name"],
      render: (name, record) => {
        if (!name) return null;
        const specName = record.active_spec.name;
        return `${name} - ${specName}`;
      },
    },
  ];

  const renderSummary = (pageData) => {
    let totalIL = 0;
    pageData.forEach(({ average_item_level }) => {
      totalIL += average_item_level;
    });
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2} align="right">
            <b>Average Item Level</b>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>{(totalIL / pageData.length).toFixed(2)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };

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
        rowClassName={(record) => (record.guild?.name !== guildName ? "row-warning" : "")}
        summary={renderSummary}
      />
    </div>
  );
}
export default GuildMonitorPage;
