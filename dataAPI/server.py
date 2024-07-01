from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

import json

data = {
    "rotation": { "x": 59.11, "y": 59.11, "z": 59.11 }
}


# Fetching Data from Source

import threading

class ThreadJob(threading.Thread):
    def __init__(self,callback,event,interval):
        '''runs the callback function after interval seconds

        :param callback:  callback function to invoke
        :param event: external event for controlling the update operation
        :param interval: time in seconds after which are required to fire the callback
        :type callback: function
        :type interval: int
        '''
        self.callback = callback
        self.event = event
        self.interval = interval
        super(ThreadJob,self).__init__()

    def run(self):
        while not self.event.wait(self.interval):
            self.callback()

event = threading.Event()

def fetch_data():
    data["rotation"]["x"] += 0.01
    data["rotation"]["y"] += 0.01
    data["rotation"]["z"] += 0.01

k = ThreadJob(fetch_data,event,0.01)
k.start()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Route to fetch the JSON data
@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
    
