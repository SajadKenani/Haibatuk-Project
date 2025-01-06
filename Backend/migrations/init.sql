BEGIN;

-- Product Table
CREATE TABLE public.product (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10, 2) NOT NULL, -- Use DECIMAL for precise pricing
    image BYTEA NOT NULL,
    size INT NOT NULL,

    description_en TEXT NOT NULL,
    type_en TEXT NOT NULL,
    brand_en TEXT NOT NULL,
    name_en TEXT NOT NULL,
    department_en TEXT NOT NULL,
    sub_department_en TEXT NOT NULL,
    

    description_ar TEXT NOT NULL,
    type_ar TEXT NOT NULL,
    brand_ar TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    department_ar TEXT NOT NULL,
    sub_department_ar TEXT NOT NULL
    
);

-- Department Table
CREATE TABLE public.department (
    id SERIAL PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
);

-- Sub-Department Table
CREATE TABLE public.sub_department (
    id SERIAL PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
    department_id INT NOT NULL REFERENCES public.department(id) ON DELETE CASCADE -- Sub-department belongs to a department
);

-- Property Table
CREATE TABLE public.property (
    id SERIAL PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
);

-- Product-Property Relationship (Many-to-Many)
CREATE TABLE public.product_property (
    product_id INT NOT NULL REFERENCES public.product(id) ON DELETE CASCADE,
    property_id INT NOT NULL REFERENCES public.property(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, property_id)
);

-- Product-Department Relationship (Many-to-Many)
CREATE TABLE public.product_department (
    product_id INT NOT NULL REFERENCES public.product(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES public.department(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, department_id)
);

COMMIT;

-- ALTER TABLE public.product ADD image text NULL;
