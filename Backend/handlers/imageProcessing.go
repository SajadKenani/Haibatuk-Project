package handlers

import (
	"encoding/base64"

	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func settingImage(image string, ctx *gin.Context) ([]byte, error) {
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
			ctx.JSON(http.StatusBadRequest, gin.H{"error": 
			fmt.Sprintf("Unsupported image format: %s", imageFormat)})
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


func imageProcessing(products []Product) {

	for i, product := range products {
		
		carImage := base64.StdEncoding.EncodeToString([]byte(product.Image))
		products[i].Image = string(carImage)
	}
}