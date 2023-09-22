LOCAL_BIN:=$(CURDIR)/bin

$(LOCAL_DIR):
	@mkdir -p $@

build:
	go build -o $(LOCAL_BIN)/metallplace cmd/metallplace/main.go

gen-swagger:
	go get github.com/swaggo/swag/cmd/swag
	~/go/bin/swag init -g ./cmd/metallplace/main.go
