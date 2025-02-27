import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Properly handle localStorage with a fallback to Redux state
  const language = useSelector((state: RootState) => state.language);
  const lang = localStorage.getItem("lang") || language;
  
  const data = useSelector((state: RootState) => state.data);
  
  // Function to toggle visibility of departments
  const toggleVisibility = (id: string) => {
    setOpenDepartments((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Handle department selection for active filters - using useCallback to ensure stability
  const handleDepartmentSelection = useCallback((level: 'main' | 'sub' | 'nested', name: string, fromLocalStorage = false) => {
    // Update active filters
    setActiveFilters((prev) => {
      // Create a completely new filter object to ensure React detects the change
      const newFilters: ActiveFilters = { ...prev, sort: prev.sort };
      
      if (level === 'main') {
        newFilters.mainDepartment = name;
        // Clear sub and nested when main changes
        delete newFilters.subDepartment;
        delete newFilters.nestedDepartment;
      } else if (level === 'sub') {
        // Keep main department
        newFilters.mainDepartment = prev.mainDepartment;
        newFilters.subDepartment = name;
        // Clear nested when sub changes
        delete newFilters.nestedDepartment;
      } else {
        // Keep main and sub departments
        newFilters.mainDepartment = prev.mainDepartment;
        newFilters.subDepartment = prev.subDepartment;
        newFilters.nestedDepartment = name;
      }
      
      return newFilters;
    });
    
    // Close mobile sidebar when selection is made
    setIsMobileSidebarOpen(false);

    // Update localStorage based on level, but not if loading from localStorage
    if (!fromLocalStorage) {
      if (level === 'main') {
        localStorage.setItem("selectedDepartment", name);
      } else {
        localStorage.removeItem("selectedDepartment");
      }
    }
    
    // Optionally, dispatch an action to update filters in Redux if needed
    // This assumes you have an action creator called updateFilters
    // dispatch(updateFilters({ level, name }));
    
    // Force a re-render of data if needed via a custom action
    // dispatch({ type: 'FORCE_DATA_REFETCH' });
  }, [setActiveFilters, setIsMobileSidebarOpen]);

  // Load from localStorage only once on initial mount
  useEffect(() => {
    // Skip if we've already done the initial load
    if (initialLoadComplete) return;
    
    // Wait for departments to be available
    if (allDepartments?.length > 0) {
      const selectedDepartment = localStorage.getItem("selectedDepartment");
      
      if (selectedDepartment &&  data.length > 0) {
        // Check if the department from localStorage exists in the available departments
        const departmentExists = allDepartments.some(
          dept => (lang === 'english' ? dept.name_en : dept.name_ar) === selectedDepartment
        );
        
        if (departmentExists) {
          // Apply selection and mark as from localStorage to avoid loops
          handleDepartmentSelection('main', selectedDepartment, true);
          
          // Also open this department in the UI
          setOpenDepartments(prev => ({
            ...prev,
            [selectedDepartment]: true
          }));
          
          // Dispatch an action to force data filtering if needed
          // dispatch({ type: 'APPLY_FILTER', payload: { mainDepartment: selectedDepartment } });
          
          console.log("Applied filter from localStorage:", selectedDepartment);
        }
      }
      
      // Mark initial load as complete regardless of whether we found a department
      setInitialLoadComplete(true);
    }
  }, [data, allDepartments]);
  
  // DEBUG: Log when filters change
  useEffect(() => {
    console.log("Active filters changed:", activeFilters);
  }, [activeFilters]);
  
  // Helper function to get department name based on language
  const getDeptName = (dept: { name_en: string; name_ar: string }) => {
    return lang === 'english' ? dept.name_en : dept.name_ar;
  };

  return (
    <div className="space-y-4">
      {allDepartments?.map((dept) => {
        const deptName = getDeptName(dept);
        
        return (
          <div key={dept.name_en} className="space-y-2">
            {/* Department Button */}
            <button
              onClick={() => {
                handleDepartmentSelection('main', deptName);
                toggleVisibility(deptName);
              }}
              className={`flex items-center justify-between w-full p-2 text-left rounded-lg transition
                ${activeFilters.mainDepartment === deptName
                  ? 'bg-teal-50 text-teal-700'
                  : 'hover:bg-gray-50'}`}
            >
              <span className="font-medium">{deptName}</span>
              {/* Chevron Icon */}
              {openDepartments[deptName] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Sub-department dropdown */}
            {openDepartments[deptName] && dept.sub_departments?.map((subDept) => {
              const subDeptName = getDeptName(subDept);
              
              return (
                <div key={subDept.name_en} className="ml-4 space-y-2">
                  {/* Sub-department Button */}
                  <button
                    onClick={() => {
                      handleDepartmentSelection('sub', subDeptName);
                      toggleVisibility(subDeptName);
                    }}
                    className={`flex items-center justify-between w-full p-2 text-left rounded-lg transition
                      ${activeFilters.subDepartment === subDeptName
                        ? 'bg-teal-50 text-teal-700'
                        : 'hover:bg-gray-50'}`}
                  >
                    <span className="font-medium">{subDeptName}</span>
                    {/* Chevron Icon for sub-department */}
                    {openDepartments[subDeptName] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {/* Nested sub-department dropdown */}
                  {openDepartments[subDeptName] && subDept.nested_sub_departments?.map((nestedDept) => {
                    const nestedDeptName = getDeptName(nestedDept);
                    
                    return (
                      <button
                        key={nestedDept.name_en}
                        onClick={() => {
                          handleDepartmentSelection('nested', nestedDeptName);
                        }}
                        className={`ml-4 w-full p-2 text-left rounded-lg transition
                          ${activeFilters.nestedDepartment === nestedDeptName
                            ? 'bg-teal-50 text-teal-700'
                            : 'hover:bg-gray-50'}`}
                      >
                        {nestedDeptName}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
