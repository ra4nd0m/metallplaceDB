package handler

import "net/http"

type GetChartRawRequest struct {
	Book      []byte `json:"book"`
	TickLimit int    `json:"tick_limit"`
}

type GetChartRawResponse struct {
}

func (h Handler) GetChartRawHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetChartRawRequest) (GetChartRawResponse, error) {
		chartReq, err := h.service.ParseBook(req.Book)
		if err != nil {
			return GetChartRawResponse{}, err
		}
		bytes, err := h.service.GetChartRaw(chartReq, req.TickLimit)
		if err != nil {
			return GetChartRawResponse{}, err
		}

		w.Header().Set("Content-Type", "image/png")
		_, _ = w.Write(bytes)
		return GetChartRawResponse{}, nil
	})
}
