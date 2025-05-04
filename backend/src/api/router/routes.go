package router

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/api/router/v1"
)

func GetAPIRoute(r *gin.Engine) {
	apiV1Router := r.Group("/api/v1")
	{
		router.GetV1Route(apiV1Router)
	}

	// Setup Reverse Proxy to Next.js frontend
	frontendURL, _ := url.Parse("http://frontend:3000")
	proxy := httputil.NewSingleHostReverseProxy(frontendURL)

	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/api/v1/") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API route not found"})
		} else {
			proxy.ServeHTTP(c.Writer, c.Request)
		}
	})
}
