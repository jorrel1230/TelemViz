from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from math import cos, sin

import json

data = {
    "gyro": {
        "quaternion": {
            "x": 0, 
            "y": 0, 
            "z": 0,
            "w": 1
        }
    },
    "barometer": {
        "altitude": 1000,
    },
    "gps": {
        "latitude": 0,
        "longitude": 0,
        "altitude": 1001,
    }
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

test = {
    "roll": 0,
    "pitch": 0,
    "yaw": 0
}



# Program Microcontroller Access in this function.
def fetch_data():
    test["yaw"] += 0
    test["pitch"] += 0
    test["roll"] += 0.003


k = ThreadJob(fetch_data,event,0.01)
k.start()


# Data API Here
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/gyro/quaternion', methods=['GET'])
def get_gyro_quaternion():
    #print(data["gyro"]["quaternion"])
    return jsonify(data["gyro"]["quaternion"])

@app.route('/gyro/rand_quaternion', methods=['GET'])
def get_gyro_rand_quaternion():
    cr = cos(test["roll"] * 0.5)
    sr = sin(test["roll"] * 0.5)
    cp = cos(test["pitch"] * 0.5)
    sp = sin(test["pitch"] * 0.5)
    cy = cos(test["yaw"] * 0.5)
    sy = sin(test["yaw"] * 0.5)

    q = {}
    q["w"] = round(cr * cp * cy + sr * sp * sy, 8)
    q["x"] = round(sr * cp * cy - cr * sp * sy, 8)
    q["y"] = round(cr * sp * cy + sr * cp * sy, 8)
    q["z"] = round(cr * cp * sy - sr * sp * cy, 8)

    return jsonify(q)

if __name__ == '__main__':
    app.run(debug=True)
    
