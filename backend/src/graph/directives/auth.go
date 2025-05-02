package directives

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
)

func Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	// authUser, err := helpers.GetAuthUser(ctx)
	_, err := helpers.GetAuthUser(ctx)
	// fmt.Println(authUser)

	if err != nil {
		return nil, fmt.Errorf("❌ Unauthorized!")
	}

	return next(ctx)
}

func HasRole(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (interface{}, error) {
	// authUser, ok := ctx.Value("authUser").(*models.User)
	authUser, err := helpers.GetAuthUser(ctx)

	if err != nil {
		return nil, fmt.Errorf("❌ unauthorized!")
	}

	fmt.Println(role, authUser.Role)

	if authUser.Role != string(role) {
		// block calling the next resolver
		return nil, fmt.Errorf("🚫 Access Denied!")
	}

	// or let it pass through
	return next(ctx)
}
