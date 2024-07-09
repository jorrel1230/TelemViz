import asyncio
import websockets
import json
import time
import serial

ser = serial.Serial('COM3', 115200, timeout=1)
time.sleep(1)

stages = ["PAD", "BOOST", "COAST", "DROGUE", "MAIN"]
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
    d = ser.readline().decode(errors='ignore').split(',')

    if len(d) == 24:
        data["imu"]["gyro"]["quaternion"]["x"] = float(d[0])
        data["imu"]["gyro"]["quaternion"]["y"] = float(d[1])
        data["imu"]["gyro"]["quaternion"]["z"] = float(d[2])
        data["imu"]["gyro"]["quaternion"]["w"] = float(d[3])

        data["imu"]["accelerometer"]["x"] = float(d[4])
        data["imu"]["accelerometer"]["y"] = float(d[5])
        data["imu"]["accelerometer"]["z"] = float(d[6])
        data["imu"]["accelerometer"]["net"] = float(d[7])

        data["imu"]["magnetometer"]["x"] = float(d[8])
        data["imu"]["magnetometer"]["y"] = float(d[9])
        data["imu"]["magnetometer"]["z"] = float(d[10])
        data["imu"]["magnetometer"]["net"] = float(d[11])

        data["temperature"] = float(d[12])
        data["barometer"]["altitude"] = float(d[13])
        data["barometer"]["pressure"] = float(d[14])

        data["gps"]["latitude"] = float(d[15])
        data["gps"]["longitude"] = float(d[16])
        data["gps"]["altitude"] = float(d[17])


        data["status"]["stage"] = stages[int(d[18])]
        data["status"]["age"] = int(d[19])
        data["status"]["gps"] = d[20] == '1'
        data["status"]["barometer"] = d[21] == '1'
        data["status"]["imu"] = d[22] == '1'

    #print(data["imu"]["gyro"])

k = ThreadJob(fetch_data, event, 0.001)
k.start()

async def send_data(websocket, path):
    while True:
        await websocket.send(json.dumps(data))
        await asyncio.sleep(0.05)


start_server = websockets.serve(send_data, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
