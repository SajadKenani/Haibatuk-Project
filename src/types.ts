// Product Interfaces
export interface ProductData {
    name: any;
    id: number;
    name_en?: string;
    description_en?: string;
    description: string;
    type_en?: string;
    brand_en?: string;
    name_ar?: string;
    description_ar?: string;
    type_ar?: string;
    brand_ar?: string;
    image: string;
    more_images_id?: string[];
    price: string;
    size?: string;
    department: string;
    sub_department?: string;
    n_sub_department?: string;
    nested_department?: string;
    is_selected?: boolean;
  }
  
  // Department Interfaces
  export interface Department {
    name: string;
    subDepartments: any;
    id: number | string;
    name_en: string;
    name_ar: string;
  }
  
  export interface SubDepartment {
    id: number;
    department_id: string;
    name_en: string;
    name_ar: string;
  }
  
  export interface NestedSubDepartment {
    id: number | string;
    sub_department_id?: string;
    name_en: string;
    name_ar: string;
  }
  
  // Department Collections
  export interface AllDepartments {
    id: number;
    name_ar: string;
    name_en: string;
    sub_departments: SubDepartments[];
  }
  
  export interface SubDepartments {
    department_id: string;
    id: number;
    name_ar: string;
    name_en: string;
    nested_sub_departments: NestedDepartments[];
  }
  
  export interface NestedDepartments {
    id: number;
    name_ar: string;
    name_en: string;
  }
  
  // Filter Interfaces
  export interface DepartmentSelection {
    mainDepartment?: string;
    subDepartment?: string;
    nestedDepartment?: string;
  }
  
  export interface ActiveFilters extends DepartmentSelection {
    sort?: string;
  }
  
  // Content Interfaces
  export interface ContentCategory {
    title: string;
    icon: string;
    description: string;
    items: string[];
  }
  
  export interface ContentHero {
    title: string;
    description: string;
  }
  
  export interface ContentButton {
    products: string;
    about: string;
  }
  
  export interface ContentAbout {
    title: string;
    description: string;
    features: { icon: string; text: string }[];
  }
  
  export interface ContentMission {
    title: string;
    description: string;
    values: { icon: string; text: string; title: string }[];
  }
  
  export interface Content {
    since: string;
    hero: ContentHero;
    buttons: ContentButton;
    products: {
      title: string;
      description: string;
      categories: ContentCategory[];
    };
    about: ContentAbout;
    mission: ContentMission;
  }
  
  // UI Component Interfaces
  export interface InputFieldProps {
    id: string;
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export interface SidebarProps {
    data: ProductData[];
    
  }
  
  // Utility Type
  export type Language = 'english' | 'arabic';