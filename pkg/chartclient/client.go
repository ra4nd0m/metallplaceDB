package chartclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

type ChartClient struct {
	Host string
	Port int
}

func New(host string, port int) *ChartClient {
	return &ChartClient{Host: host, Port: port}
}

func (cc *ChartClient) GetChart(req Request) ([]byte, error) {
	json, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("cant marshall chart req to json: %w", err)
	}

	request, err := http.NewRequest("POST", "http://"+cc.Host+":"+strconv.Itoa(cc.Port)+"/gen",
		bytes.NewBuffer(json))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("cant get chart js service response: %w", err)
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("cant read chart js service response body: %v", err)
	}

	return body, nil
}

func (cc *ChartClient) GetChartTitled(req Request) ([]byte, error) {

	json, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("cant marshall chart req to json: %w", err)
	}

	request, err := http.NewRequest("POST", "http://"+cc.Host+":"+strconv.Itoa(cc.Port)+"/gen",
		bytes.NewBuffer(json))
	request.Header.Set("Content-Type", "application/json; charset=UTF-8")

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return nil, fmt.Errorf("cant get chart js service response: %w", err)
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("cant read chart js service response body: %v", err)
	}

	return body, nil
}
