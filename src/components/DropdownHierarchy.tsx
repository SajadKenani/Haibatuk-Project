import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../website/store";
import { AllDepartments, ActiveFilters } from "../types";

interface DropdownHierarchyProps {
  allDepartments: AllDepartments[];
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

export const DropdownHierarchy: React.FC<DropdownHierarchyProps> = ({
    allDepartments,
    activeFilters,
    setActiveFilters,
    setIsMobileSidebarOpen,
  }) => {
    const [openDepartments, setOpenDepartments] = useState<{ [key: string]: boolean }>({});
     const lang = localStorage.getItem("lang") ?
      localStorage.getItem("lang")
       : useSelector((state: RootState) => state.language)

    const dropdown = useSelector((state: RootState) => state.dropdown);
    const data = useSelector((state: RootState) => state.data)
    // Function to toggle visibility of departments
    const toggleVisibility = (id: string) => {
      // Ensure the visibility state is updated based on the previous state
      setOpenDepartments((prevState) => ({
        ...prevState,
        [id]: !prevState[id], // Toggle the current state of the given department
      }));
    };
  
    // Handle department selection for active filters
    const handleDepartmentSelection = (level: 'main' | 'sub' | 'nested', name: string) => {
      setActiveFilters((prev) => {
        const newFilters: ActiveFilters = {};
        
        if (level === 'main') {
          newFilters.mainDepartment = name;
        } else if (level === 'sub') {
          newFilters.subDepartment = name;
        } else {
          newFilters.nestedDepartment = name;
        }
        
        return { ...newFilters, sort: prev.sort };
      });
      setIsMobileSidebarOpen(dropdown);

      localStorage.removeItem("selectedDepartment")
  
    };
  
    // Log updated state of openDepartments for debugging
    useEffect(() => {
   
      console.log('Updated openDepartments state:', openDepartments);
    }, [openDepartments]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (allDepartments?.length > 0) {
          if (localStorage.getItem("selectedDepartment")){
          handleDepartmentSelection('main', String(localStorage.getItem("selectedDepartment")))
        }
        }
      }, 100); 
    
      return () => clearTimeout(timeout); 
    }, [data]);
    
  
    return (
      <div className="space-y-4">
        {allDepartments?.map((dept) => (
          <div key={dept.name_en} className="space-y-2">
            {/* Department Button */}
            <button
              onClick={() => {
                handleDepartmentSelection('main', lang === 'english' ? dept.name_en : dept.name_ar);
                toggleVisibility((lang === "english" ? dept.name_en : dept.name_ar).toString()); // Toggle visibility for department
              }}
              className={`flex items-center justify-between w-full p-2 text-left rounded-lg transition
                ${activeFilters.mainDepartment === (lang === 'english' ? dept.name_en : dept.name_ar)
                  ? 'bg-teal-50 text-teal-700'
                  : 'hover:bg-gray-50'}`}
            >
              <span className="font-medium">
                {lang === 'english' ? dept.name_en : dept.name_ar}
              </span>
              {/* Chevron Icon */}
              {openDepartments[(lang === "english" ? dept.name_en : dept.name_ar).toString()] ? 
              <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
  
            {/* Sub-department dropdown, only visible if the department is expanded */}
            {openDepartments[(lang === "english" ? dept.name_en : dept.name_ar).toString()] && 
            dept.sub_departments?.map((subDept) => (
              <div key={lang === "english" ? subDept.name_en : subDept.name_ar} className="ml-4 space-y-2">
                {/* Sub-department Button */}
                <button
                  onClick={() => {
                    handleDepartmentSelection('sub', lang === 'english' ? subDept.name_en : subDept.name_ar);
                    toggleVisibility((lang === "english" ? subDept.name_en : subDept.name_ar).toString()); // Toggle visibility for sub-department
                  }}
                  className={`flex items-center justify-between w-full p-2 text-left rounded-lg transition
                    ${activeFilters.subDepartment === (lang === 'english' ? subDept.name_en : subDept.name_ar)
                      ? 'bg-teal-50 text-teal-700'
                      : 'hover:bg-gray-50'}`}
                >
                  <span className="font-medium">
                    {lang === 'english' ? subDept.name_en : subDept.name_ar}
                  </span>
                  {/* Chevron Icon for sub-department */}
                  {openDepartments[(lang === "english" ? subDept.name_en : subDept.name_ar).toString()] ? 
                  <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
  
                {/* Nested sub-department dropdown, only visible if the sub-department is expanded */}
                {openDepartments[(lang === "english" ? subDept.name_en : subDept.name_ar).toString()] && 
                subDept.nested_sub_departments?.map((nestedDept) => (
                  <button
                    key={nestedDept.name_en}
                    onClick={() => {
                      handleDepartmentSelection('nested', lang === 'english' ? nestedDept.name_en : nestedDept.name_ar);
                      // toggleVisibility((lang === "english" ? subDept.name_en : subDept.name_ar).toString()); 
                    }}
                    className={`ml-4 w-full p-2 text-left rounded-lg transition
                      ${activeFilters.nestedDepartment === (lang === 'english' ? nestedDept.name_en : nestedDept.name_ar)
                        ? 'bg-teal-50 text-teal-700'
                        : 'hover:bg-gray-50'}`}
                  >
                    {lang === 'english' ? nestedDept.name_en : nestedDept.name_ar}
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
       
      </div>
    );
  };
  