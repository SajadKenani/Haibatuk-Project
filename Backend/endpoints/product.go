package endpoints

import (
	"Backend/db"
	"Backend/handlers"
	"Backend/queries"
	"Backend/utils"

	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func handleError(ctx *gin.Context, err error, message string) {
	if err != nil {
		log.Print(message, err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": message})
		return
	}
}
func HandleFetchingArabic(ctx *gin.Context) {
	var products []handlers.Product
	err := db.DB.Select(&products, queries.FetchArabicProductsQuery)
	handleError(ctx, err, "Failed to retrieve products")

	err = utils.HandleDeptsReplacement(ctx, products, "name_ar")
	handleError(ctx, err, "Failed to retrieve products")

	mappings := map[string]string{
		"Name":        "NameAr",
		"Description": "DescriptionAr",
	}
	utils.SettingData(&products, mappings)
	utils.ImageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}
func HandleFetchingEnglish(ctx *gin.Context) {
	var products []handlers.Product
	err := db.DB.Select(&products, queries.FetchEnglishProductsQuery)
	handleError(ctx, err, "Failed to retrieve airproducts")

	err = utils.HandleDeptsReplacement(ctx, products, "name_en")
	handleError(ctx, err, "Failed to retrieve products")
    
	mappings := map[string]string{
		"Name":        "NameEn",
		"Description": "DescriptionEn",
	}
	utils.SettingData(&products, mappings)
	utils.ImageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}
func HandleFetching(ctx *gin.Context) {
	var products []handlers.Product
	err := db.DB.Select(&products, queries.FetchAllProductsQuery)
	handleError(ctx, err, "Failed to retrieve products")

	err = utils.HandleDeptsReplacement(ctx, products, "name_en name_ar")
	handleError(ctx, err, "Failed to retrieve products")

	utils.ImageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}
func HandleFetchingDetails(ctx *gin.Context) {
	id := ctx.Param("id")

	var product handlers.Product
	err := db.DB.Get(&product, queries.FetchProductDetailsQuery, id)
	if err != nil {
	handleError(ctx, err, "Failed to retrieve product") 
		return
	}

	// Convert image to base64
	product.Image = base64.StdEncoding.EncodeToString([]byte(product.Image))

	// Populate additional images
	utils.PopulateMoreImages(&product)

	// Wrap product in an array for utility processing
	array := []handlers.Product{product}
	err = utils.HandleDeptsReplacement(ctx, array, "name_en")
	if err != nil {
		handleError(ctx, err, "Failed to retrieve product") 
			return
		}

	

	// Send the product array in response
	ctx.JSON(http.StatusOK, gin.H{"data": array[0]})
}
func HandleInsertion(ctx *gin.Context) {
	var product handlers.Product

	// Bind JSON data to the product struct
	if err := ctx.ShouldBindJSON(&product); err != nil {
		handleError(ctx, err, "Failed to bind product data")
		return
	}

	// Start a new transaction
	tx, err := db.DB.Beginx()
	if err != nil {
		handleError(ctx, err, "Failed to start transaction")
		return
	}

	defer func() {
		if r := recover(); r != nil {
			_ = tx.Rollback() // Rollback on panic
			panic(r)          // Re-throw the panic
		}
		// Rollback if transaction hasn't been explicitly committed
		if tx != nil {
			_ = tx.Rollback()
		}
	}()
	
	// Process the image and store it in the database
	imageData, err := utils.SettingImage(product.Image, ctx)
	if err != nil {
		handleError(ctx, err, "Failed to process the image")
		return
	}

	// Insert additional images
	additionalImageIDs, err := utils.InsertingMultipleImages(product)
	if err != nil {
		handleError(ctx, err, "Failed to insert additional images", )
		return
	}

	moreImagesJSON, _ := json.Marshal(additionalImageIDs)

	// Insert the product into the database
	_, err = tx.Exec(queries.InsertProductQuery,
		product.Price, product.Size, imageData,
		product.NameEn, product.DescriptionEn, product.BrandEn, product.TypeEn,
		product.NameAr, product.DescriptionAr, product.BrandAr, product.TypeAr,
		product.Department, product.SubDepartment, product.NSubDepartment, 
		string(moreImagesJSON),
	)
	if err != nil {
		handleError(ctx, err, "Failed to insert the product")
		return
	}

	// Mark the transaction for commit
	err = tx.Commit()
	if err != nil {
		handleError(ctx, err, "Failed to commit the transaction")
		return
	}

	// Successfully inserted the product
	ctx.JSON(http.StatusOK, gin.H{"message": "Product was successfully inserted!"})
}
func HandleDeletionProcess(ctx *gin.Context) {
	var product handlers.Product

	err := ctx.ShouldBindJSON(&product)
	handleError(ctx, err, "Failed to process the image")

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

func FetchSelectedProducts(ctx *gin.Context) {
	var products []handlers.Product

	err := db.DB.Select(&products, `SELECT id, price, size, image, name_en, description_en, brand_en,
	 type_en, name_ar, description_ar, brand_ar, type_ar, department
	  FROM product WHERE is_selected = true`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, 
			gin.H{"error": "Failed to get the data from the database"})
		return
	}

	utils.ImageProcessing(products)

	ctx.JSON(http.StatusOK, gin.H{"data": products})
}

func SettingSelectedProcess(ctx *gin.Context) {
	var product handlers.Product
	if err := ctx.ShouldBindJSON(&product); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Failed to bind JSON"})
		return
	}

	if product.ID == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Retrieve the current is_selected status (handle NULL values)
	var isSelected *bool
	err := db.DB.Get(&isSelected, "SELECT is_selected FROM product WHERE id = $1", product.ID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, 
			gin.H{"error": "Failed to get the data from the database", "details": err.Error()})
		return
	}

	// Default NULL values to false
	currentStatus := false
	if isSelected != nil {
		currentStatus = *isSelected
	}

	// Toggle the selection status
	newStatus := !currentStatus

	// Update the selection status in the database
	_, err = db.DB.Exec("UPDATE product SET is_selected = $1 WHERE id = $2", newStatus, product.ID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, 
			gin.H{"error": "Failed to update product selection", "details": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":     "Product selection status updated successfully",
		"is_selected": newStatus,
	})
}

