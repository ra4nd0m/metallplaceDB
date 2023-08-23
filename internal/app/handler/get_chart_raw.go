package handler

import "net/http"

type GetChartRawRequest struct {
	Book      []byte `json:"book"`
	TickLimit int    `json:"tick_limit"`
}

type GetChartRawResponse struct {
	Chart []byte `json:"chart"`
}

func (h Handler) GetChartRawHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetChartRawRequest) (GetChartRawResponse, error) {
		bytes, err := h.service.GetChartRaw(req.Book, req.TickLimit)
		if err != nil {
			SentrySend(r, err)
			return GetChartRawResponse{}, err
		}

		w.Header().Set("Content-Type", "image/png")
		_, _ = w.Write(bytes)
		return GetChartRawResponse{Chart: bytes}, nil
	})
}
