import { Filter, SlidersHorizontal, Tags } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DropdownHierarchy } from "./DropdownHierarchy";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../website/actions/action";
import { AppDispatch, RootState } from "../website/store";
import toast from "react-hot-toast";
import { GET } from "./Requests";

interface SortOption {
    label: string;
    value: string;
}
interface ActiveFilters extends DepartmentSelection {
    sort?: string;
}

interface DepartmentSelection {
    mainDepartment?: string;
    subDepartment?: string;
    nestedDepartment?: string;
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

interface ProductData {
    id: number;
    name: string;
    description: string;
    department: string;
    image: string;
    price: string;
  }

  interface SidebarProps {
    data: ProductData[];
}

export const Sidebar = ({ data }: SidebarProps)  => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.language);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
    const [allDepartments, setAllDepartments] = useState<AllDepartments[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<ProductData[]>([]);
    const fetchData = useCallback(async () => {
     
        try {
            const [allDepartmentsResponse] = await Promise.all([
                GET('api/all-departments')
            ]);

            setAllDepartments(allDepartmentsResponse.data);
        } catch (error) {
            toast.error("Failed to load store data");
        }
    }, [])

    useEffect(() => {
        fetchData();
    }, [lang]);


    const sortOptions: SortOption[] = [
        { label: lang === "english" ? "Latest First" : "الحديثات اولا", value: 'latest' },
        { label: lang === "english" ? "Oldest First" : "القديمات اولا", value: 'oldest' },
        { label: lang === "english" ? 'A-Z' : "من الالف الى الياء", value: 'az' },
        { label: lang === "english" ? 'Z-A' : "من الياء الى الالف", value: 'za' },
    ];

    const changeLanguage = () => {
        clearFilters();
        dispatch(setLanguage(lang === "english" ? "arabic" : "english"));
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearchTerm('');
        setIsMobileSidebarOpen(false);
    };

    const getActiveFilterDepartment = () => {
        return activeFilters.nestedDepartment || activeFilters.subDepartment || activeFilters.mainDepartment;
    };

    useEffect(() => {
        let result = [...data];
        const activeDepartment = getActiveFilterDepartment();

        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
                // ||
                // product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeDepartment) {
            result = result.filter(product => product.department === activeDepartment);
        }

        if (activeFilters.sort) {
            switch (activeFilters.sort) {
                case 'latest':
                    result.sort((a, b) => b.id - a.id);
                    break;
                case 'oldest':
                    result.sort((a, b) => a.id - b.id);
                    break;
                case 'az':
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'za':
                    result.sort((a, b) => b.name.localeCompare(a.name));
                    break;
            }
        }

        setFilteredData(result);
    }, [searchTerm, activeFilters, data]);


    return (
        <div className={`
      lg:w-80 w-full bg-white shadow-2xl p-6 space-y-6 
      lg:static fixed inset-y-0 left-0 z-40 
      transform transition-transform duration-300
      ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Filter className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                        {lang === "arabic" ? "المتجر" : "Store"}
                    </h2>
                </div>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                    {lang === "arabic" ? "حذف التغييرات" : "Clear all"}
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <SlidersHorizontal size={18} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-700">
                        {lang === "arabic" ? "ترتيب حسب" : "Sort By"}
                    </h3>
                </div>
                <select
                    value={activeFilters.sort || ''}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, sort: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">
                        {lang === "arabic" ? "اختر نوع الترتيب" : "Select sorting"}
                    </option>
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Tags size={18} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-700">
                        {lang === "arabic" ? "الاقسام" : "Departments"}
                    </h3>
                </div>
                <DropdownHierarchy
                    allDepartments={allDepartments}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                />
            </div>

            <div>
                <button
                    onClick={changeLanguage}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                >
                    {lang === "arabic" ? "تغيير اللغة الى الانجليزي" : "Change language to Arabic"}
                </button>
            </div>

            {(activeFilters.mainDepartment || activeFilters.subDepartment ||
                activeFilters.nestedDepartment || activeFilters.sort) && (
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            {lang === "arabic" ? "الفلاتر الفعالة" : "Active Filters:"}
                        </h3>
                        <div className="space-y-2">
                            {getActiveFilterDepartment() && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                    {getActiveFilterDepartment()}
                                </span>
                            )}
                            {activeFilters.sort && (
                                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full ml-2">
                                    {sortOptions.find(opt => opt.value === activeFilters.sort)?.label}
                                </span>
                            )}
                        </div>
                    </div>
                )}
        </div>
    )
};