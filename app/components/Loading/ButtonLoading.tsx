import React from "react";
import "./loading.css";

const ButtonLoading = () => {
  return (
    <div className="flex space-x-2 py-2 items-center justify-center">
      <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
      <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-150"></div>
      <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-300"></div>
    </div>
  );
};

export default ButtonLoading;
