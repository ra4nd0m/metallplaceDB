package handler

import (
	"bytes"
	"errors"
	"fmt"
	"metallplace/internal/pkg/genpdf"
	"net/http"
	"os"
)

type GetPDFFromHTMLRequest struct {
	HTMLBytes bytes.Buffer `json:"html_bytes"`
	FileName  string       `json:"file_name"`
}

type GetPDFFromHTMLResponse struct {
	Path string `json:"path"`
}

func (h Handler) GetPDFFromHTMLHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req GetPDFFromHTMLRequest) (GetPDFFromHTMLResponse, error) {
		path := "./var/report/" + req.FileName
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			err := genpdf.GetPDFFromHTML(req.HTMLBytes, path)
			if err != nil {
				return GetPDFFromHTMLResponse{}, fmt.Errorf("cant get pfd from html: %w", err)
			}
		}

		return GetPDFFromHTMLResponse{Path: path}, nil
	})
}
