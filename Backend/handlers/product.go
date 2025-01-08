package handlers

import (
	"Backend/db"
	"encoding/base64"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleFetchingArabic(ctx *gin.Context) {
	var products []Product
	err := db.DB.Select(&products,
		`SELECT name_ar, description_ar, type_ar, brand_ar, 
       image, price, size FROM product`)
	if err != nil {
		log.Print("Error getting data: ", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to retrieve products"})
		return
	}

	imageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}

func HandleFetchingEnglish(ctx *gin.Context) {
	var products []Product
	err := db.DB.Select(&products,
		`SELECT id, name_en, description_en, type_en, brand_en, 
        image, price, size FROM product`)
	if err != nil {
		log.Print("Error getting data: ", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to retrieve products"})
		return
	}

	imageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}

func HandleFetching(ctx *gin.Context) {
	var products []Product
	err := db.DB.Select(&products,
		`SELECT id, 
	name_en, description_en, type_en, brand_en,
	name_ar, description_ar, type_ar, brand_ar,
	image, size FROM product`)
	if err != nil {
		log.Print("Error getting data: ", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to retrieve products"})
		return
	}

	imageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}


func HandleFetchingDetails(ctx *gin.Context){
	id := ctx.Param("id")

	var product Product
	err := db.DB.Get(&product, `SELECT id, 
	name_en, description_en, type_en, brand_en,
	name_ar, description_ar, type_ar, brand_ar,
	image, price, size FROM product WHERE id = $1`, id)
	if err != nil {
		log.Print("Error getting data: ", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to retrieve products"})
		return
	}

	carImage := base64.StdEncoding.EncodeToString([]byte(product.Image))
	product.Image = string(carImage)

	ctx.JSON(http.StatusOK, gin.H{"data": product})
}

func HandleInsertion(ctx *gin.Context) {
	var product Product
	// Bind JSON data to the product struct
	err := ctx.ShouldBindJSON(&product)
	if err != nil {
		log.Printf("Error binding JSON: %v", err) // Log the specific error
		ctx.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Failed to bind data with JSON"})
		return
	}

	// Handling the image data
	imageData, err := settingImage(product.Image, ctx)
	if err != nil {
		log.Printf("Error with setting the image: %v", err) // Log the specific error
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to process the image"})
		return
	}

	// Insert the product into the database
	_, err = db.DB.Exec(`
    INSERT INTO product (
        price, size, image,
        name_en, description_en, brand_en, type_en,
        name_ar, description_ar, brand_ar, type_ar,
        department, sub_department
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )`,
    product.Price, product.Size, imageData,
    product.NameEn, product.DescriptionEn, product.BrandEn, product.TypeEn,
    product.NameAr, product.DescriptionAr, product.BrandAr, product.TypeAr,
    product.Department, product.SubDepartment,
)
	if err != nil {
		log.Printf("Error inserting product: %v", err) // Log the specific error
		log.Println(product)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to insert the product into the database"})
		return
	}

	// Successfully inserted the product
	ctx.JSON(http.StatusOK, gin.H{"message": "Product was successfully inserted!"})
}

func HanldeProductUpdate(ctx *gin.Context){
	var product Product

	err := ctx.ShouldBindJSON(&product)
	if err != nil {
		log.Printf("Error binding JSON: %v", err) // Log the specific error
		ctx.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Failed to bind data with JSON"})
		return
	}

	db.DB.Exec(`Update product `)

}

func HandleDeletionProcess(ctx *gin.Context) {
	var product Product

	err := ctx.ShouldBindJSON(&product)
	if err != nil {
		log.Printf("Error with deleting: %v", err) // Log the specific error
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to process the image"})
		return
	}

	_, err = db.DB.Exec("delete from product where id = $1", product.ID)
	if err != nil {
		log.Printf("Error deleting product: %v", err) // Log the specific error
		log.Println(product)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to delete the product from the database"})
		return
	}

	// Successfully inserted the product
	ctx.JSON(http.StatusOK, gin.H{"message": "Product was successfully deleted!"})
}

func SubmitContent(ctx *gin.Context) {
	var submit Submit

	err := ctx.ShouldBindJSON(&submit)
	if err != nil {
		log.Printf("Error binding JSON: %v", err) // Log the specific error
		ctx.AbortWithStatusJSON(http.StatusBadRequest,
			gin.H{"error": "Failed to bind data with JSON"})
		return
	}


	// Insert the submit into the database
	_, err = db.DB.Exec(`INSERT INTO message (name, email, message) VALUES ($1, $2, $3)`, submit.Name, submit.Email, submit.Message )

	if err != nil {
		log.Printf("Error inserting submit: %v", err) // Log the specific error
		log.Println(submit)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to insert the submit into the database"})
		return
	}

	// Successfully inserted the submit
	ctx.JSON(http.StatusOK, gin.H{"message": "submit was successfully inserted!"})

}