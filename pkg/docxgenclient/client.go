package docxgenclient

type DocxgenClient struct {
	Host string
	Port int
}

func New(host string, port int) *DocxgenClient {
	return &DocxgenClient{Host: host, Port: port}
}

func (dc *DocxgenClient) GetReport(req Request) {

}
