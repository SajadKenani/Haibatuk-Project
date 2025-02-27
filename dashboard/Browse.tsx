import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELETE, GET, POST } from "../components/Requests";
import { Trash2, Eye, Tag, Box, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { ProductData } from "../types";

export const BROWSE = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const nav = useNavigate();

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await GET("api/product-en");
      setData(response.data);
      console.log(response.data)
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const decodeImage = (image: string): string => {
    try {
      return decodeURIComponent(image);
    } catch {
      return image;
    }
  };

  const handleProductDeletion = async (id: number) => {
    setDeletingId(id);
    try {
      await DELETE("api/product", { id });
      toast.success("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectionProcess = useCallback(async (id: number) => {
    try {
      await POST("api/selected_products", { id })
      toast.success("Product selected successfully");
      await fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12">
          <Layers className="mr-4 text-blue-400" size={40} />
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Product Catalog
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {data && data.length > 0 ? (
                data.sort((a, b) => a.id - b.id).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl group"
                  >
                    <div className="relative">
                      {item.image && (
                        <img
                          src={`data:image/png;base64,${decodeImage(item.image)}`}
                          alt={item.name_en}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                      <button
                        onClick={() => handleProductDeletion(item.id)}
                        disabled={deletingId === item.id}
                        className={`absolute top-4 right-4 p-2 bg-red-500 rounded-full 
                        transition-all duration-300 hover:bg-red-600 
                        ${deletingId === item.id ? 'cursor-wait opacity-50' : ''}`}
                      >
                        {deletingId === item.id ? (
                          <div className="animate-spin">
                            <Trash2 size={20} />
                          </div>
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-blue-300 truncate">
                        {item.name_en}
                      </h3>

                      <div className="flex items-center mb-4 text-gray-400">
                        <Tag className="mr-2" size={16} />
                        <span>{item.brand_en}</span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-gray-400">
                          <Box className="mr-2" size={16} />
                          <span>{item.size}</span>
                        </div>
                        <span className="text-2xl font-bold text-green-400">
                          ${item.price}
                        </span>
                      </div>

                      <div className="flex gap-2">
                      <button
                        onClick={() => {
                          localStorage.setItem("productId", String(item.id));
                          nav("details");
                        }}
                        className="w-full flex items-center justify-center 
                        bg-blue-600 text-white py-3 rounded-lg 
                        hover:bg-blue-700 transition-colors duration-300"
                      >
                        <Eye className="mr-2" size={20} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleSelectionProcess(item.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300
                      ${item.is_selected ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-black hover:bg-gray-400"}`}
                      >
                        {item.is_selected ? "✅" : "❌"}
                      </button>
                      </div>

                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-16">
                  No products available
                </div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};