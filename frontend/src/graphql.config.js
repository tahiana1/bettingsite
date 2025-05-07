// graphql.config.js
module.exports = {
  projects: {
    app: {
      schema: ["src/schema.graphql", "directives.graphql"],
      documents: ["**/*.{graphql,js,ts,jsx,tsx}", "my/fragments.graphql"],
      extensions: {
        endpoints: {
          default: {
            url: "http://localhost:8080/api/v1/graphql/playground",
            headers: {
              Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDg4MzIzMTEsImlwIjoiMTkyLjE2OC4zOC4xIiwic3ViIjoxMH0.iaQQJc_wrjk8sUemfgvsaKOawPAHSGS6o_yVwe8hFBA`,
            },
          },
        },
      },
    },
  },
};
