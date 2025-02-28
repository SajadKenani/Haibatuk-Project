CREATE TABLE department (
	id serial4 NOT NULL,
	name_en text NOT NULL,
	name_ar text NOT NULL,
	CONSTRAINT department_pkey PRIMARY KEY (id)
);

CREATE TABLE n_sub_department (
	id serial4 NOT NULL,
	name_en text NOT NULL,
	name_ar text NOT NULL,
	sub_department_id text NULL,
	CONSTRAINT n_sub_department_pkey PRIMARY KEY (id)
);

CREATE TABLE product (
	id serial4 NOT NULL,
	image bytea NOT NULL,
	description_en text NOT NULL,
	type_en text NOT NULL,
	name_en text NOT NULL,
	description_ar text NOT NULL,
	type_ar text NOT NULL,
	brand_ar text NOT NULL,
	name_ar text NOT NULL,
	price text NULL,
	size text NOT NULL,
	brand_en text NOT NULL,
	department text NULL,
	sub_department text NULL,
	n_sub_department text NULL,
	more_images_id _text NULL,
	_more_images_id text NULL,
	CONSTRAINT product_pkey PRIMARY KEY (id)
);

CREATE TABLE product_department (
	product_id int4 NOT NULL,
	department_id int4 NOT NULL,
	CONSTRAINT product_department_pkey PRIMARY KEY (product_id, department_id)
);

CREATE TABLE product_images (
	id serial4 NOT NULL,
	image bytea NOT NULL,
	CONSTRAINT product_images_pkey PRIMARY KEY (id)
);

CREATE TABLE product_property (
	product_id int4 NOT NULL,
	property_id int4 NOT NULL,
	CONSTRAINT product_property_pkey PRIMARY KEY (product_id, property_id)
);

CREATE TABLE property (
	id serial4 NOT NULL,
	name_en text NOT NULL,
	name_ar text NOT NULL,
	CONSTRAINT property_pkey PRIMARY KEY (id)
);

CREATE TABLE sub_department (
	id serial4 NOT NULL,
	name_en text NOT NULL,
	name_ar text NOT NULL,
	department_id text NOT NULL,
	CONSTRAINT sub_department_pkey PRIMARY KEY (id)
);