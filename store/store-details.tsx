import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../website/store";
import { 
  ChevronLeft, 
  Phone, 
  Mail, 
  Building, 
  Package,
  Info
} from "lucide-react";
import { ProductData } from "../types";


export const DETAILS = () => {
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
    
     const lang = localStorage.getItem("lang") ?
      localStorage.getItem("lang")
       : useSelector((state: RootState) => state.language)
    const API_URL = import.meta.env.VITE_SERVER_URL;
    const isArabic = lang === "arabic";

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
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full border-t-4 border-teal-600 w-16 h-16"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <h2 className="text-gray-500">
                    {isArabic ? "لا توجد تفاصيل المنتج." : "No product details available."}
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-50 via-indigo-50 to-purple-50 p-6 pt-14 pb-20">
            <div className="max-w-6xl mx-auto">
                {/* Navigation */}
                <nav className="flex items-center justify-between mb-8">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{isArabic ? "العودة" : "Back"}</span>
                    </button>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
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
                                    className={`cursor-pointer p-2 rounded-lg bg-white ${selectedImage === null ? 'ring-2 ring-teal-500' : ''}`}
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
                                        className={`cursor-pointer p-2 rounded-lg bg-white ${selectedImage === index ? 'ring-2 ring-teal-500' : ''}`}
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
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-3xl font-bold text-gray-800">
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
                                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                                        {product.sub_department}
                                    </span>
                                )}
                                 {product.n_sub_department && (
                                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                                        {product.n_sub_department}
                                    </span>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="mt-8 border-b">
                                <div className="flex gap-6">
                                    <button
                                        className={`pb-4 px-2 font-medium transition-colors ${
                                            activeTab === 'description'
                                                ? 'text-teal-600 border-b-2 border-teal-600'
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                        onClick={() => setActiveTab('description')}
                                    >
                                        {isArabic ? "الوصف" : "Description"}
                                    </button>
                                    <button
                                        className={`pb-4 px-2 font-medium transition-colors ${
                                            activeTab === 'specifications'
                                                ? 'text-teal-600 border-b-2 border-teal-600'
                                                : 'text-gray-600 hover:text-gray-800'
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
                                    <p className="text-gray-600 leading-relaxed">
                                        {isArabic ? product.description_ar : product.description_en}
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <strong>{isArabic ? "العلامة التجارية" : "Brand"}</strong>
                                            </div>
                                            <p>{isArabic ? product.brand_ar : product.brand_en}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Info className="w-4 h-4 text-gray-400" />
                                                <strong>{isArabic ? "النوع" : "Type"}</strong>
                                            </div>
                                            <p>{isArabic ? product.type_ar : product.type_en}</p>
                                        </div>
                                        {product.size && (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    <strong>{isArabic ? "الحجم" : "Size"}</strong>
                                                </div>
                                                <p>{product.size}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                {isArabic ? "معلومات الاتصال" : "Contact Information"}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <strong className="block mb-1">{isArabic ? "الشركة" : "Company"}</strong>
                                        <p className="text-gray-600">Haibatuk Company</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <strong className="block mb-1">{isArabic ? "البريد الإلكتروني" : "Email"}</strong>
                                        <a href="mailto:info@haibatuk.com" className="text-teal-600 hover:underline">
                                            info@haibatuk.com
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <strong className="block mb-1">{isArabic ? "رقم الهاتف" : "Phone"}</strong>
                                        <div className="space-y-1">
                                            <a href="tel:+9647722995020" className="block text-teal-600 hover:underline">
                                                +964 772 299 5020
                                            </a>
                                            <a href="tel:+9647811478551" className="block text-teal-600 hover:underline">
                                                +964 781 147 8551
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DETAILS;