import React, { useEffect, useState } from "react";
import { DELETE, POST } from "../../components/Requests";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SubDepartment } from "../../types";

export const SUB: React.FC = () => {
  const [subDepartment, setSubDepartment] = useState<SubDepartment[]>([]);
  const [deptToSend, setDeptToSend] = useState<SubDepartment>({
    id: 0,
    name_en: "",
    name_ar: "",
    department_id: localStorage.getItem("deptID") || "0",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<Number | null>(null);
  const nav = useNavigate();
  
  const fetchSubDepartment = async () => {
    try {
      const deptID = localStorage.getItem("deptID");
      const response = await POST("api/sub-department-en", { department_id: deptID });
      setSubDepartment(response.data as SubDepartment[]);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch sub-departments");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubDepartment();
  }, []);


  const sendSubDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await POST("api/sub-department", deptToSend);
      toast.success("Sub-department added successfully!");
      setDeptToSend({
        id: 0,
        name_en: "",
        name_ar: "",
        department_id: localStorage.getItem("deptID") || "0",
      });
      setShowForm(false);
      await fetchSubDepartment();
    } catch (error) {
      toast.error("Failed to add sub-department");
    } finally {
      setLoading(false);
    }
  };

  const removeSubDepartment = async (subDeptId: number) => {
    setDeletingId(subDeptId);
    try {
      await DELETE("api/sub-department", { id: subDeptId });
      toast.success("Sub-department removed successfully!");
      await fetchSubDepartment();
    } catch (error) {
      toast.error("Failed to remove sub-department");
    } finally {
      setDeletingId(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeptToSend((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubDepartmentSelection = (id: Number) => {
    localStorage.setItem("nestedDeptID", String(id));
    nav("/admin/departments/sub/nested");
  }

  return (
    <div className="relative p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sub-Departments Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white 
            rounded-full shadow-lg hover:bg-blue-600 transition duration-300 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-blue-500"></div>
          </div>
        ) : subDepartment?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {subDepartment?.map((item) => (
              <div
                key={String(item.id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 
                transition-all duration-300 hover:shadow-xl group relative cursor-pointer"
                onClick={() => handleSubDepartmentSelection(Number(item.id))}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {item.name_en}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name_ar}
                  </span>
                </div>
                
                <button
                  onClick={() => removeSubDepartment(Number(item.id))}
                  disabled={deletingId === item.id}
                  className={`
                    absolute top-2 right-2
                    w-8 h-8 
                    bg-red-500 text-white 
                    rounded-full 
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    hover:bg-red-600
                    ${deletingId === item.id ? 'cursor-wait' : ''}
                  `}
                >
                  {deletingId === item.id ? (
                    <div className="animate-spin">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  ) : (
                    "×"
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" 
              strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl text-gray-500 dark:text-gray-400">No Sub-Departments Added</p>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Add Sub-Department
              </h2>

              <form onSubmit={sendSubDepartment} className="space-y-4">
                <div>
                  <label htmlFor="name_en" className="block mb-2 text-gray-700 dark:text-gray-300">
                    English Name
                  </label>
                  <input
                    type="text"
                    id="name_en"
                    name="name_en"
                    value={deptToSend.name_en}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter English name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name_ar" className="block mb-2 text-gray-700 dark:text-gray-300">
                    Arabic Name
                  </label>
                  <input
                    type="text"
                    id="name_ar"
                    name="name_ar"
                    value={deptToSend.name_ar}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter Arabic name"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full p-3 rounded-lg text-white 
                    transition-colors duration-300
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                    }
                  `}
                >
                  {loading ? 'Submitting...' : 'Add Sub-Department'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};