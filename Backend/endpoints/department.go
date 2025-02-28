package endpoints

import (
	"Backend/db"
	"Backend/handlers"
	"Backend/utils"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleFetchAllDepartments(ctx *gin.Context) {
	var departments []handlers.Department
	var subDepartments []handlers.SubDepartment
	var nestedSubDepartments []handlers.NSubDepartment

	// Fetch departments
	err := db.DB.Select(&departments, "SELECT * FROM department")
	handleError(ctx, err, "Failed to fetch departments")

	// Fetch sub-departments
	err = db.DB.Select(&subDepartments, "SELECT * FROM sub_department")
	handleError(ctx, err, "Failed to fetch departments")

	// Fetch nested sub-departments
	err = db.DB.Select(&nestedSubDepartments, "SELECT * FROM n_sub_department")
	handleError(ctx, err, "Failed to fetch departments")

	nestedSubDeptMap := make(map[int][]handlers.NSubDepartment)
	for _, nestedSubDept := range nestedSubDepartments {
		if nestedSubDept.SubDepartmentID == "" { // Skip empty DepartmentID
			continue
		}
		subDeptID, err := strconv.Atoi(nestedSubDept.SubDepartmentID)
		if err != nil {
			handleError(ctx, err, "Failed to convert SubDepartmentID to number!")
			continue
		}
		nestedSubDeptMap[subDeptID] = append(nestedSubDeptMap[subDeptID], nestedSubDept)
	}
	
	subDeptMap := make(map[int][]handlers.SubDepartment)
	for i, subDept := range subDepartments {
		if subDept.DepartmentID == "" { // Skip empty DepartmentID
			continue
		}
		deptID, err := strconv.Atoi(subDept.DepartmentID)
		if err != nil {
			handleError(ctx, err, "Failed to convert DepartmentID to number!")
			continue
		}

		// Attach nested sub-departments to the current sub-department
		subDepartments[i].NestedSubDepartments = nestedSubDeptMap[subDept.ID]

		// Attach sub-department to the department
		subDeptMap[deptID] = append(subDeptMap[deptID], subDepartments[i])
	}

	var structuredDepartments []handlers.AllDepartments
	for _, dept := range departments {
		deptResponse := handlers.AllDepartments {
			ID:             dept.ID,
			NameEn:     dept.NameEn,
			NameAr:     dept.NameAr,
			SubDepartments: subDeptMap[dept.ID],
		}
		structuredDepartments = append(structuredDepartments, deptResponse)
	}

	// Return JSON response
	ctx.JSON(http.StatusOK, gin.H{
		"data":  structuredDepartments,
	})
}
func HanldeDepartmentInsertion(ctx *gin.Context) {
	var department handlers.Department

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
	var department []handlers.Department

	err := db.DB.Select(&department, `SELECT id, name_ar FROM department`)
	if err != nil {
		log.Print("Failed to Fetch the department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to Fetch the department"})
		return
	}

	mappings := map[string]string{
		"Name":        "NameAr",
	}
	utils.SettingData(&department, mappings)

	ctx.JSON(http.StatusOK, gin.H{"department": department})

}
func HanldeDepartmentEnglishFetching(ctx *gin.Context) {
	var department []handlers.Department

	err := db.DB.Select(&department, `SELECT id, name_en FROM department`)
	if err != nil {
		log.Print("Failed to Fetch the department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to Fetch the department"})
		return
	}

	mappings := map[string]string{
		"Name":        "NameEn",
	}
	utils.SettingData(&department, mappings)
	
	ctx.JSON(http.StatusOK, gin.H{"department": department})

}
func HandleDepartmentRemove(ctx *gin.Context) {
	var department handlers.Department

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
func HanldeSubDepartmentInsertion(ctx *gin.Context) {
	var sub_department handlers.SubDepartment
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
func HandleSubDepartmentFetchingArabic(ctx *gin.Context) {
	var dept struct {
		DepartmentID string `json:"department_id"` 
	}

	err := ctx.ShouldBindJSON(&dept)
	if err != nil {
		log.Print("Error binding JSON: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var subDept []handlers.SubDepartment
	err = db.DB.Select(&subDept, `SELECT id, name_ar, department_id FROM sub_department 
	WHERE department_id = $1`, dept.DepartmentID)
	if err != nil {
		log.Print("Error fetching sub-departments: ", err)
		ctx.JSON(http.StatusInternalServerError, 
			gin.H{"error": "Error fetching sub-departments"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": subDept})
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

	var subDept []handlers.SubDepartment
	err = db.DB.Select(&subDept, `SELECT id, name_en, department_id FROM sub_department 
	WHERE department_id = $1`, dept.DepartmentID)
	if err != nil {
		log.Print("Error fetching sub-departments: ", err)
		ctx.JSON(http.StatusInternalServerError, 
			gin.H{"error": "Error fetching sub-departments"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": subDept})
}
func HandleSubDepartmentRemove(ctx *gin.Context) {
	var subDept handlers.SubDepartment

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
func HandleNestedSubDepartmentInsertion(ctx *gin.Context) {
	var n_sub_department handlers.NSubDepartment
	err := ctx.ShouldBindJSON(&n_sub_department)
	if err != nil {
		log.Print("Failed to bind with JSON")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to bind with JSON"})
		return
	}
	_, err = db.DB.Exec(`INSERT INTO n_sub_department 
	(name_en, name_ar, sub_department_id) VALUES ($1, $2, $3)`, 
	n_sub_department.NameEn, n_sub_department.NameAr, n_sub_department.SubDepartmentID)
	if err != nil {
		log.Print("Failed to insert the sub_department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to insert the sub-department"})
		return
	}
	ctx.JSON(http.StatusAccepted, gin.H{"message": "N-Sub-department was successfully inserted"})
}
func HandleNestedSubDepartmentFetchingArabic(ctx *gin.Context) {
	var dept struct {
		SubDepartmentID string `json:"sub_department_id"` 
	}

	err := ctx.ShouldBindJSON(&dept)
	if err != nil {
		log.Print("Error binding JSON: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var nestedSubDept []handlers.NSubDepartment
	err = db.DB.Select(&nestedSubDept, 
	`SELECT id, name_ar, sub_department_id FROM n_sub_department 
	WHERE sub_department_id = $1`, dept.SubDepartmentID)
	if err != nil {
		log.Print("Error fetching sub-departments: ", err)
		ctx.JSON(http.StatusInternalServerError, 
			gin.H{"error": "Error fetching sub-departments"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": nestedSubDept})
}
func HandleNestedSubDepartmentFetchingEnglish(ctx *gin.Context) {
	var dept struct {
		SubDepartmentID string `json:"sub_department_id"` 
	}

	err := ctx.ShouldBindJSON(&dept)
	if err != nil {
		log.Print("Error binding JSON: ", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var nestedSubDept []handlers.NSubDepartment
	err = db.DB.Select(&nestedSubDept, 
	`SELECT id, name_en, sub_department_id FROM n_sub_department 
	WHERE sub_department_id = $1`, dept.SubDepartmentID)
	if err != nil {
		log.Print("Error fetching sub-departments: ", err)
		ctx.JSON(http.StatusInternalServerError, 
			gin.H{"error": "Error fetching sub-departments"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": nestedSubDept})
}
func HandleNestedSubDepartmentRemove(ctx *gin.Context) {
	var nestedSubDept handlers.NSubDepartment

	err := ctx.ShouldBindJSON(&nestedSubDept)
	if err != nil {
		log.Print("Failed to bind with JSON")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "failed to bind with JSON"})
		return
	}

	_, err = db.DB.Exec(`DELETE FROM n_sub_department WHERE id = $1`, nestedSubDept.ID)
	if err != nil {
		log.Print("Failed to delete from the nested sub department")
		ctx.JSON(http.StatusInternalServerError,
			gin.H{"error": "Failed to delete from the nested sub department"})
		return
	}

	ctx.JSON(http.StatusAccepted, gin.H{"message": "Nested sub department was deleted!"})
}