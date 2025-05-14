package middleware

import (
	"context"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

func ExtensionMiddleware(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
	resp := next(ctx)

	if resp != nil {
		if resp.Extensions == nil {
			resp.Extensions = map[string]interface{}{}
		}

		resp.Extensions["poweredBy"] = "GraphQL by TotoClub"
		resp.Extensions["timestamp"] = time.Now().UTC().Format(time.RFC3339)
	}

	return resp
}
