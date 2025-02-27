import { Filter, SlidersHorizontal, Tags, ArrowLeftCircle } from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { DropdownHierarchy } from "./DropdownHierarchy";
import { useDispatch, useSelector } from "react-redux";
import {  setFilteredData, setIsMobileSidebarOpen } from "./actions/action";
import { AppDispatch, RootState } from "../website/store";
import toast from "react-hot-toast";
import { GET } from "./Requests";
import { SidebarProps, ActiveFilters, AllDepartments } from "../types";

export const Sidebar = ({ data }: SidebarProps) => {

    const dispatch: AppDispatch = useDispatch();
     const lang = localStorage.getItem("lang") ?
      localStorage.getItem("lang")
       : useSelector((state: RootState) => state.language)
    const dropdown = useSelector((state: RootState) => state.dropdown);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
    const [allDepartments, setAllDepartments] = useState<AllDepartments[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [allDepartmentsResponse] = await Promise.all([
                GET('api/all-departments')
            ]);
            setAllDepartments(allDepartmentsResponse.data);
        } catch (error) {
            toast.error("Failed to load store data");
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, lang]);

    const sortOptions = useMemo(() => [
        { label: lang === "english" ? "Latest First" : "الحديثات اولا", value: 'latest' },
        { label: lang === "english" ? "Oldest First" : "القديمات اولا", value: 'oldest' },
        { label: lang === "english" ? 'A-Z' : "من الالف الى الياء", value: 'az' },
        { label: lang === "english" ? 'Z-A' : "من الياء الى الالف", value: 'za' },
    ], [lang]);

    // const changeLanguage = useCallback(() => {
    //     clearFilters();
    //     dispatch(setLanguage(lang === "english" ? "arabic" : "english"));
    
    // }, [dispatch, lang]);

    const clearFilters = useCallback(() => {
        setActiveFilters({});
        setSearchTerm('');
        dispatch(setIsMobileSidebarOpen(true))
    }, []);

    const getActiveFilterDepartment = useCallback(() => {
        return activeFilters.nestedDepartment || activeFilters.subDepartment || activeFilters.mainDepartment;
    }, [activeFilters.nestedDepartment, activeFilters.subDepartment, activeFilters.mainDepartment]);

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];
        const activeDepartment = getActiveFilterDepartment();

        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeDepartment) {
            result = result.filter(product => 
                [product.department, product.sub_department, product.nested_department].includes(activeDepartment)
            );
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

        return result;
    }, [searchTerm, activeFilters.sort, getActiveFilterDepartment]);

    // Only dispatch when the filtered data actually changes
    useEffect(() => {
        dispatch(setFilteredData(filteredAndSortedData));
    }, [dispatch, filteredAndSortedData]);

    return (
        <div style={{position: "fixed"}} className={`
            lg:w-80 w-full bg-white shadow-2xl p-6 space-y-6 
            lg:static fixed inset-y-0 left-0 z-40 
            transform transition-transform duration-300
            overflow-y-auto max-h-screen 
            ${dropdown ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Filter style={{color: "rgb(57, 182, 189)"}} size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                        {lang === "arabic" ? "المتجر" : "Store"}
                    </h2>
                </div>
                <button
                    onClick={clearFilters}
                    className="text-sm transition"
                    style={{color: "rgb(57, 182, 189)"}}
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
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#39B6BD] focus:border-[#39B6BD]"
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
                {/* <button
                    onClick={changeLanguage}
                    className="px-4 py-2 bg-[#39B6BD] text-white font-semibold rounded-lg shadow-md 
                    focus:outline-none focus:ring-2 focus:ring-[#39B6BD] focus:ring-opacity-50 transition"
                    style={{backgroundColor: "rgb(57, 182, 189)"}}
                >
                    {lang === "arabic" ? "تغيير اللغة الى الانجليزي" : "Change language to Arabic"}
                </button> */}

                {dropdown && 
                <div className="lg:hidden flex items-center justify-start pt-3">
                <button className="bg-gradient-to-r bg-[#39B6BD] text-white font-semibold 
                py-2 px-2 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                onClick={() => {dispatch(setIsMobileSidebarOpen(false))}}>
                     <ArrowLeftCircle className="w-7 h-7" />
                </button>
                </div>
}
            </div>

            {(activeFilters.mainDepartment || activeFilters.subDepartment ||
                activeFilters.nestedDepartment || activeFilters.sort) && (
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            {lang === "arabic" ? "الفلاتر الفعالة" : "Active Filters:"}
                        </h3>
                        <div className="space-y-2">
                            {getActiveFilterDepartment() && (
                                <span className="inline-block bg-[#39B6BD] text-white text-xs px-3 py-1 rounded-full">
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
    );
};