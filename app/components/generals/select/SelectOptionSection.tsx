import React from "react";

const SelectCountryOption = ({
  label,
  
  defaultOption,
  selectedOption,
  handleChange,
  datas,
}: {
  label: string;

  defaultOption: string;
  selectedOption: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  datas: { name: string; id: string; code: string }[];
}) => {
  return (
    <div>
      <div className="flex flex-row gap-4 items-center justify-between w-full">
        <label
          htmlFor="country-select"
          className="w-1/3 text-sm font-medium text-gray-700 shrink-0"
        >
          {label}
        </label>

        <div className="relative w-2/3">
          <select
            id="country-select"
            value={selectedOption}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-4 pr-10 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
          >
            <option value="">{defaultOption}</option>
            {datas.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </select>
          {/* Icône flèche */}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

const SelectOptionSection = ({
  label,
  defaultOption,
  selectedOption,
  handleChange,
  datas,
  optionKey,
  htmlFor,
}: {
  label: string;
  defaultOption: string;
  selectedOption: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  datas: { [key: string]: string }[];
  optionKey: string;
  htmlFor: string;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-between w-full">
      <label
        htmlFor={htmlFor}
        className="w-1/3 text-sm font-medium text-gray-700 shrink-0"
      >
        {label}
      </label>

      <div className="relative w-2/3">
        <select
          id={htmlFor}
          value={selectedOption}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-4 pr-10 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
        >
          <option value="">{defaultOption}</option>
          {datas.map((data, index) => (
            <option key={index} value={data.id}>
              {data[optionKey]}
            </option>
          ))}
        </select>
        {/* Icône flèche */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export { SelectCountryOption, SelectOptionSection };
