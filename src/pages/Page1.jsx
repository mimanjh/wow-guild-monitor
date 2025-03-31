import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

function Page1() {
  return (
    <div>
      <Title level={2}>Page 1</Title>
      <p>Welcome to Page 1! This is the first page content.</p>
    </div>
  );
}
export default Page1;
