import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../website/store";

interface DropdownHierarchyProps {
  allDepartments: AllDepartments[];
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

interface AllDepartments {
    id: number;
    name_ar: string;
    name_en: string;
    sub_departments: SubDepartments[]
  }
  
  interface SubDepartments {
    department_id: string;
    id: number;
    name_ar: string;
    name_en: string;
    nested_sub_departments: NestedDepartments[]
  }
  
  interface NestedDepartments {
    id: number;
    name_ar: string;
    name_en: string;
  }
  
  interface NestedDepartments {
    id: number;
    name_ar: string;
    name_en: string;
  }
  
  interface DepartmentSelection {
    mainDepartment?: string;
    subDepartment?: string;
    nestedDepartment?: string;
  }

  interface ActiveFilters extends DepartmentSelection {
    sort?: string;
  }
  
export const DropdownHierarchy: React.FC<DropdownHierarchyProps> = ({
    allDepartments,
    activeFilters,
    setActiveFilters,
    setIsMobileSidebarOpen,
  }) => {
    const [openDepartments, setOpenDepartments] = useState<{ [key: string]: boolean }>({});
    const lang = useSelector((state: RootState) => state.language);
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
      setIsMobileSidebarOpen(false);
    };
  
    // Log updated state of openDepartments for debugging
    useEffect(() => {
      console.log('Updated openDepartments state:', openDepartments);
    }, [openDepartments]);
  
    return (
      <div className="space-y-4">
        {allDepartments?.map((dept) => (
          <div key={dept.id} className="space-y-2">
            {/* Department Button */}
            <button
              onClick={() => {
                handleDepartmentSelection('main', lang === 'english' ? dept.name_en : dept.name_ar);
                toggleVisibility(dept.id.toString()); // Toggle visibility for department
              }}
              className={`flex items-center justify-between w-full p-2 text-left rounded-lg transition
                ${activeFilters.mainDepartment === (lang === 'english' ? dept.name_en : dept.name_ar)
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50'}`}
            >
              <span className="font-medium">
                {lang === 'english' ? dept.name_en : dept.name_ar}
              </span>
              {/* Chevron Icon */}
              {openDepartments[dept.id.toString()] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
  
            {/* Sub-department dropdown, only visible if the department is expanded */}
            {openDepartments[dept.id.toString()] && dept.sub_departments?.map((subDept) => (
              <div key={subDept.id} className="ml-4 space-y-2">
                {/* Sub-department Button */}
                <button
                  onClick={() => {
                    handleDepartmentSelection('sub', lang === 'english' ? subDept.name_en : subDept.name_ar);
                    toggleVisibility(subDept.id.toString()); // Toggle visibility for sub-department
                  }}
                  className={`flex items-center justify-between w-full p-2 text-left rounded-lg transition
                    ${activeFilters.subDepartment === (lang === 'english' ? subDept.name_en : subDept.name_ar)
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'}`}
                >
                  <span className="font-medium">
                    {lang === 'english' ? subDept.name_en : subDept.name_ar}
                  </span>
                  {/* Chevron Icon for sub-department */}
                  {openDepartments[subDept.id.toString()] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
  
                {/* Nested sub-department dropdown, only visible if the sub-department is expanded */}
                {openDepartments[subDept.id.toString()] && subDept.nested_sub_departments?.map((nestedDept) => (
                  <button
                    key={nestedDept.id}
                    onClick={() => {
                      handleDepartmentSelection('nested', lang === 'english' ? nestedDept.name_en : nestedDept.name_ar);
                      toggleVisibility(nestedDept.id.toString()); // Toggle visibility for nested sub-department
                    }}
                    className={`ml-4 w-full p-2 text-left rounded-lg transition
                      ${activeFilters.nestedDepartment === (lang === 'english' ? nestedDept.name_en : nestedDept.name_ar)
                        ? 'bg-blue-50 text-blue-700'
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
  