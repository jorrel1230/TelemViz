enum STAGE_TYPE {PAD, BOOST, COAST, DROGUE, MAIN};

struct DATA_STRUCT {

  // 9-axis IMU Data
  double gyroX, gyroY, gyroZ, gyroW;
  double accX, accY, accZ, accN;
  double magX, magY, magZ, magN;

  // Barometer Data
  double barT, barA, barP; // Temperature, Altitude and Pressure

  // GPS Data
  double gpsLat, gpsLng, gpsAlt;

  // Status Codes
  STAGE_TYPE stage;
  int age;
  bool gps, bmp, imu; 
};

char DATA_FORMAT_STR[] = "%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%.8f,%d,%d,%d,%d,%d,\n";

DATA_STRUCT data;

float prevTime;
float roll, pitch, yaw;

void setup() {

  pinMode(5, INPUT);
  pinMode(4, INPUT);
  pinMode(14, INPUT);

  prevTime = 0;
  roll = 0;
  pitch = 0;
  yaw = 0;

  data.gyroX = 0;
  data.gyroY = 0;
  data.gyroZ = 0;
  data.gyroW = 0;

  data.accX = 0;
  data.accY = -1;
  data.accZ = 0;
  data.accN = 1;

  data.magX = 0;
  data.magY = -1;
  data.magZ = 0;
  data.magN = 1;

  data.barA = 200;
  data.barP = -999;
  data.barT = 30;

  data.gpsAlt = 0;
  data.gpsLat = 40.3487108;
  data.gpsLng = -74.6593410;

  data.stage = PAD;
  data.gps = 1;
  data.imu = 0;
  data.bmp = 1;

  Serial.begin(115200);
  Serial.println(data.gpsLng);
}

void loop() {
  float t = millis() / 1000.0;
  float dt = millis() - prevTime;
  prevTime = millis();

  // Updates Status Codes
  if ((int) t % 2 == 0) {
    data.gps = 1;
    data.imu = 0;
    data.bmp = 1;
  } else {
    data.gps = 0;
    data.imu = 1;
    data.bmp = 0;
  }

  // Updates Quaternion Data
  roll += digitalRead(5) * dt * 0.005;
  pitch += digitalRead(4) * dt * 0.005;
  yaw += digitalRead(14) * dt * 0.005;

  double cr = cos(roll * 0.5);
  double sr = sin(roll * 0.5);
  double cp = cos(pitch * 0.5);
  double sp = sin(pitch * 0.5);
  double cy = cos(yaw * 0.5);
  double sy = sin(yaw * 0.5);

  data.gyroW = cr * cp * cy + sr * sp * sy;
  data.gyroX = sr * cp * cy - cr * sp * sy;
  data.gyroY = cr * sp * cy + sr * cp * sy;
  data.gyroZ = cr * cp * sy - sr * sp * cy;




  // Updates Acceleration Data
  data.accX = cos(t) * 0.81649658092;
  data.accY = sin(t);
  data.accZ = cos(t + 0.5) * 0.57735026919;
  data.accN = sqrt((data.accX*data.accX) + (data.accY*data.accY) + (data.accZ*data.accZ));

  // Updates Magnetometer Data
  data.magX = sin(t/2) * 0.5;
  data.magY = sin(t/2 + 1.57) * 0.75;
  data.magZ = sin(t/2 + 3.14);
  data.magN = sqrt((data.magX*data.magX) + (data.magY*data.magY) + (data.magZ*data.magZ));

  // Updates Altitude Data
  data.gpsAlt += 2*abs(sin(t/2));
  data.barA += 2*abs(sin(t/2));

  // Updates Bar data
  data.barP += sin(t/1.5)*sin(t/1.5) + cos(t/1.5);
  data.barT = sin(t/1.5)*sin(t/1.5) + cos(t/1.5);

  // Update GPS Data
  data.gpsLat = 40.3487108 + sin(t/2) * 0.005;
  data.gpsLng = cos(t/2) * 0.005 - 74.6593410;


  Serial.printf(DATA_FORMAT_STR, data.gyroX, data.gyroY, data.gyroZ, data.gyroW,
                                 data.accX, data.accY, data.accZ, data.accN,
                                 data.magX, data.magY, data.magZ, data.magN,
                                 data.barT, data.barA, data.barP,
                                 data.gpsLat, data.gpsLng, data.gpsAlt,
                                 data.stage, data.age, data.gps, data.bmp, data.imu);

  

}
