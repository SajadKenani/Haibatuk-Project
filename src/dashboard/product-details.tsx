import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Package,
  Info
} from "lucide-react";
import { ProductData } from "../types";



export const DETAILS = () => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  const API_URL = import.meta.env.VITE_SERVER_URL;
  const isArabic = false;

  const fetchProductDetails = async () => {
    const token = localStorage.getItem("@storage_Key");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/specified-product/${localStorage.getItem("productId")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data.data);
        console.log(data.data)
        setSelectedImage(null); // Set to null to show main image initially
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, []);

  const decodeImage = (image: string): string => {
    try {
      return decodeURIComponent(image);
    } catch {
      return image;
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Function to get the current display image
  const getCurrentImage = () => {
    if (!product) return '';
    if (selectedImage === null) {
      return `data:image/png;base64,${decodeImage(product.image)}`;
    }
    return `${decodeImage(product.more_images_id?.[selectedImage] ?? '')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <h2 className="text-gray-200">
          {isArabic ? "لا توجد تفاصيل المنتج." : "No product details available."}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-1000 via-indigo-800 to-purple-900 p-6 pt-14 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
            style={{ direction: isArabic ? 'rtl' : 'ltr' }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-gray-200">{isArabic ? "العودة" : "Back"}</span>
          </button>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
              <img
                src={getCurrentImage()}
                alt={isArabic ? product.name_ar : product.name_en}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.more_images_id && product.more_images_id.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                <div
                  className={`cursor-pointer p-2 rounded-lg bg-gray-800 ${selectedImage === null ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedImage(null)}
                >
                  <img
                    src={`data:image/png;base64,${decodeImage(product.image)}`}
                    alt="thumbnail"
                    className="w-full h-16 object-cover rounded"
                  />
                </div>
                {product.more_images_id.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer p-2 rounded-lg bg-gray-800 ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={decodeImage(image)}
                      alt={`thumbnail-${index}`}
                      className="w-full h-16 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-200">
                  {isArabic ? product.name_ar : product.name_en}
                </h1>
              </div>

              {/* Department Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.department && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    {product.department}
                  </span>
                )}
                {product.sub_department && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {product.sub_department}
                  </span>
                )}
                  {product.n_sub_department && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                    {product.n_sub_department}
                  </span>
                )}
              </div>

              {/* Tabs */}
              <div className="mt-8 border-b border-gray-700">
                <div className="flex gap-6">
                  <button
                    className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'description'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-400 hover:text-gray-200'
                      }`}
                    onClick={() => setActiveTab('description')}
                  >
                    {isArabic ? "الوصف" : "Description"}
                  </button>
                  <button
                    className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'specifications'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-400 hover:text-gray-200'
                      }`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    {isArabic ? "المواصفات" : "Specifications"}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'description' ? (
                  <p className="text-gray-200 leading-relaxed">
                    {isArabic ? product.description_ar : product.description_en}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-200" />
                        <strong className="text-gray-300">{isArabic ? "العلامة التجارية" : "Brand"}</strong>
                      </div>
                      <p className="text-gray-300">{isArabic ? product.brand_ar : product.brand_en}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-gray-200" />
                        <strong className="text-gray-300">{isArabic ? "النوع" : "Type"}</strong>
                      </div>
                      <p className="text-gray-300">{isArabic ? product.type_ar : product.type_en}</p>
                    </div>
                    {product.size && (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-200" />
                          <strong className="text-gray-300">{isArabic ? "الحجم" : "Size"}</strong>
                        </div>
                        <p className="text-gray-300">{product.size}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};
