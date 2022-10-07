package handler

import (
	"github.com/gorilla/mux"
	"net/http"
)

func (h Handler) GetReportHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	bytes, err := h.service.GetCachedReport(vars["repType"], vars["date"])
	if err != nil {
		http.Error(w, "cant get docx bytes: "+err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

	_, _ = w.Write(bytes)
}
