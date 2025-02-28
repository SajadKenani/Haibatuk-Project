package handlers

type Product struct {
	ID             int      `json:"id,omitempty" db:"id,omitempty"`
	Price          string   `json:"price" db:"price"`
	Size           string   `json:"size" db:"size"`
	Image          string   `json:"image" db:"image"`
	NameEn         string   `json:"name_en" db:"name_en"`
	Name           string   `json:"name"`
	BrandEn        string   `json:"brand_en" db:"brand_en"`
	TypeEn         string   `json:"type_en" db:"type_en"`
	DescriptionEn  string   `json:"description_en" db:"description_en"`
	Description    string   `json:"description"`
	NameAr         string   `json:"name_ar" db:"name_ar"`
	BrandAr        string   `json:"brand_ar" db:"brand_ar"`
	TypeAr         string   `json:"type_ar" db:"type_ar"`
	DescriptionAr  string   `json:"description_ar" db:"description_ar"`
	Department     string   `json:"department" db:"department"`
	SubDepartment  string   `json:"sub_department" db:"sub_department"`
	NSubDepartment string   `json:"n_sub_department" db:"n_sub_department"`
	MoreImages     []string `json:"more_images_id" db:"more_images_id"`
	MoreImagesID   string   `json:"_more_images_id" db:"_more_images_id"`
	IsSelected     bool     `json:"is_selected" db:"is_selected"`
}

type AllDepartments struct {
	ID             int             `json:"id,omitempty"`
	NameEn         string          `json:"name_en,omitempty"`
	NameAr         string          `json:"name_ar,omitempty"`
	SubDepartments []SubDepartment `json:"sub_departments"`
}

type Department struct {
	ID     int    `json:"id,omitempty" db:"id,omitempty"`
	Name   string `json:"name"`
	NameEn string `json:"name_en" db:"name_en"`
	NameAr string `json:"name_ar" db:"name_ar"`
}

type SubDepartment struct {
	ID                   int              `json:"id,omitempty" db:"id,omitempty"`
	NameEn               string           `json:"name_en" db:"name_en"`
	NameAr               string           `json:"name_ar" db:"name_ar"`
	DepartmentID         string           `json:"department_id" db:"department_id"`
	NestedSubDepartments []NSubDepartment `json:"nested_sub_departments"`
}

type NSubDepartment struct {
	ID              int    `json:"id,omitempty" db:"id,omitempty"`
	NameEn          string `json:"name_en" db:"name_en"`
	NameAr          string `json:"name_ar" db:"name_ar"`
	SubDepartmentID string `json:"sub_department_id" db:"sub_department_id"`
}
