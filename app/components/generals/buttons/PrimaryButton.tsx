"use client";
import React from "react";


interface PrimaryButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Acceptation de l'événement
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onClick }) => {
  return (
    <button className="btn btn-primary w-full" onClick={onClick}>
      {text}
    </button>
  );
};

export default PrimaryButton;
