package handler

import (
	"github.com/gorilla/mux"
	"net/http"
)

// GetReportHandler godoc
//
//		@Summary		Get report file
//		@Description	get generated report in docx format. Type could be ether "weekly" or "monthly". Date of report in format YYYY-MM-DD
//		@Tags			report
//	    @Produce        json
//		@Success		200	{string}	Success: Returns the requested report in DOCX format.
//	    @Param Authorization header string true "Authorization"
//    	@SecurityDefinitions.apikey ApiKeyAuth
//		@Failure		400	{object}	ErrorResponse
//		@Failure		404	{object}	ErrorResponse
//		@Failure		500	{object}	ErrorResponse
//		@Router			/getReport/{type}/{date} [get]
func (h Handler) GetReportHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    bytes, err := h.service.GetCachedReport(vars["repType"], vars["date"])
    if err != nil {
        // Add structured error logging
        log.Error().
            Err(err).
            Str("report_type", vars["repType"]).
            Str("date", vars["date"]).
            Msg("Failed to generate report")

        // Initialize Sentry hub properly
        if hub := sentry.GetHubFromContext(r.Context()); hub != nil {
            hub.CaptureException(err)
        }
        
        http.Error(w, "Failed to generate report: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    _, _ = w.Write(bytes)
}
