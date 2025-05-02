package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/graph"
	"github.com/hotbrainy/go-betting/backend/graph/directives"
	"github.com/hotbrainy/go-betting/backend/graph/generated"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
)

func GraphqlHandler() gin.HandlerFunc {
	h := handler.New(generated.NewExecutableSchema(generated.Config{
		Resolvers: &graph.Resolver{},
		Directives: generated.DirectiveRoot{
			HasRole: directives.HasRole,
			Auth:    directives.Auth,
		}}))

	h.AddTransport(transport.SSE{})
	h.AddTransport(transport.Options{})
	h.AddTransport(transport.GET{})
	h.AddTransport(transport.POST{})
	h.AddTransport(transport.MultipartForm{})
	h.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	})
	h.Use(extension.Introspection{})

	srv := graph.NewServerWithLoaders(initializers.DB, h)
	// h.SetQueryCache(lru.New[*ast.QueryDocument](1000))
	// h.Use(extension.AutomaticPersistedQuery{
	// 	Cache: lru.New[string](100),
	// })
	return func(c *gin.Context) {
		authUser, err := helpers.GetGinAuthUser(c)
		if err == nil {
			fmt.Println("❤️  GQL Auth Passed!")
		}
		ctx := context.WithValue(c.Request.Context(), "authUser", authUser)
		c.Request = c.Request.WithContext(ctx)
		srv.ServeHTTP(c.Writer, c.Request)
	}
}

func PlaygroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL Playground", "/api/v1/graphql")
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}
