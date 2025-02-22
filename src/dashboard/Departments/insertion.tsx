import React from "react";
import { useState } from "react";
import { POST } from "../../components/Requests";

export const INSERT_DEPT = () => {
  const [data, setData] = useState({
    name_ar: "",
    name_en: ""

  });

  const [error, setError] = useState(""); // To show error messages if any
  const [loading, setLoading] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation check for empty fields
    if (!data.name_ar || !data.name_en) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    setLoading(false)

    try {
      await POST("api/department", data)
      console.log("The department was added!");
      setData({
        name_en: "",
        name_ar: ""

      }); // Clear form fields
      setError(""); // Clear error messages

    } catch (error) {
      console.error(error);
      setError("Error when inserting a department.");
    } finally {
      setLoading(true)
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-black text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Inserting a New Department</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>} {/* Error message */}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Department Name Input */}
        <div className="flex flex-col">
          <label htmlFor="name_en" className="text-lg font-medium mb-2 text-white">Department Name (English)</label>
          <input
            type="text"
            id="name_en"
            name="name_en"
            value={data.name_en}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 border-gray-700 text-white"
            placeholder="Insert the department name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="name_ar" className="text-lg font-medium mb-2 text-white">Department Name (Arabic) </label>
          <input
            type="text"
            id="name_ar"
            name="name_ar"
            value={data.name_ar}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-800 border-gray-700 text-white"
            placeholder="Insert the department name"
            required
          />
        </div>


        {/* Submit Button */}
        <div className="w-full">
          {loading ? 
            <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
          :
          <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md transition-all"
          disabled
        >
          Submitting...
        </button>
        }
        
        </div>
      </form>
    </div>
  );
};
