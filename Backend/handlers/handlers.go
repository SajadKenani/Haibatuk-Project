package handlers

type Product struct {
	ID            int    `json:"id,omitempty" db:"id,omitempty"`
	Price         string `json:"price" db:"price"`
	Size          string `json:"size" db:"size"`
	Image         string `json:"image" db:"image"`
	NameEn        string `json:"name_en" db:"name_en"`
	BrandEn       string `json:"brand_en" db:"brand_en"`
	TypeEn        string `json:"type_en" db:"type_en"`
	DescriptionEn string `json:"description_en" db:"description_en"`
	NameAr        string `json:"name_ar" db:"name_ar"`
	BrandAr       string `json:"brand_ar" db:"brand_ar"`
	TypeAr        string `json:"type_ar" db:"type_ar"`
	DescriptionAr string `json:"description_ar" db:"description_ar"`
}

type Department struct {
	ID     int    `json:"id,omitempty" db:"id,omitempty"`
	NameEn string `json:"name_en" db:"name_en"`
	NameAr string `json:"name_ar" db:"name_ar"`
}

type SubDepartment struct {
	ID           int    `json:"id,omitempty" db:"id,omitempty"`
	NameEn       string `json:"name_en" db:"name_en"`
	NameAr       string `json:"name_ar" db:"name_ar"`
	DepartmentID string `json:"department_id" db:"department_id"`
}

type Submit struct {
	Name string `json:"name" db:"name"`
	Email string `json:"email" db:"email"`
	Message string `json:"message" db:"message"`
}