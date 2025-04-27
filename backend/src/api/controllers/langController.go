package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetLang(c *gin.Context) {

	locale := c.Param("locale")
	cwd, _ := os.Getwd()
	lang, err := os.ReadFile(filepath.Join(cwd, "static", "lang", locale))
	fmt.Println(filepath.Join(cwd, "static", "lang", locale))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to read JSON file"})
		return
	}
	c.Data(http.StatusOK, "application/json", lang)
}
