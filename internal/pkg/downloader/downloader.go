package downloader

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func DownloadFile(out *os.File, url string) error {
	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			fmt.Errorf("can't close Body after downloading: %v", err)
		}
	}(resp.Body)

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	fmt.Printf("Copy %v to %v\n", url, out.Name())
	return err
}

func DownloadReader(url string) (io.ReadCloser, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	return resp.Body, nil
}
