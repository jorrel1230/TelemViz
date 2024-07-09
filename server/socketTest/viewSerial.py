import serial

ser = serial.Serial('COM3', 115200, timeout=1)

while 1:
    d = ser.readline().decode(errors='ignore').split(',')
    print(d[:4])