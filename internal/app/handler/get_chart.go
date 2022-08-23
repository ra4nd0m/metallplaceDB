package handler

import (
	"github.com/gorilla/mux"
	"metallplace/internal/app/model"
	"net/http"
	"strings"
)

func (h Handler) GetChartHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	chartPack, err := model.NewChartPack(strings.TrimRight(vars["specs"], "."))
	if err != nil {
		http.Error(w, "cant pack request to struct", http.StatusBadRequest)
		return
	}

	bytes, err := h.service.GetCachedChart(r.Context(), chartPack)
	if err != nil {
		http.Error(w, "cant get img bytes: "+err.Error(), http.StatusBadRequest)
		return
	}

	_, _ = w.Write(bytes)

}
