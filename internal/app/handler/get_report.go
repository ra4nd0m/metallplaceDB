package handler

type GetReportRequest struct {
	FileName string `json:"file_name"`
}

type GetReportResponse struct {
	Path string `json:"path"`
}
