package handler

import (
	"github.com/gorilla/mux"
	"net/http"
	"strings"
)

func (h Handler) GetReportHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	date := strings.TrimRight(vars["date"], ".pdf")

	bytes, err := h.service.GetCachedReport(date)
	if err != nil {
		http.Error(w, "cant get pdf bytes: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/pdf")

	_, _ = w.Write(bytes)
}
