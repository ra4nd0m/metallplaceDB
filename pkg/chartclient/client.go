package chartclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func GetChart(req Request) ([]byte, error) {
	json, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("cant marshall req to json: %w", err)
	}

	request, err := http.NewRequest("POST", "http://localhost:3000/gen", bytes.NewBuffer(json))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("cant get js service response: %w", err)
	}
	defer response.Body.Close()

	fmt.Println("response Status:", response.Status)
	fmt.Println("response Headers:", response.Header)
	body, _ := ioutil.ReadAll(response.Body)
	fmt.Println("response Body:", string(body))

	return body, nil
}
