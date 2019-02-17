import SimpleHTTPServer
import SocketServer

PORT = 8000

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    pass

Handler.extensions_map['.js'] = 'text/javascript'

httpd = SocketServer.TCPServer(("127.0.0.1", PORT), Handler)

print "serving at port", 8000
httpd.serve_forever()