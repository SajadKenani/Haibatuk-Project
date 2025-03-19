import React, { useCallback, useEffect, useState } from 'react';
import {
  ShoppingCart,
  Search,
  Menu,
  // Heart,
  // Share2,
} from 'lucide-react';
import { GET } from '../components/Requests';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../website/store';
import { setData, setFilteredData, setIsMobileSidebarOpen } from '../components/actions/action';
import Footer from './store-main';

export const STORE: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const data = useSelector((state: RootState) => state.data);
  const filteredData = useSelector((state: RootState) => state.filteredData);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") ?
  localStorage.getItem("lang")
   : useSelector((state: RootState) => state.language)
  const dropdown = useSelector((state: RootState) => state.dropdown)
  // const [isLiked, setIsLiked] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const productsResponse = await GET(`api/product-${lang === "english" ? "en" : "ar"}`);
      dispatch(setData(productsResponse.data));
      dispatch(setFilteredData(productsResponse.data));
    } catch (error) {
      toast.error("Failed to load store data");
    } finally {
      setLoading(false);
    }
  }, [lang])

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

  const filteredProducts = filteredData?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col lg:flex-row">
      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow sticky top-0 z-30">
        <button
          onClick={() => dispatch(setIsMobileSidebarOpen(true))}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">{lang === "english" ? "Our Products" : "منتجاتنا"}</h1>
        <div className="relative">
          <Search size={20} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={lang === "english" ? "Search" : "بحث"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-2 py-1 border rounded-lg w-36 focus:ring-2 
            focus:ring-[#39B6BD] focus:border-[#39B6BD]"
          />
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar placed as a column on small screens, row on medium and up */}
          <div className="w-full md:w-1/5">
            <Sidebar data={data} />
          </div>

          {/* Main content area */}
          <div className="w-full md:w-4/5">
          <div className="hidden lg:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              {lang === "arabic" ? "منتجاتنا" : "Our Products"}
            </h1>
            <p className="text-gray-600">
              {lang === "arabic" 
                ? `${data?.length} اضهار ${filteredProducts?.length} من اصل`
                : `Showing ${filteredProducts?.length} of ${data?.length} products`}
            </p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder={lang === "english" ? "Search products..." : "البحث عن المنتجات"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-[#39B6BD] rounded-full w-72 focus:ring-2 
              focus:ring-[#39B6BD] transition "
            />
            <Search className="absolute left-3 top-4 text-[#39B6BD]" />
          </div>
        </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-[#39B6BD] border-t-transparent 
                rounded-full animate-spin" />
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <Search size={48} className="mx-auto text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {lang === "arabic" ? "لا يوجد منتجات" : "No products found"}
                </h3>
                <p className="text-gray-500">
                  {lang === "arabic" ? "جرب تغيير اعدادات الفلترة" : 
                  "Try adjusting your search or filters"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
              gap-4 lg:gap-6 mb-10">
                
                {filteredProducts && filteredProducts.length && filteredProducts.map((product) => (
                  <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl 
                  transition-all 
                    duration-300 overflow-hidden" key={product.id}>
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={`data:image/png;base64,${decodeImage(product.image)}`}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 
                        transition-transform duration-700"
                      />

                      {/* Floating Action Buttons */}
                      {/* <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 
                      group-hover:opacity-100
                       transition-opacity duration-300">
                        <button
                          onClick={() => setIsLiked(!isLiked)}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 
                          transition-colors"
                        >
                          <Heart
                            size={20}
                            className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                          />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 
                        transition-colors">
                          <Share2 size={20} className="text-gray-600" />
                        </button>
                      </div> */}

                      {/* Category Tags Overlay */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                        {product.department && (
                          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs
                           rounded-full">
                            {product.department}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-4 space-y-4">
                      {/* Title and Description */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Tags Container */}
                      <div className="flex flex-wrap gap-2">

                        {product.sub_department && (
                          <span className="px-2 py-1 bg-[#39B6BD] text-white text-xs rounded-lg">
                            {product.sub_department}
                          </span>
                        )}
                        {product.nested_department && (
                          <span className="px-2 py-1 bg-purple text-purple-700 text-xs rounded-lg">
                            {product.nested_department}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          localStorage.setItem("productId", product.id.toString());
                          navigate('/store/details');
                        }}
                        className="w-full bg-[#39B6BD] hover:bg-[#39B6BD] text-white py-2 px-4 rounded-lg 
                    transition-colors duration-300 flex items-center justify-center gap-2 group"
                      >
                        <ShoppingCart
                          size={18}
                          className="transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="font-medium">
                          {lang === "arabic" ? "عرض التفاصيل" : "View Details"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
             <Footer />
          </div>
        </div>
        
      </div>
     
      {dropdown && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default STORE;
