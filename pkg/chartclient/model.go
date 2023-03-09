package chartclient

type Request struct {
	XLabelSet []string   `json:"x_label_set"`
	YDataSet  []YDataSet `json:"y_data_set"`
	Options   Options    `json:"chart_options"`
}

type YDataSet struct {
	Label           string    `json:"label"`
	Data            []float64 `json:"data"`
	PredictAccuracy float64   `json:"predict_accuracy"`
}

type Options struct {
	NeedLabels bool   `json:"labels"`
	Type       string `json:"type"`
	Group      int    `json:"group"`
	XStep      string `json:"x_step"`
	TickLimit  int    `json:"tick_limit"`
	NeedLegend bool   `json:"legend"`
	ToFixed    int    `json:"to_fixed"`
	Title      string `json:"title"`
}
