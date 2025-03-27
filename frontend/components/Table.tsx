import React, { useEffect, useState } from "react";

// Mock data structure - replace with your API data
type ColumnType = {
    id: string;
    header: string;
    accessor: string;
};

type DataItemType = {
    [key: string]: string | number | Date;
};

interface TableProps {
    title?: string;
    apiUrl?: string;
}

const Table: React.FC<TableProps> = ({ title = "Data Table", apiUrl }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DataItemType[]>([]);
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                // For demo purposes, using setTimeout to simulate API call
                // Replace with actual API call to fetch data
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Mock data - replace with your API response
                const mockColumns = [
                    { id: "col1", header: "Name", accessor: "name" },
                    { id: "col2", header: "Email", accessor: "email" },
                    { id: "col3", header: "Date", accessor: "date" },
                    { id: "col4", header: "Status", accessor: "status" },
                ];

                const mockData = [
                    {
                        name: "John Doe",
                        email: "john@example.com",
                        date: "2023-01-15",
                        status: "Active",
                    },
                    {
                        name: "Jane Smith",
                        email: "jane@example.com",
                        date: "2023-02-20",
                        status: "Pending",
                    },
                    {
                        name: "Robert Johnson",
                        email: "robert@example.com",
                        date: "2023-03-05",
                        status: "Active",
                    },
                    {
                        name: "Emily Davis",
                        email: "emily@example.com",
                        date: "2023-04-10",
                        status: "Inactive",
                    },
                ];

                setColumns(mockColumns);
                setData(mockData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    if (error) {
        return (
            <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
            >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : data.length === 0 ? (
                <div className="text-center py-10 px-6 text-gray-500">
                    No data available
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={
                                    rowIndex % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50"
                                }
                            >
                                {columns.map((column) => (
                                    <td
                                        key={`${rowIndex}-${column.id}`}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Table;
