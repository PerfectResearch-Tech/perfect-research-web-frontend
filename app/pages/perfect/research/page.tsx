"use client";
import Loading from "@/app/components/Loading/Loading";
import MainSession from "@/app/components/perfect/main/research/MainSession";
import SideBar from "@/app/components/perfect/sider/research/SideBar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [data, setData] = useState([]);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/pages/authentication/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const handlerCurrentData = (data: any) => {
    setData(data);
    console.log(data);
  };

  return (
    <div className=" research-page bg-custom bg-[url('/file2.svg')]">
      <div className="research-page-all-items md:p-16">
        <div className="flex flex-col md:flex-row p-4 sm:p-8 min-h-screen bg-white">
          <SideBar handlerCurrentData={handlerCurrentData} />
          <div className="main flex-1 p-4 sm:p-6">
            <MainSession data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
