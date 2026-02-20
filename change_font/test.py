import grpc
import modify_docx_pb2
import modify_docx_pb2_grpc

def make_grpc_request():
    channel = grpc.insecure_channel('localhost:50051')
    stub = modify_docx_pb2_grpc.ModifyDocxStub(channel)

    # Create a request message
    request = modify_docx_pb2.TestFuncRequest(ping = 'ping')

    # Call the ModifyDocx RPC
    response = stub.TestFunc(request)

    # Access the response data
    pong = response.pong

    # Print or process the modified_bytes as needed
    print(pong)

make_grpc_request()
