package queries

const (
	FetchArabicProductsQuery  = `SELECT id, price, size, image, name_ar, description_ar, brand_ar, type_ar, department, sub_department FROM product`
	FetchEnglishProductsQuery = `SELECT id, price, size, image, name_en, description_en, brand_en, type_en, department, sub_department, is_selected FROM product`
	FetchAllProductsQuery     = `SELECT * FROM product`
	FetchProductDetailsQuery  = `SELECT price, size, image, name_en, description_en, brand_en, type_en, name_ar, description_ar, brand_ar, type_ar, department, sub_department, n_sub_department, _more_images_id FROM product WHERE id = $1`
	InsertProductQuery        = `INSERT INTO product 
	( price, size, image, name_en, description_en, brand_en, type_en, name_ar, description_ar, brand_ar, type_ar, department, sub_department, n_sub_department, _more_images_id, is_selected ) 
	VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, false )`
	DeleteProductQuery = `DELETE FROM product WHERE id = $1`
)
