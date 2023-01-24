package handler

import (
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

type UpdateMainFileRequest struct {
}

type UpdateMainFileResponse struct {
	Success bool `json:"success"`
}

func (h Handler) UpdateMainFileHandler(w http.ResponseWriter, r *http.Request) {
	handle(w, r, func(req UpdateMainFileRequest) (UpdateMainFileResponse, error) {
		file, _, err := r.FormFile("file")
		if err != nil {
			return UpdateMainFileResponse{}, err
		}
		defer file.Close()

		// Read the file bytes into a byte slice
		fileSize := r.Header.Get("fileSize")
		size, err := strconv.Atoi(fileSize)
		if err != nil {
			return UpdateMainFileResponse{}, err
		}
		fileBytes := make([]byte, size)
		_, err = io.ReadFull(file, fileBytes)
		if err != nil {
			return UpdateMainFileResponse{}, err
		}

		// Saving or replacing file
		path := "var/analytics.xlsx"
		_, err = os.Stat(path)
		if !os.IsNotExist(err) {
			err := os.Remove(path)
			if err != nil {
				return UpdateMainFileResponse{}, err
			}
		}
		err = ioutil.WriteFile(path, fileBytes, 0644)
		if err != nil {
			return UpdateMainFileResponse{}, err
		}
		return UpdateMainFileResponse{true}, nil
	})
}
