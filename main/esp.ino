#include <SoftwareSerial.h>
#include <DHT.h>

// === Pin Definitions ===
#define VOLTAGE_INPUT_PIN A0
#define VOLTAGE_OUTPUT_PIN A1
#define CURRENT_SENSOR_INPUT_PIN A2
#define CURRENT_SENSOR_OUTPUT_PIN A4
#define DHT_PIN 3
#define RELAY_PIN 4

// IR sensor pins for 4 slots
#define IR_SENSOR_SLOT1 2
#define IR_SENSOR_SLOT2 5
#define IR_SENSOR_SLOT3 6
#define IR_SENSOR_SLOT4 7

// === Sensor Configuration ===
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

// UART Communication
SoftwareSerial esp32Serial(8, 9); // RX, TX

// Calibration Constants
const float VOLTAGE_DIVIDER_RATIO = 11.0;
const float CURRENT_SENSOR_SENSITIVITY = 0.1; // V/A
const float CURRENT_SENSOR_OFFSET = 2.5;      // V at 0A

// Trip Thresholds
const float MAX_INPUT_VOLTAGE = 250.0;
const float MAX_OUTPUT_VOLTAGE = 240.0;
const float MAX_INPUT_CURRENT = 10.0;
const float MAX_OUTPUT_CURRENT = 10.0;
const float MAX_TEMPERATURE = 50.0;

// === Sensor Data Structure ===
struct SensorData {
  float inputVoltage;
  float outputVoltage;
  float inputCurrent;
  float outputCurrent;
  float temperature;
  float humidity;
  int slots[4]; // 1 = occupied, 0 = empty
  unsigned long timestamp;
};

SensorData sensorData;

void setup() {
  Serial.begin(9600);
  esp32Serial.begin(9600);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // Relay initially OFF

  // IR slots
  pinMode(IR_SENSOR_SLOT1, INPUT);
  pinMode(IR_SENSOR_SLOT2, INPUT);
  pinMode(IR_SENSOR_SLOT3, INPUT);
  pinMode(IR_SENSOR_SLOT4, INPUT);

  dht.begin();

  Serial.println("🚗 EV Charger Monitor Ready (All sensors + Relay logic)");
  delay(2000);
}

void loop() {
  readSensors();
  sendDataToESP32();
  printDebugData();
  delay(5000); // Send every 5 seconds
}

void readSensors() {
  // Input Voltage
  int inputVoltageRaw = analogRead(VOLTAGE_INPUT_PIN);
  sensorData.inputVoltage = (inputVoltageRaw * 5.0 / 1024.0) * VOLTAGE_DIVIDER_RATIO;

  // Output Voltage
  int outputVoltageRaw = analogRead(VOLTAGE_OUTPUT_PIN);
  sensorData.outputVoltage = (outputVoltageRaw * 5.0 / 1024.0) * VOLTAGE_DIVIDER_RATIO;

  // Input Current
  int inputCurrentRaw = analogRead(CURRENT_SENSOR_INPUT_PIN);
  float inputCurrentVoltage = (inputCurrentRaw * 5.0) / 1024.0;
  sensorData.inputCurrent = (inputCurrentVoltage - CURRENT_SENSOR_OFFSET) / CURRENT_SENSOR_SENSITIVITY;
  if (sensorData.inputCurrent < 0) sensorData.inputCurrent = 0;

  // Output Current
  int outputCurrentRaw = analogRead(CURRENT_SENSOR_OUTPUT_PIN);
  float outputCurrentVoltage = (outputCurrentRaw * 5.0) / 1024.0;
  sensorData.outputCurrent = (outputCurrentVoltage - CURRENT_SENSOR_OFFSET) / CURRENT_SENSOR_SENSITIVITY;
  if (sensorData.outputCurrent < 0) sensorData.outputCurrent = 0;

  // Temperature and Humidity
  sensorData.temperature = dht.readTemperature();
  sensorData.humidity = dht.readHumidity();

  // Handle DHT sensor errors
  if (isnan(sensorData.temperature)) sensorData.temperature = 0.0;
  if (isnan(sensorData.humidity)) sensorData.humidity = 0.0;

  // IR Sensors for 4 slots
  sensorData.slots[0] = digitalRead(IR_SENSOR_SLOT1);
  sensorData.slots[1] = digitalRead(IR_SENSOR_SLOT2);
  sensorData.slots[2] = digitalRead(IR_SENSOR_SLOT3);
  sensorData.slots[3] = digitalRead(IR_SENSOR_SLOT4);

  // Timestamp
  sensorData.timestamp = millis();

  // === Relay Logic: Trip if any value exceeds threshold ===
  bool overload = false;
  if (sensorData.inputVoltage > MAX_INPUT_VOLTAGE) overload = true;
  if (sensorData.outputVoltage > MAX_OUTPUT_VOLTAGE) overload = true;
  if (sensorData.inputCurrent > MAX_INPUT_CURRENT) overload = true;
  if (sensorData.outputCurrent > MAX_OUTPUT_CURRENT) overload = true;
  if (sensorData.temperature > MAX_TEMPERATURE) overload = true;

  digitalWrite(RELAY_PIN, overload ? HIGH : LOW);
}

