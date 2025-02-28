package utils

import (
	"encoding/base64"
	"encoding/json"
	"reflect"
	"strconv"

	"Backend/db"
	"Backend/handlers"

	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func handleError(ctx *gin.Context, err error, message string) {
	if err != nil {
		log.Print(message, err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError,
			gin.H{"error": message})
		return
	}
}

func SettingImage(image string, ctx *gin.Context) ([]byte, error) {

	// Check if the image is empty or has invalid data
	if image == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No image provided"})
		return nil, fmt.Errorf("no image provided")
	}

	// Define supported image types (you can add more if needed)
	supportedFormats := []string{"image/png", "image/jpeg", "image/gif", "image/webp"}

	// Strip out the base64 prefix (e.g., "data:image/*;base64,")
	const prefix = "data:"
	if len(image) > len(prefix) && image[:len(prefix)] == prefix {
		// Find the position of the first semicolon, which indicates the image format type
		formatEnd := strings.Index(image, ";base64,")
		if formatEnd == -1 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 image format"})
			return nil, fmt.Errorf("invalid base64 image format")
		}

		// Extract the image format (e.g., "image/png")
		imageFormat := image[len(prefix):formatEnd]

		// Check if the format is supported
		isValidFormat := false
		for _, format := range supportedFormats {
			if imageFormat == format {
				isValidFormat = true
				break
			}
		}

		if !isValidFormat {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Unsupported image format: %s", imageFormat)})
			return nil, fmt.Errorf("unsupported image format: %s", imageFormat)
		}

		// Remove the base64 prefix to get the actual base64 data
		image = image[formatEnd+8:] // Skip the ";base64," part
	}

	// Decode the base64 string into binary data
	imageData, err := base64.StdEncoding.DecodeString(image)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding image"})
		log.Printf("Error decoding image: %v", err)
		return nil, fmt.Errorf("error decoding image: %v", err)
	}

	// Check if the decoded image data is empty
	if len(imageData) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Decoded image is empty"})
		return nil, fmt.Errorf("decoded image is empty")
	}

	return imageData, nil
}

func ImageProcessing(products []handlers.Product) {
	for i, product := range products {
		carImage := base64.StdEncoding.EncodeToString([]byte(product.Image))
		products[i].Image = string(carImage)
	}
}

func DeferTransaction(tx *sqlx.Tx, ctx *gin.Context, err *error) {
	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback() // Rollback on panic
			log.Printf("Transaction rolled back due to panic: %v", p)
			panic(p)
		} else if *err != nil {
			_ = tx.Rollback() // Rollback on error
			log.Printf("Transaction rolled back due to error: %v", *err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred while processing the transaction"})
		} else {
			if commitErr := tx.Commit(); commitErr != nil {
				log.Printf("Failed to commit transaction: %v", commitErr)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			} else {
				log.Println("Transaction committed successfully")
			}
		}
	}()
}

func HandleDeptsReplacement(ctx *gin.Context, products []handlers.Product, deptNameLanguage string) error {
	updatedProducts := make([]handlers.Product, len(products))
	copy(updatedProducts, products)

	for index := range updatedProducts {
		departmentName, err := HandleDeptsFetching(ctx, "department",
			updatedProducts[index].Department, deptNameLanguage)
		if err != nil {
			products[index].Department = "Deleted Department"
		}
		products[index].Department = departmentName

		subDepartmentName, err := HandleDeptsFetching(ctx, "sub_department",
			updatedProducts[index].SubDepartment, deptNameLanguage)
		if err != nil {
			products[index].SubDepartment = "Deleted Sub-Department"
		}
		products[index].SubDepartment = subDepartmentName

		nSubDepartmentName, err := HandleDeptsFetching(ctx, "n_sub_department",
			updatedProducts[index].NSubDepartment, deptNameLanguage)
		if err != nil {
			products[index].NSubDepartment = "Deleted N-Sub-Department"
		}
		products[index].NSubDepartment = nSubDepartmentName

	}

	return nil
}

func HandleDeptsFetching(ctx *gin.Context, tableName, idStr, deptNameLanguage string) (string, error) {

	if idStr == "" || idStr == "0" || tableName == "" || tableName == "0" {
		return "", nil
	}
	// Convert string ID to integer
	id, err := strconv.Atoi(idStr)
	if err != nil {
		handleError(ctx, err, "Failed to convert ID to integer")
		return "", err
	}

	// Fetch name from the database
	var name string
	query := fmt.Sprintf(`SELECT %s FROM %s WHERE id = $1`, deptNameLanguage, tableName)
	err = db.DB.Get(&name, query, id)
	if err != nil {
		return "", err
	}

	return name, nil
}

func SettingData(slice interface{}, mappings map[string]string) {
    sliceVal := reflect.ValueOf(slice)

    if sliceVal.Kind() != reflect.Ptr || sliceVal.Elem().Kind() != reflect.Slice {
        panic("Expected a pointer to a slice")
    }

    sliceElem := sliceVal.Elem()

    for i := 0; i < sliceElem.Len(); i++ {
        item := sliceElem.Index(i)

        for targetField, sourceField := range mappings {
            target := item.FieldByName(targetField)
            source := item.FieldByName(sourceField)

            // Check if fields exist and are settable
            if !target.IsValid() || !source.IsValid() || !target.CanSet() {
                continue
            }

            // Ensure types match before setting the value
            if target.Type() == source.Type() {
                target.Set(source)
            }
        }
    }
}

func InsertingMultipleImages(products handlers.Product) ([]int, error) {
	var additionalImageIDs []int
	for _, image := range products.MoreImages {
		var id int
		// Insert each additional image and get its ID
		err := db.DB.QueryRow(`INSERT INTO product_images (image) 
		VALUES ($1) RETURNING id`, image).Scan(&id)
		if err != nil {
			return nil, fmt.Errorf("error inserting image: %v", err)
		}

		log.Print("Inserted additional image ID: ", strconv.Itoa(id))
		additionalImageIDs = append(additionalImageIDs, id)
	}

	return additionalImageIDs, nil
}

func FetchImageByID(imgID int) (string, error) {
	var image string
	err := db.DB.QueryRow(`SELECT image FROM product_images WHERE id = $1`, imgID).Scan(&image)
	if err != nil {
		log.Printf("Error querying database for imgID %d: %s", imgID, err)
		return "", err
	}
	return image, nil
}

func PopulateMoreImages(products *handlers.Product) {
	var moreImagesID interface{}

	// Attempt to unmarshal the MoreImagesID JSON string
	err := json.Unmarshal([]byte(products.MoreImagesID), &moreImagesID)
	if err != nil {
		log.Printf("Error unmarshalling MoreImagesID: %s", err)
		return
	}

	// Check if moreImagesID is an array or a single value
	switch v := moreImagesID.(type) {
	case []interface{}:
		for _, imgID := range v {
			if id, ok := imgID.(float64); ok {
				image, err := FetchImageByID(int(id))
				if err == nil {
					products.MoreImages = append(products.MoreImages, image)
				}
			} else {
				log.Printf("Invalid type for image ID in array: %v", imgID)
			}
		}
	case float64:
		image, err := FetchImageByID(int(v))
		if err == nil {
			products.MoreImages = append(products.MoreImages, image)
		}
	default:
		log.Printf("Unexpected type for MoreImagesID: %T", v)
	}
}
