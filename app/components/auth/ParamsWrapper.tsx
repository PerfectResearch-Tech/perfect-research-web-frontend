"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  children: (userId: string | null) => React.ReactNode;
}

const ParamsWrapper = ({ children }: Props) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  return <>{children(userId)}</>;
};

export default ParamsWrapper;
