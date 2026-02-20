import grpc
from concurrent import futures
import modify_docx_pb2
import modify_docx_pb2_grpc
from modifier import modify_docx

class ModifyDocxServicer(modify_docx_pb2_grpc.ModifyDocxServicer):
    def ModifyDocx(self, request, context):
        modified_bytes = modify_docx(request.bytes)
        return modify_docx_pb2.ModifiedDocxResponse(modified_bytes=modified_bytes)
    
    def TestFunc(self, request, context):
        pong = test_func(request.ping)
        return modify_docx_pb2.TestFuncResponse(pong=pong)
    
def serve():
    options = [
        ('grpc.max_receive_message_length', 21316343),  # Set the maximum receive message length
        ('grpc.max_send_message_length', 21316343),     # Set the maximum send message length
    ]
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10), options=options)
    modify_docx_pb2_grpc.add_ModifyDocxServicer_to_server(ModifyDocxServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


def test_func(ping):
    return ping + " pong"

serve()