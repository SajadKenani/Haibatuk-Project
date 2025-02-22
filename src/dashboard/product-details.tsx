import { useEffect, useState } from "react";
import { GET } from "../components/Requests";
// import { InputField } from "../components/addComponents";

interface ProductData {
  id: number;
  name_en: string;
  brand_en: string;
  type_en: string;
  name_ar: string;
  brand_ar: string;
  type_ar: string;
  size: string;
  price: number;
  image: string; // Base64 string
  description_en: string;
  description_ar: string;
}

export const DETAILS = () => {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [deleting, setDeleting] = useState<boolean>(false);

  const fetchSpecifiedProduct = async () => {
    const deptID = localStorage.getItem("DepartmentID");
    if (!deptID) {
      setError("You must be logged in to view products.");
      setLoading(false);
      return;
    }

    try {
      const response = await GET(`api/specified-product/${deptID}`)
      setData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching product data.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSpecifiedProduct();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-gray-500 border-dotted rounded-full animate-spin"></div>
      </div>)
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return data ? (
    <div className="max-w-4xl mx-auto mt-12 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="grid grid-cols-1">

        {/* Form Section */}
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-white border-b pb-2">
            Edit Product
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Name (EN):</span>
              <p className="text-gray-900">{data.name_en}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Name (AR):</span>
              <p className="text-gray-900">{data.name_ar}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Brand (EN):</span>
              <p className="text-gray-900">{data.brand_en}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Brand (AR):</span>
              <p className="text-gray-900">{data.brand_ar}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Type (EN):</span>
              <p className="text-gray-900">{data.type_en}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Type (AR):</span>
              <p className="text-gray-900">{data.type_ar}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Size:</span>
              <p className="text-gray-900">{data.size}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Price:</span>
              <p className="text-gray-900">${data.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  rounded-lg shadow-lg">
            <div className="p-4 bg-white rounded-lg shadow-md flex flex-col">
              <span className="font-bold text-gray-800 text-lg mb-2">Description (English):</span>
              <p className="text-gray-700 text-base">{data.description_en}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md flex flex-col">
              <span className="font-bold text-gray-800 text-lg mb-2">Description (Arabic):</span>
              <p className="text-gray-700 text-base">{data.description_ar}</p>
            </div>
          </div>

          {/* <div className="flex justify-end space-x-4">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>

          </div> */}
        </div>
      </div>
    </div>
  ) : (
    <div>No product found</div>
  );
};


