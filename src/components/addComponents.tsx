import React, { ChangeEvent } from "react";

// Define prop types for InputField component
interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = 
({ id, label, value, type = "text", placeholder, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200 text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 border-gray-600 rounded-lg 
      shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white 
      focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

// Define prop types for TextArea component
interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ id, label, value, placeholder, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200 text-gray-300 mb-2">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4} // Set number of rows for TextArea
      className="w-full p-3 border border-gray-300 border-gray-600 rounded-lg 
      shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white 
      focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

// Define prop types for FileInput component
interface FileInputProps {
  id: string;
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ id, label, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200 text-gray-300 mb-2">
      {label}
    </label>
    <input
      type="file"
      id={id}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 border-gray-600 rounded-lg 
      shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white 
      focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

// Define prop types for SelectField component
interface SelectFieldProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ id, label, options, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200 text-gray-300 mb-2">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 border-gray-600 rounded-lg shadow-sm 
      focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white focus:ring-purple-500 
      focus:border-purple-500"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

