package chartclient

type Request struct {
	XLabelSet []string   `json:"x_label_set"`
	YDataSet  []YDataSet `json:"y_data_set"`
	Options   Options    `json:"chart_options"`
}

type YDataSet struct {
	Label string    `json:"label"`
	Data  []float64 `json:"data"`
}

type Options struct {
	NeedLabels bool   `json:"labels"`
	Type       string `json:"type"`
}
