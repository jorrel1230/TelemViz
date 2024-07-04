from flask import Flask, jsonify, request
from flask_cors import CORS
import math
import time

data = {
    "imu": {
        "gyro": {
            "quaternion": {
                "x":  0, 
                "y": 0, 
                "z": 0,
                "w":  1
            }
        },
        "accelerometer": {
            "x": 0, 
            "y": -1, 
            "z": 0,
            "net": 1
        },
        "magnetometer": {
            "x": 0, 
            "y": -1, 
            "z": 0,
            "net": 1
        }
    },
    "barometer": {
        "altitude": 0,
        "pressure": 999
    },
    "temperature": 30,
    "gps": {
        "latitude": 40.34871084405939, 
        "longitude": -74.65934104726473,
        "altitude": -2,
    },
    "status": {
        "stage": "Pad",
        "age": 0,
        "gps": True,
        "imu": False,
        "barometer": True
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


# Program Microcontroller Access in this function.
def fetch_data():
    if (time.localtime().tm_sec % 2 == 0):
        data["status"]["gps"] = True
        data["status"]["imu"] = False
        data["status"]["barometer"] = True
    else:
        data["status"]["gps"] = False
        data["status"]["imu"] = True
        data["status"]["barometer"] = False

    t = time.time()

    data["imu"]["gyro"]["quaternion"]["w"] = math.sin(t) * 0.816496581
    data["imu"]["gyro"]["quaternion"]["y"] = math.cos(t) 
    data["imu"]["gyro"]["quaternion"]["z"] = -math.sin(t) * 0.577350269

    
    data["imu"]["accelerometer"]["x"] = math.cos(t) * 0.81649658092
    data["imu"]["accelerometer"]["y"] = math.sin(t) 
    data["imu"]["accelerometer"]["z"] = math.cos(t + 1/2) * 0.57735026919
    data["imu"]["accelerometer"]["net"] = math.sqrt(data["imu"]["accelerometer"]["x"] * data["imu"]["accelerometer"]["x"] 
                                           + data["imu"]["accelerometer"]["y"] * data["imu"]["accelerometer"]["y"] 
                                           + data["imu"]["accelerometer"]["z"] * data["imu"]["accelerometer"]["z"])
    

    data["imu"]["magnetometer"]["x"] = math.sin(t/2) * 0.5
    data["imu"]["magnetometer"]["y"] = math.sin(t/2 + 1.57) * 0.75
    data["imu"]["magnetometer"]["z"] = math.sin(t/2 + 3.14)
    data["imu"]["magnetometer"]["net"] = math.sqrt(data["imu"]["magnetometer"]["x"] * data["imu"]["magnetometer"]["x"] 
                                           + data["imu"]["magnetometer"]["y"] * data["imu"]["magnetometer"]["y"] 
                                           + data["imu"]["magnetometer"]["z"] * data["imu"]["magnetometer"]["z"])
    
    data["gps"]["altitude"] += 2*abs(math.sin(t/2))
    data["barometer"]["altitude"] += 2*abs(math.cos(t/2))

    data["temperature"] = math.sin(t/1.5) ** 2 + math.cos(t/1.5)
    data["barometer"]["pressure"] += math.sin(t/1.5) ** 2 + math.cos(t/1.5)

    data["gps"]["latitude"] += math.sin(t/2) * 0.00005
    data["gps"]["longitude"] += math.cos(t/2) * 0.00005

    


k = ThreadJob(fetch_data,event, 0.01)
k.start()


# Data API Here
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(data["status"])


@app.route('/imu/gyro/quaternion', methods=['GET'])
def get_gyro_quaternion():
    return jsonify(data["imu"]["gyro"]["quaternion"])


@app.route('/imu/accelerometer', methods=['GET'])
def get_acc():
    return jsonify(data["imu"]["accelerometer"])

@app.route('/imu/magnetometer', methods=['GET'])
def get_mag():
    return jsonify(data["imu"]["magnetometer"])

@app.route('/altitude', methods=['GET'])
def get_alt():
    alt = {
        "gps": data["gps"]["altitude"],
        "barometer": data["barometer"]["altitude"]
    }
    return jsonify(alt)


@app.route('/temperature', methods=['GET'])
def get_temp():
    return jsonify(data["temperature"])

@app.route('/gps', methods=['GET'])
def get_gps():
    return jsonify(data["gps"])

@app.route('/barometer/pressure', methods=['GET'])
def get_pressure():
    return jsonify(data["barometer"]["pressure"])

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="127.0.0.1", port=5000, threads=8)
    
