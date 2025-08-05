
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <time.h>


// --- WiFi Credentials ---



// --- Firebase Objects ---
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// --- Pins ---
#define DHT_PIN 4
#define DHT_TYPE DHT11
#define FIRE_SENSOR_PIN 5
#define IR_SENSOR_1_PIN 6
#define IR_SENSOR_2_PIN 7
#define IR_SENSOR_3_PIN 8
#define IR_SENSOR_4_PIN 9
#define RELAY_CIRCUIT_BREAKER 10
#define RELAY_FIRE_PUMP 11

// --- UART from Arduino ---
#define ARDUINO_RX 9
#define ARDUINO_TX 10
HardwareSerial ARDUINO_SERIAL(1);

// --- DHT Sensor ---
DHT dht(DHT_PIN, DHT_TYPE);

// --- Data Structures ---
struct PowerData {
  float acVoltage, acCurrent, acPower, acEnergy, acFrequency, acPowerFactor;
  float dcVoltage, dcCurrent, dcPower;
  bool pzemConnected;
  unsigned long timestamp;
};

struct EnvironmentalData {
  float temperature;
  float humidity;
  bool fireDetected;
  unsigned long timestamp;
};

struct SlotData {
  bool occupied;
  unsigned long occupiedTime;
};

struct SystemStatus {
  bool circuitBreakerActive;
  bool firePumpActive;
  bool alarm;
  String alarmMessage;
};

SlotData slots[4];
PowerData powerData;
EnvironmentalData envData;
SystemStatus systemStatus = {false, false, false, ""};

// --- Time Tracking ---
unsigned long lastFirebaseUpdate = 0;
unsigned long lastHistoryLog = 0;
const unsigned long FIREBASE_UPDATE_INTERVAL = 5000;
const unsigned long HISTORY_LOG_INTERVAL = 60000;

// --- Thresholds ---
const float MAX_TEMP = 45.0;
const float MAX_AC_CURRENT = 32.0;
const float MAX_DC_CURRENT = 50.0;

void setup() {
  Serial.begin(115200);
  ARDUINO_SERIAL.begin(9600, SERIAL_8N1, ARDUINO_RX, ARDUINO_TX);
  dht.begin();
  initializePins();
  connectWiFi();
  setupFirebase();
  configTime(0, 0, "pool.ntp.org");
  Serial.println("ESP32-S3 EV Charging Station Monitor Starting...");
}

void loop() {
  readEnvSensors();
  readSlotSensors();
  readArduinoData();
  evaluateAlarms();

  if (millis() - lastFirebaseUpdate >= FIREBASE_UPDATE_INTERVAL) {
    pushToFirebase();
    lastFirebaseUpdate = millis();
  }

  if (millis() - lastHistoryLog >= HISTORY_LOG_INTERVAL) {
    logHistory();
    lastHistoryLog = millis();
  }

  delay(1000);
}

// ---------------------- Setup Functions ----------------------

void initializePins() {
  pinMode(FIRE_SENSOR_PIN, INPUT);
  pinMode(IR_SENSOR_1_PIN, INPUT);
  pinMode(IR_SENSOR_2_PIN, INPUT);


void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

void setupFirebase() {


// ---------------------- Reading Functions ----------------------

void readEnvSensors() {
  envData.temperature = dht.readTemperature();
  envData.humidity = dht.readHumidity();
  envData.fireDetected = digitalRead(FIRE_SENSOR_PIN) == HIGH;
  envData.timestamp = millis();

  if (isnan(envData.temperature)) envData.temperature = -999;
  if (isnan(envData.humidity)) envData.humidity = -999;
}

void readSlotSensors() {
  slots[0].occupied = digitalRead(IR_SENSOR_1_PIN) == LOW;
  slots[1].occupied = digitalRead(IR_SENSOR_2_PIN) == LOW;
  slots[2].occupied = digitalRead(IR_SENSOR_3_PIN) == LOW;
  slots[3].occupied = digitalRead(IR_SENSOR_4_PIN) == LOW;

  for (int i = 0; i < 4; i++) {
    if (slots[i].occupied && slots[i].occupiedTime == 0) {
      slots[i].occupiedTime = time(nullptr);
    } else if (!slots[i].occupied) {
      slots[i].occupiedTime = 0;
    }
  }
}


    }
  }
}

