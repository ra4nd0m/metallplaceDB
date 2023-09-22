LOCAL_BIN:=$(CURDIR)/bin

$(LOCAL_DIR):
	@mkdir -p $@

build:
	go build -o $(LOCAL_BIN)/metallplace cmd/metallplace/main.go

gen-swagger:
	GOBIN=$(LOCAL_BIN) go get github.com/swaggo/swag/cmd/swag
	GOBIN=$(LOCAL_BIN) go install github.com/swaggo/swag/cmd/swag
	$(LOCAL_BIN)/swag init -g ./cmd/metallplace/main.go
