import React, { useState } from "react";
import "./table.css";

interface DataTableProps {
  columns: { key: string; label: string; sortable?: boolean }[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, renderRow }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter((row) =>
      columns.some((column) =>
        String(row[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm, columns]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="data-table">
      <div className="search-bar mb-8 relative flex flex-row justify-between">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />

        {/* Select sans data-hs-select et visible */}
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="mb-4 relative py-2 px-3 w-32 cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          data-hs-datatable-page-entities=""
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && requestSort(column.key)}
                className={column.sortable ? "sortable" : ""}
              >
                {column.label}
                {sortConfig && sortConfig.key === column.key && (
                  <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>{renderRow(item)}</tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default DataTable;