void parsePowerData(String payload) {
  int idx[11];
  int pos = 0;
  for (int i = 0; i < payload.length(); i++) {
    if (payload[i] == ',' && pos < 11) {
      idx[pos++] = i;
    }
  }
  if (pos >= 9) {
    powerData.acVoltage = payload.substring(0, idx[0]).toFloat();
    powerData.acCurrent = payload.substring(idx[0] + 1, idx[1]).toFloat();
    powerData.acPower = payload.substring(idx[1] + 1, idx[2]).toFloat();
    powerData.acEnergy = payload.substring(idx[2] + 1, idx[3]).toFloat();
    powerData.acFrequency = payload.substring(idx[3] + 1, idx[4]).toFloat();
    powerData.acPowerFactor = payload.substring(idx[4] + 1, idx[5]).toFloat();
    powerData.dcVoltage = payload.substring(idx[5] + 1, idx[6]).toFloat();
    powerData.dcCurrent = payload.substring(idx[6] + 1, idx[7]).toFloat();
    powerData.dcPower = payload.substring(idx[7] + 1, idx[8]).toFloat();
    powerData.pzemConnected = payload.substring(idx[8] + 1, idx[9]).toInt() == 1;
    powerData.timestamp = payload.substring(idx[9] + 1).toInt();
  }
}

// ---------------------- Alarm & Relay Logic ----------------------

void evaluateAlarms() {
  systemStatus.alarm = false;
  systemStatus.alarmMessage = "";

  if (envData.temperature > MAX_TEMP) {
    systemStatus.alarm = true;
    systemStatus.alarmMessage += "Overtemperature! ";
    activateBreaker();
  }

  if (envData.fireDetected) {
    systemStatus.alarm = true;
    systemStatus.alarmMessage += "Fire detected! ";
    activateFirePump();
    activateBreaker();
  }

  if (powerData.acCurrent > MAX_AC_CURRENT || powerData.dcCurrent > MAX_DC_CURRENT) {
    systemStatus.alarm = true;
    systemStatus.alarmMessage += "Overcurrent! ";
    activateBreaker();
  }

  if (!systemStatus.alarm && !envData.fireDetected) {
    deactivateBreaker();
    deactivateFirePump();
  }
}

void activateBreaker() {
  digitalWrite(RELAY_CIRCUIT_BREAKER, HIGH);
  systemStatus.circuitBreakerActive = true;
}

void deactivateBreaker() {
  digitalWrite(RELAY_CIRCUIT_BREAKER, LOW);
  systemStatus.circuitBreakerActive = false;
}

void activateFirePump() {
  digitalWrite(RELAY_FIRE_PUMP, HIGH);
  systemStatus.firePumpActive = true;
}

void deactivateFirePump() {
  digitalWrite(RELAY_FIRE_PUMP, LOW);
  systemStatus.firePumpActive = false;
}

// ---------------------- Firebase Uploads ----------------------

void pushToFirebase() {
  DynamicJsonDocument doc(2048);

  doc["environment"]["temperature"] = envData.temperature;
  doc["environment"]["humidity"] = envData.humidity;
  doc["environment"]["fire"] = envData.fireDetected;

  for (int i = 0; i < 4; i++) {
    doc["slots"][i]["occupied"] = slots[i].occupied;
    doc["slots"][i]["time"] = slots[i].occupiedTime;
  }

  doc["power"]["ac"]["voltage"] = powerData.acVoltage;
  doc["power"]["ac"]["current"] = powerData.acCurrent;
  doc["power"]["ac"]["power"] = powerData.acPower;
  doc["power"]["ac"]["energy"] = powerData.acEnergy;
  doc["power"]["ac"]["frequency"] = powerData.acFrequency;
  doc["power"]["ac"]["pf"] = powerData.acPowerFactor;
  doc["power"]["dc"]["voltage"] = powerData.dcVoltage;
  doc["power"]["dc"]["current"] = powerData.dcCurrent;
  doc["power"]["dc"]["power"] = powerData.dcPower;
  doc["power"]["connected"] = powerData.pzemConnected;

  doc["system"]["breaker"] = systemStatus.circuitBreakerActive;
  doc["system"]["fire_pump"] = systemStatus.firePumpActive;
  doc["system"]["alarm"] = systemStatus.alarm;
  doc["system"]["message"] = systemStatus.alarmMessage;

  doc["timestamp"] = millis();
  doc["utc"] = time(nullptr);

  String json;
  serializeJson(doc, json);

  Firebase.RTDB.setString(&firebaseData, "/charging_station/current_status", json);
}

void logHistory() {
  String ts = String(time(nullptr));
  String path = "/charging_station/history/" + ts;
  DynamicJsonDocument doc(2048);

  doc["ac_power"] = powerData.acPower;
  doc["dc_power"] = powerData.dcPower;
  doc["temp"] = envData.temperature;
  doc["humidity"] = envData.humidity;
  doc["timestamp"] = millis();
  doc["utc"] = ts;

  String json;
  serializeJson(doc, json);
  Firebase.RTDB.setString(&firebaseData, path, json);
}
