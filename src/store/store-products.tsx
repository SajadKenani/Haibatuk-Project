import React, { useCallback, useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu,


} from 'lucide-react';
import { GET } from '../components/Requests';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar'; 
import { useSelector } from 'react-redux';
import { RootState } from '../website/store';

interface ProductData {
  id: number;
  name: string;
  description: string;
  department: string;
  image: string;
  price: string;
}


export const STORE: React.FC = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductData[]>([]);
 
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const lang = useSelector((state: RootState) => state.language);
 



  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsResponse] = await Promise.all([
        GET(`api/product-${lang === "english" ? "en" : "ar"}`),
    
      ]);

      setData(productsResponse.data);
      setFilteredData(productsResponse.data);

    } catch (error) {
      toast.error("Failed to load store data");
    } finally {
      setLoading(false);
    }
  }, []) 

  useEffect(() => {
    fetchData();
  }, [lang]);

  const decodeImage = (image: string) => {
    try {
      return decodeURIComponent(image);
    } catch {
      return image;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col lg:flex-row">
      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow sticky top-0 z-30">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">{lang === "english" ? "Store" : "المتجر"}</h1>
        <div className="relative">
          <Search size={20} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder={lang === "english" ? "Search" : "بحث"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-2 py-1 border rounded-lg w-36 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <Sidebar data={data} />

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {lang === "arabic" ? "منتجاتنا" : "Our Products"}
            </h1>
            <p className="text-gray-600">
              {lang === "arabic" 
                ? `${data.length} اضهار ${filteredData.length} من اصل`
                : `Showing ${filteredData.length} of ${data.length} products`}
            </p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder={lang === "english" ? "Search products..." : "البحث عن المنتجات"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-blue-200 rounded-full w-72 focus:ring-2 focus:ring-blue-500 transition"
            />
            <Search className="absolute left-3 top-4 text-blue-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {lang === "arabic" ? "لا يوجد منتجات" : "No products found"}
            </h3>
            <p className="text-gray-500">
              {lang === "arabic" ? "جرب تغيير اعدادات الفلترة" : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {filteredData.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
              >
                {product.image && (
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden group">
                    <img
                      src={`data:image/png;base64,${decodeImage(product.image)}`}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>
                )}
                <div className="p-4 lg:p-6 space-y-2 lg:space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-800">{product.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm lg:text-base line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {product.department}
                    </span>
                    <button 
                      className="bg-blue-600 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-full hover:bg-blue-700 transition flex items-center text-xs lg:text-sm"
                      onClick={() => {
                        localStorage.setItem("productId", product.id.toString());
                        navigate('/store/details');
                      }}
                    >
                      <ShoppingCart size={16} className="mr-1 lg:mr-2" />
                      {lang === "arabic" ? "عرض التفاصيل" : "Details"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default STORE;