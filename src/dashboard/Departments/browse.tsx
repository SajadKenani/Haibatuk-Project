import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELETE, GET } from "../../components/Requests";
import { Department } from "../../types";

export const BROWSE_DEPT = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [removing, setRemoving] = useState<string | null>(null); // State for tracking department being removed
  const nav = useNavigate();

  const fetchDepartments = async () => {

    try {
      const response = await GET("api/department-en")
        setDepartments(response.department);
        setLoading(false); // Stop loading once data is fetched
      
    } catch (error) {
      console.log(error);
      setLoading(false); // Stop loading on error
    }
  };

  const hanldeRemoveDept = async (id: string) => {
    setRemoving(id); // Set the removing state for the specific department

    try {
      await DELETE("api/department", { id: id })
      console.log("Department was deleted");
      fetchDepartments(); // Refresh the department list

    } catch (error) {
      console.log(error);
    } finally {
      setRemoving(null); // Clear the removing state
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const navigate = (id: string) => {
    localStorage.setItem("deptID", String(id));
    nav("/admin/departments/sub");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 rtl dark:bg-gray-900 h-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {departments && departments.length > 0 ? (
            departments.map((item) => (
              <div
                key={item.id}
                style={{ flexDirection: "column" }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition 
                duration-300 ease-in-out p-6 dark:bg-gray-800 cursor-pointer"
              >
                <div
                  onClick={() => navigate(String(item.id))}
                  className="flex justify-center flex-col items-center"
                >
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                    {item.name_en.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-200 text-center">
                    {item.name_en}
                  </h2>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => hanldeRemoveDept(String(item.id))}
                    disabled={removing === item.id} // Disable button if this department is being removed
                    className={`mt-4 w-28 py-2 px-4 rounded-md ${removing === item.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    style={{ zIndex: 432 }}
                  >
                    {removing === item.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h3 className="text-white">No Departments</h3>
          )}
        </div>
      )}
    </div>
  );
};

