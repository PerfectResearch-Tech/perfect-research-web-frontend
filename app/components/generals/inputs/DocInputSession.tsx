import React from "react";

const DocInputSession = ({
  label,
  placeholder,
  value,
  handleChange,
  htmlFor,
}: {
  label: string;
  placeholder: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  htmlFor: string;
}) => {
  return (
    <div>
      <div className="flex flex-row gap-4 items-center justify-between w-full">
        <label
          htmlFor={htmlFor}
          className="w-1/3 text-sm font-medium text-gray-700 shrink-0"
        >
          {label}
        </label>
        <input
          onChange={handleChange}
          id={htmlFor}
          type="text"
          placeholder={placeholder}
          value={value}
          className="mt-1 block w-2/3 px-4 py-4 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default DocInputSession;
