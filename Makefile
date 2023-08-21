build:
	mkdir -p bin
	go build -o bin/metallplace cmd/metallplace/main.go

gen-swagger:
	go get github.com/swaggo/swag/cmd/swag
	~/go/bin/swag init -g ./cmd/metallplace/main.go
