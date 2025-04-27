package controllers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Upload(c *gin.Context) {

	uploadDir := "uploads/ico"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to create upload dir: %s", err.Error()))
		return
	}

	// single file
	file, err := c.FormFile("file")
	if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("File upload error: %s", err.Error()))
		return
	}
	log.Println(file.Filename)
	// Save the file to the uploads directory
	filePath := filepath.Join(uploadDir, filepath.Base(file.Filename))
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("Failed to save file: %s", err.Error()))
		return
	}

	c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
}
