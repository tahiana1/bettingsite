package directives

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	authUser, err := helpers.GetAuthUser(ctx)
	// fmt.Println(authUser)

	if err != nil {
		return nil, &gqlerror.Error{
			Message: "❌ Authentication required",
			Extensions: map[string]interface{}{
				"code": "UNAUTHENTICATED",
			},
		}
	}
	if authUser.Userid == "admin" {
		return next(ctx)
	}
	if authUser.Status != "A" {
		return nil, &gqlerror.Error{
			Message: "❌ Disabled",
			Extensions: map[string]interface{}{
				"code": "UNAUTHENTICATED",
			},
		}
	}

	return next(ctx)
}

func HasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (interface{}, error) {
	// authUser, ok := ctx.Value("authUser").(*models.User)
	authUser, err := helpers.GetAuthUser(ctx)

	if err != nil {
		return nil, &gqlerror.Error{
			Message: "❌ Authentication required",
			Extensions: map[string]interface{}{
				"code": "UNAUTHENTICATED",
			},
		}
	}

	if authUser.Userid == "admin" {
		return next(ctx)
	}

	if authUser.Status != "A" {
		return nil, &gqlerror.Error{
			Message: "❌ Disabled",
			Extensions: map[string]interface{}{
				"code": "UNAUTHENTICATED",
			},
		}
	}

	if authUser.Role != string(role) {
		// block calling the next resolver
		return nil, &gqlerror.Error{
			Message: "🚫 Access Denied!",
			Extensions: map[string]interface{}{
				"code": "FORBBIDEN",
			},
		}
	}

	// or let it pass through
	return next(ctx)
}
