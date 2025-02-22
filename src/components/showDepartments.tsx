import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Department {
  name: string;
  subDepartments: string[];
}

const departments: Department[] = [
  {
    name: 'Paper products',
    subDepartments: ['Elderly diapers', 'Baby diapers', 'Feminine pads', 'Tissue paper']
  },
  {
    name: 'Cleaning Products',
    subDepartments: ['']
  },
  {
    name: 'Perfume and Air Freshener Products',
    subDepartments: ['']
  },
  
];

export const DepartmentNavigator: React.FC = () => {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const navigation = useNavigate()
  const toggleDepartment = (deptName: string): void => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };


  return (
    <div className=" inset-4 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col pt-32 pb-32">
      <div className="bg-gray-50 p-4 border-b flex items-center">
        <button 
          onClick={() => navigation("/")}
          className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Department Directory</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {departments.map((dept) => (
            <div key={dept.name} className="rounded-lg border border-gray-200">
              <button
                onClick={() => toggleDepartment(dept.name)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">{dept.name}</span>
                {expandedDepts.has(dept.name) ? 
                  <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                }
              </button>
              
              {expandedDepts.has(dept.name) && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {dept.subDepartments.map((subDept) => (
                    <button
                      key={subDept}
                      className="w-full text-left p-3 pl-8 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {subDept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
