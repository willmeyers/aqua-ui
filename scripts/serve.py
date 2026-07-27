#!/usr/bin/env python3
"""Dev server: python3 tools/serve.py [port]   (default 8777)"""
import http.server, os, sys

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class NoStore(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/', '/index.html'):
            self.send_response(302)
            self.send_header('Location', '/website/index.html')
            self.end_headers()
            return
        super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *a):
        pass

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
http.server.ThreadingHTTPServer(('127.0.0.1', port), NoStore).serve_forever()
