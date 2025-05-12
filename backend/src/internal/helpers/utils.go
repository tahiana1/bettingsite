package helpers

import (
	"regexp"
	"strings"

	"github.com/mssola/user_agent"
)

type UserAgent struct {
	BrowserName    string
	BrowserVersion string
	OS             string
	Platform       string
}

func CamelToSnake(s string) string {
	re := regexp.MustCompile("([a-z0-9])([A-Z])")
	snake := re.ReplaceAllString(s, "${1}_${2}")
	return strings.ToLower(snake)
}

func ParseClient(uaString string) UserAgent {
	ua := user_agent.New(uaString)

	browserName, browserVersion := ua.Browser()
	oss := ua.OS()
	platform := ua.Platform()

	return UserAgent{
		BrowserName:    browserName,
		BrowserVersion: browserVersion,
		OS:             oss,
		Platform:       platform,
	}
}
