import { useEffect, useState } from "react";
import { InputField, TextArea, FileInput, SelectField } from '../components/addComponents';
import { Upload, ListPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { GET, POST } from "../components/Requests";
import React from "react";

interface Department {
  id: string;
  name_en: string;
}

interface SubDepartment {
  id: string;
  name_en: string;
}

interface NestedSubDepartment {
  id: string;
  name_en: string;
}

export const ADD: React.FC = () => {
  const [data, setData] = useState({
    name_en: "", description_en: "", type_en: "", brand_en: "",
    name_ar: "", description_ar: "", type_ar: "", brand_ar: "",
    image: "", price: "", size: "", department: "", sub_department: "",
    n_sub_department: "", more_images_id: [""],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subDept, setSubDept] = useState<SubDepartment[]>([]);
  const [nestedSubDept, setNestedSubDept] = useState<NestedSubDepartment[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [activeSection, setActiveSection] = useState<'english' | 'arabic'>('english');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (name: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleDeptChange = (name: string,
    e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = String(reader.result);
        setData(prev => ({ ...prev, image: result }));
        setImagePreview(result);
        setError("");
      };
      reader.onerror = () => {
        setError("Error reading the image.");
      };
      reader.readAsDataURL(file);
    }
  };

  const validateBase64Image = (imageData: string) => {
    const regex = /^data:image\/(png|jpg|jpeg);base64,/;
    return regex.test(imageData);
  };

  const validateForm = () => {
    if (!data.name_en || !data.name_ar) {
      setError("Product name is required in both languages");
      return false;
    }
    if (!data.description_en || !data.description_ar) {
      setError("Product description is required in both languages");
      return false;
    }
    if (!data.department) {
      setError("Please select a department");
      return false;
    }
    if (!data.image) {
      setError("Please upload a product image");
      return false;
    }
    return true;
  };

  const sendProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;
    if (!validateBase64Image(data.image)) {
      setError("Invalid image format. Please upload a valid image.");
      return;
    }

    setIsSubmitting(true);
    try {
      await POST("api/product", data);
      setSuccess("Product added successfully!");
      setData({
        name_en: "", description_en: "", type_en: "", brand_en: "",
        name_ar: "", description_ar: "", type_ar: "", brand_ar: "",
        image: "", price: "", size: "", department: "", sub_department: "",
        n_sub_department: "", more_images_id: [""],
      });
      setImagePreview("");
      setError("");

      console.log(data)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error submitting the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await GET("api/department-en");
      setDepartments(response.department);
    } catch (error) {
      setError("Error fetching departments");
    }
  };

  const fetchSubDepartments = async (departmentId: string) => {
    try {
      const response = await POST("api/sub-department-en", { department_id: departmentId });
      setSubDept(response.data);
    } catch (error) {
      setError("Error fetching sub-departments");
    }
  };

  const fetchNestedSubDepartments = async (subDepartmentId: string) => {
    try {
      const response = await POST("api/nested-sub-department-en", { sub_department_id: subDepartmentId })
      setNestedSubDept(response.data)
      console.log(response.data)
    } catch (error) { setError("Error fetching nestedsub-departments") }
  }

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageArrayPromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject("Error reading image file.");
          reader.readAsDataURL(file);
        })
    );

    Promise.all(imageArrayPromises)
      .then((images) => {
        setData((prev) => ({ ...prev, more_images_id: images }));
      })
      .catch(() => setError("Error reading one or more image files."));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <ListPlus className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4">Add New Product</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete the form below to add a new product to your inventory. All fields marked with * are required.
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-900/50 text-red-200 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 bg-green-900/50 text-green-200 p-4 rounded-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {/* Language Toggle */}
          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium ${activeSection === 'english'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              onClick={() => setActiveSection('english')}
            >
              English Details
            </button>
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium ${activeSection === 'arabic'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              onClick={() => setActiveSection('arabic')}
            >
              Arabic Details
            </button>
          </div>

          <form onSubmit={sendProduct} className="p-6 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {activeSection === 'english' ? (
                  <>
                    <InputField
                      id="name_en"
                      label="Product Name (English) *"
                      value={data.name_en}
                      placeholder="Enter product name"
                      onChange={(e) => handleInputChange("name_en", e)}
                    />
                    <TextArea
                      id="description_en"
                      label="Description (English) *"
                      value={data.description_en}
                      placeholder="Enter product description"
                      onChange={(e) => handleInputChange("description_en", e)}
                    />
                    <InputField
                      id="type_en"
                      label="Type (English)"
                      value={data.type_en}
                      placeholder="Enter product type"
                      onChange={(e) => handleInputChange("type_en", e)}
                    />
                    <InputField
                      id="brand_en"
                      label="Brand (English)"
                      value={data.brand_en}
                      placeholder="Enter brand name"
                      onChange={(e) => handleInputChange("brand_en", e)}
                    />
                  </>
                ) : (
                  <>
                    <InputField
                      id="name_ar"
                      label="Product Name (Arabic) *"
                      value={data.name_ar}
                      placeholder="أدخل اسم المنتج"
                      onChange={(e) => handleInputChange("name_ar", e)}
                    />
                    <TextArea
                      id="description_ar"
                      label="Description (Arabic) *"
                      value={data.description_ar}
                      placeholder="أدخل وصف المنتج"
                      onChange={(e) => handleInputChange("description_ar", e)}
                    />
                    <InputField
                      id="type_ar"
                      label="Type (Arabic)"
                      value={data.type_ar}
                      placeholder="أدخل نوع المنتج"
                      onChange={(e) => handleInputChange("type_ar", e)}
                    />
                    <InputField
                      id="brand_ar"
                      label="Brand (Arabic)"
                      value={data.brand_ar}
                      placeholder="أدخل اسم العلامة التجارية"
                      onChange={(e) => handleInputChange("brand_ar", e)}
                    />
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id="price"
                    label="Price"
                    type="number"
                    value={data.price}
                    placeholder="0.00"
                    onChange={(e) => handleInputChange("price", e)}
                  />
                  <InputField
                    id="size"
                    label="Size"
                    value={data.size}
                    placeholder="Enter size"
                    onChange={(e) => handleInputChange("size", e)}
                  />
                </div>

                <SelectField
                  id="department"
                  label="Department *"
                  options={departments.map((dept: Department) => ({
                    value: dept.id,
                    label: dept.name_en,
                  }))}
                  value={data.department}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    fetchSubDepartments(e.target.value);
                    handleDeptChange("department", e);
                  }}
                />

                {subDept && subDept.length > 0 && (
                  <SelectField
                    id="subDepartment"
                    label="Sub-Department"
                    options={subDept.map((item: SubDepartment) => ({
                      value: item.id,
                      label: item.name_en,
                    }))}
                    value={data.sub_department}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      fetchNestedSubDepartments(e.target.value);
                      handleDeptChange("sub_department", e)
                    }}
                  />
                )}

                {nestedSubDept && nestedSubDept.length > 0 && (
                  <SelectField
                    id="NestedSubDepartment"
                    label="Nested-Sub-Department"
                    options={nestedSubDept.map((item: NestedSubDepartment) => ({
                      value: item.id,
                      label: item.name_en,
                    }))}
                    value={data.n_sub_department}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      handleDeptChange("n_sub_department", e)
                    }}
                  />
                )}

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <FileInput
                    id="image"
                    label="Upload Product Image *"
                    onChange={handleFileChange}
                  />

                  {imagePreview && (
                    <div className="mt-4 relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white text-sm">Click upload to change image</p>
                      </div>
                    </div>
                  )}

                  {!data.more_images_id ?
                    <h1> The images were uploaded! </h1>

                    :
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-200 text-gray-300 mb-2">
                        Upload More Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-3 border border-gray-300 border-gray-600 rounded-lg 
                        shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white 
                        focus:ring-purple-500 focus:border-purple-500"
                        multiple
                        onChange={handleMultipleFilesChange}
                      />
                    </div>
                  }

                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium
                  ${isSubmitting
                    ? 'bg-blue-800 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                  transition-colors duration-200
                `}
              >
                <Upload className="h-5 w-5" />
                {isSubmitting ? "Submitting..." : "Submit Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ADD;