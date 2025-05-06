import MainSession from "@/app/components/admin/MainSession";
import Sider from "@/app/components/admin/Sider";
import React from "react";

const page = () => {
  return (
    <div>
      {" "}
      <div className="flex min-h-screen">
        {/* <Sider /> */}
        <div className="main flex-1 p-6">{/* <MainSession /> */}</div>
      </div>
    </div>
  );
};

export default page;
