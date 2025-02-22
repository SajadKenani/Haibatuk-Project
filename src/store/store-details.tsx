import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../website/store";
import { ChevronLeft, Phone, Mail, Building } from "lucide-react";

interface ProductData {
    id: number;
    name_en: string;
    description_en: string;
    type_en: string;
    brand_en: string;
    name_ar: string;
    description_ar: string;
    type_ar: string;
    brand_ar: string;
    image: string;
    price: string;
    size: string;
    department: string;
    subDepartment: string;
}

export const DETAILS = () => {
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const lang = useSelector((state: RootState) => state.language);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16"></div>
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
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 p-6 pt-14 pb-20">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={handleBack}
                    className="mb-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                    style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isArabic ? "العودة" : "Back"}</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Product Image */}
                    <div className="bg-white p-4 shadow-lg rounded-lg transform hover:scale-[1.02] transition-transform duration-300">
                        <img
                            src={`data:image/png;base64,${decodeImage(product.image)}`}
                            alt={isArabic ? product.name_ar : product.name_en}
                            className="object-cover w-full h-96 rounded-lg"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="bg-white p-8 shadow-lg rounded-lg space-y-6">
                        <h1 className="text-3xl font-semibold text-gray-800 border-b pb-4">
                            {isArabic ? product.name_ar : product.name_en}
                        </h1>
                        
                        <p className="text-gray-600 leading-relaxed">
                            {isArabic ? product.description_ar : product.description_en}
                        </p>

                        <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <strong>{isArabic ? "العلامة التجارية" : "Brand"}:</strong>
                                <p className="mt-1">{isArabic ? product.brand_ar : product.brand_en}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <strong>{isArabic ? "النوع" : "Type"}:</strong>
                                <p className="mt-1">{isArabic ? product.type_ar : product.type_en}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <strong>{isArabic ? "الحجم" : "Size"}:</strong>
                                <p className="mt-1">{product.size}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-16 bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        {isArabic ? "معلومات الاتصال" : "Contact Information"}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-gray-400" />
                            <div>
                                <strong>{isArabic ? "الاسم" : "Name"}:</strong>
                                <p>Haibatuk Company</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <strong>{isArabic ? "البريد الإلكتروني" : "Email"}:</strong>
                                <p>info@haibatuk.com</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <strong>{isArabic ? "رقم الهاتف" : "Phone"}:</strong>
                                <div className="flex flex-col space-y-1">
                                    <a href="tel:+9647722995020" className="hover:text-blue-600 transition-colors">
                                        +964 772 299 5020
                                    </a>
                                    <a href="tel:+9647811478551" className="hover:text-blue-600 transition-colors">
                                        +964 781 147 8551
                                    </a>
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