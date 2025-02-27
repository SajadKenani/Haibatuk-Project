import { useState } from "react";
import { BROWSE_DEPT } from "./browse";
import { INSERT_DEPT } from "./insertion";


export const MAIN_DEPT = () => {
  const [select, setSelect] = useState("brows");

  return (
    <div className="bg-gray-100 min-h-screen p-6 dark:bg-gray-900">
      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6 ">
        <button
          onClick={() => setSelect("brows")}
          className={`px-6 py-2 text-lg font-medium rounded-l-lg ${
            select === "brows" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-400 transition duration-300 ease-in-out`}
        >
          Browse Departments
        </button>
        <button
          onClick={() => setSelect("insert")}
          className={`px-6 py-2 text-lg font-medium rounded-r-lg ${
            select === "insert" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-400 transition duration-300 ease-in-out`}
        >
          Insert a Department
        </button>
      </div>

      {/* Conditional Rendering of Components */}
      <div className="mx-auto max-w-4xl">
        {select === "brows" ? <BROWSE_DEPT /> : <INSERT_DEPT />}
      </div>
    </div>
  );
};
