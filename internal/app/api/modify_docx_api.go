package api

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
	pb "metallplace/pkg/api/modify_docx"
	"strconv"
	"time"
)

type Modifier struct {
	Host   string
	Port   int
	Client pb.ModifyDocxClient
}

func NewModifier(host string, port int) (*Modifier, error) {
	// Set the maximum receive and send message sizes
	maxMessageSize := 21316343 // Set the maximum message size in bytes

	// Create gRPC dial options with increased message size limits
	dialOptions := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithDefaultCallOptions(
			grpc.MaxCallRecvMsgSize(maxMessageSize),
			grpc.MaxCallSendMsgSize(maxMessageSize),
		),
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                50 * time.Second,
			Timeout:             30 * time.Second,
			PermitWithoutStream: true,
		}),
	}
	conn, err := grpc.Dial(host+":"+strconv.Itoa(port), dialOptions...)
	if err != nil {
		return nil, fmt.Errorf("cannot dial %s: %v", host, err)
	}
	client := pb.NewModifyDocxClient(conn)
	return &Modifier{Host: host, Port: port, Client: client}, nil
}

func (m *Modifier) FormatPageNumberFont(file []byte) ([]byte, error) {
	req := &pb.ModifyDocxRequest{Bytes: file}
	resp, err := m.Client.ModifyDocx(context.Background(), req)
	if err != nil {
		return nil, fmt.Errorf("cannot modify page number: %w", err)
	}
	return resp.ModifiedBytes, nil
}