void sendDataToESP32() {
  String dataPacket = "{";
  dataPacket += "\"inputV\":" + String(sensorData.inputVoltage, 2) + ",";
  dataPacket += "\"outputV\":" + String(sensorData.outputVoltage, 2) + ",";
  dataPacket += "\"inputC\":" + String(sensorData.inputCurrent, 2) + ",";
  dataPacket += "\"outputC\":" + String(sensorData.outputCurrent, 2) + ",";
  dataPacket += "\"temperature\":" + String(sensorData.temperature, 2) + ",";
  dataPacket += "\"humidity\":" + String(sensorData.humidity, 2) + ",";
  dataPacket += "\"slots\":[" + String(sensorData.slots[0]) + "," +
                String(sensorData.slots[1]) + "," +
                String(sensorData.slots[2]) + "," +
                String(sensorData.slots[3]) + "],";
  dataPacket += "\"timestamp\":" + String(sensorData.timestamp);
  dataPacket += "}";

  // Send JSON data
  esp32Serial.print(dataPacket);
  esp32Serial.print('\n');
  
  // Send END marker
  esp32Serial.print("END");
  esp32Serial.print('\n');
  
  // Debug output
  Serial.println("📤 Sent to ESP32: " + dataPacket);
}

void printDebugData() {
  Serial.println("=== EV Charger Sensor Data ===");
  Serial.print("Input Voltage: "); Serial.print(sensorData.inputVoltage); Serial.println(" V");
  Serial.print("Output Voltage: "); Serial.print(sensorData.outputVoltage); Serial.println(" V");
  Serial.print("Input Current: "); Serial.print(sensorData.inputCurrent); Serial.println(" A");
  Serial.print("Output Current: "); Serial.print(sensorData.outputCurrent); Serial.println(" A");
  Serial.print("Temperature: "); Serial.print(sensorData.temperature); Serial.println(" °C");
  Serial.print("Humidity: "); Serial.print(sensorData.humidity); Serial.println(" %");

  Serial.println("Slot Occupancy:");
  for (int i = 0; i < 4; i++) {
    Serial.print("  Slot ");
    Serial.print(i + 1);
    Serial.print(": ");
    Serial.println(sensorData.slots[i] ? "OCCUPIED" : "EMPTY");
  }

  Serial.print("Relay Status: ");
  Serial.println(digitalRead(RELAY_PIN) ? "TRIPPED (Overload)" : "NORMAL");

  Serial.print("Timestamp: ");
  Serial.println(sensorData.timestamp);

  float inputPower = sensorData.inputVoltage * sensorData.inputCurrent;
  float outputPower = sensorData.outputVoltage * sensorData.outputCurrent;
  Serial.print("Input Power: "); Serial.print(inputPower); Serial.println(" W");
  Serial.print("Output Power: "); Serial.print(outputPower); Serial.println(" W");

  Serial.println("===============================");
}
