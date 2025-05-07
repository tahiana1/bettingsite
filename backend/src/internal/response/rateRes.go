package responses

type Market struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Type         string `json:"type"`
	Family       int    `json:"family"`
	ProviderName string `json:"providerName"`
}

type Rate struct {
	ID uint `json:"id"`

	// Foreign Keys
	FixtureID uint    `json:"fixtureId"`
	Fixture   Fixture `json:"-"`

	MarketID int    `json:"marketId"`
	Market   Market `json:"market"`

	// Status Fields
	RateHomeStatus int `json:"rateHomeStatus"`
	RateAwayStatus int `json:"rateAwayStatus"`
	RateDrawStatus int `json:"rateDrawStatus"`

	// General Info
	LineScore string `json:"lineScore"`
	LockYn    int    `json:"lockYn"`
	ManualYn  int    `json:"manualYn"`
	Baseline  string `json:"baseLine"`

	// Home Side
	HomeBetCode  string  `json:"homeBetCode"`
	HomePickName string  `json:"homePickName"`
	HomeBase     float64 `json:"homeBase"`
	HomeLine     string  `json:"homeLine"`
	HomeRate     float64 `json:"homeRate"`

	// Draw Option
	DrawBetCode  string  `json:"drawBetCode"`
	DrawPickName string  `json:"drawPickName"`
	DrawBase     float64 `json:"drawBase"`
	DrawLine     string  `json:"drawLine"`
	DrawRate     float64 `json:"drawRate"`

	// Away Side
	AwayBetCode  string  `json:"awayBetCode"`
	AwayPickName string  `json:"awayPickName"`
	AwayBase     float64 `json:"awayBase"`
	AwayLine     string  `json:"awayLine"`
	AwayRate     float64 `json:"awayRate"`
}
