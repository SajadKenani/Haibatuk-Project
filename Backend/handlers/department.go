package handlers

import (
	"Backend/db"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HanldeDepartmentInsertion(ctx *gin.Context) {
	var department Department

	err := ctx.ShouldBindJSON(&department)
	if err != nil {
		log.Print("Failed to bind with JSON")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to bind with JSON"})
		return
	}

	_, err = db.DB.Exec(`INSERT INTO department (name_en, name_ar) VALUES ($1, $2)`, 
	department.NameEn, department.NameAr)
	if err != nil {
		log.Print("Failed to insert the department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to insert the department"})
		return
	}

	ctx.JSON(http.StatusAccepted,
		gin.H{"message": "Department was successfully inserted"})

}


func HanldeDepartmentArabicFetching(ctx *gin.Context) {
	var department []Department

	err := db.DB.Select(&department, `SELECT id, name_ar FROM department`)
	if err != nil {
		log.Print("Failed to Fetch the department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to Fetch the department"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"department": department})

}

func HanldeDepartmentEnglishFetching(ctx *gin.Context) {
	var department []Department

	err := db.DB.Select(&department, `SELECT id, name_en FROM department`)
	if err != nil {
		log.Print("Failed to Fetch the department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to Fetch the department"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"department": department})

}

func HandleSubDepartmentFetchingEnglish(ctx *gin.Context) {
	var dept struct {
		DepartmentID string `json:"department_id"` 
	}

	err := ctx.ShouldBindJSON(&dept)
	if err != nil {
		log.Print("Error binding JSON: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var subDept []SubDepartment
	err = db.DB.Select(&subDept, `SELECT name_en, department_id FROM sub_department 
	WHERE department_id = $1`, dept.DepartmentID)
	if err != nil {
		log.Print("Error fetching sub-departments: ", err)
		ctx.JSON(http.StatusInternalServerError, 
			gin.H{"error": "Error fetching sub-departments"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": subDept})
}

func HandleSubDepartmentFetchingArabic(ctx *gin.Context) {
	var subDept []SubDepartment

	db.DB.Select(&subDept, `Select name_ar, department_id From sub_department`)

	ctx.JSON(http.StatusOK, gin.H{"data": subDept})
}

func HanldeSubDepartmentInsertion(ctx *gin.Context) {
	var sub_department SubDepartment

	err := ctx.ShouldBindJSON(&sub_department)
	if err != nil {
		log.Print("Failed to bind with JSON")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to bind with JSON"})
		return
	}

	_, err = db.DB.Exec(`INSERT INTO sub_department 
	(name_en, name_ar, department_id) VALUES ($1, $2, $3)`,
		sub_department.NameEn, sub_department.NameAr, sub_department.DepartmentID)
	if err != nil {
		log.Print("Failed to insert the sub_department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to insert the sub-department"})
		return
	}

	ctx.JSON(http.StatusAccepted, gin.H{"message": "Sub-department was successfully inserted"})

}

func HandleDepartmentRemove(ctx *gin.Context) {
	var department Department

	err := ctx.ShouldBindJSON(&department)
	if err != nil {
		log.Print("Failed to bind with JSON")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to bind with JSON"})
		return
	}

	_, err = db.DB.Exec(`DELETE FROM department WHERE id = $1`, department.ID)
	if err != nil {
		log.Print("Failed to delete from the department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to delete from the department"})
		return
	}

	ctx.JSON(http.StatusAccepted, gin.H{"message": "Department was deleted!"})

}

func HandleSubDepartmentRemove(ctx *gin.Context) {
	var subDept SubDepartment

	err := ctx.ShouldBindJSON(&subDept)
	if err != nil {
		log.Print("Failed to bind with JSON")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to bind with JSON"})
		return
	}

	_, err = db.DB.Exec(`DELETE FROM sub_department WHERE id = $1`, subDept.ID)
	if err != nil {
		log.Print("Failed to delete from the sub department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to delete from the sub department"})
		return
	}

	ctx.JSON(http.StatusAccepted, gin.H{"message": "Sub department was deleted!"})
}