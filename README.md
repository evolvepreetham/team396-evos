🚗 E-ECO SYSTEM: The Future of Smart EV Charging
An intelligent, AI-driven platform for optimizing Electric Vehicle charging infrastructure, reducing downtime, and accelerating the transition to sustainable mobility.

🚀 The Mission
Our mission is to solve the critical operational challenges in the EV charging industry. By creating a unified, intelligent ecosystem, we aim to make EV charging reliable, efficient, and accessible for everyone—from individual drivers to large-scale commercial fleets.

🧑‍💻 The Team: E-ECO SYSTEM

Preetham Awaji

Shivraj B Y

Basavaraj

Bhuvan B

🔎 The Problem: A Disconnected Infrastructure
The rapid adoption of Electric Vehicles has outpaced the evolution of our charging infrastructure. This has created a set of critical, interconnected problems:

🔌 Chronic Unreliability: Charging stations suffer from an alarming ~20% annual failure rate. These failures are often caused by preventable issues like voltage instability, transformer overloads, and phase imbalances, leaving drivers stranded and operators with costly repairs.

⏳ Massive Underutilization: Shockingly, up to 85% of charging ports remain idle at any given time. This represents a colossal waste of resources and a significant loss of potential revenue for station owners.

🔄 Inefficient and Frustrating Scheduling: The lack of intelligent scheduling tools leads to long waiting lines for drivers and logistical nightmares for commercial fleet managers who depend on timely charging.

⚡ Grid Overload: Unmanaged charging during peak demand hours places immense strain on the electrical grid. This not only increases operational costs but also poses a serious risk to grid stability.

💡 Our Solution: A Unified, Intelligent Ecosystem
E-ECO SYSTEM is a comprehensive platform that transforms disconnected charging points into a smart, self-regulating network. Our solution is built on three powerful, synergistic modules:

Core Modules:
⚡ CHALO CHARGE (For the Driver):
A user-centric smart booking system that eliminates guesswork. It analyzes real-time data to recommend the most optimal charging slot based on availability, charging speed, and user preference, ensuring a seamless and wait-free experience.

🧠 EVISION (For the Operator):
The predictive brain of our system. EVISION uses AI and real-time sensor data (monitoring voltage, current, and temperature) to forecast potential hardware failures before they occur. This enables proactive maintenance, dramatically reduces downtime, and ensures stations are always operational.

🚚 FLEET CHARGE (For the Enterprise):
An advanced logistics tool for commercial EV fleets. It intelligently schedules and reserves charging slots based on fixed operational routes and timetables, guaranteeing that delivery vans, buses, and other commercial vehicles are always charged and ready for deployment.

✨ Key Features & Innovations:
Dynamic Power Management: Intelligently distributes power across the station to prevent grid overload, reducing peak load energy costs by up to 25%.

AI-Powered Predictive Maintenance: Moves from a reactive "fix-when-broken" model to a proactive "prevent-and-predict" strategy, maximizing uptime and ROI.

Intelligent Slot Scheduling: Converts idle time into revenue by ensuring chargers are consistently and efficiently utilized.

Unified Real-Time Dashboard: Provides a single source of truth for tracking the health, availability, and performance of all charging assets.

📸 Project Prototype in Action
Here is a look at our physical hardware prototype, demonstrating the integration of our sensor technology with the charging station models.

🛠️ Technology Stack
Our platform is built on a modern, robust technology stack designed for scalability and real-time performance.

Hardware:

Voltage & Current Sensors for power monitoring.

IR-based Occupancy Sensors to detect vehicle presence.

Custom IoT Gateway for secure data transmission.

Backend:

Python: Powering our Machine Learning models and core backend logic.

Node.js: Driving our real-time APIs for the dashboard and mobile clients.

Firebase / NoSQL Cloud DB: Serving as the central nervous system for storing sensor logs, user data, and real-time status updates.

Frontend:

React & JavaScript: Creating a fluid, interactive, and real-time dashboard UI for all user types (drivers, operators, and fleet managers).

🚀 Getting Started: How to Run & Test
Follow these instructions to get the E-ECO SYSTEM platform running on your local machine.

1. Clone the Repository
https://github.com/evolvepreetham/evolve.3x.-team396
cd e-eco-system

2. Install Dependencies
For the frontend React dashboard:

npm install

For the backend Python services and AI models:

pip install -r requirements.txt

3. Configure Your Environment
Connect the necessary hardware sensors or configure the software to use a data simulator.

Create a .env file in the project's root directory.

Populate the .env file with your Firebase/API credentials and sensor data feed configuration.

4. Launch the Application
You will need two separate terminal windows to run the backend and frontend services concurrently.

Terminal 1: Start the Frontend Dashboard

npm start

Terminal 2: Start the Backend Services

python app.py

5. Test the Platform's Features
Open your web browser and navigate to http://localhost:3000.

Test CHALO CHARGE: Use the interface to simulate a driver booking a charging slot.

Test EVISION: Trigger simulated fault conditions in your sensor data feed and watch for predictive maintenance alerts on the dashboard.

Test FLEET CHARGE: Load a sample fleet schedule and observe how the system automatically reserves and optimizes charging assignments.



🙌 Acknowledgements
This project was conceived and developed as part of the Hackathon Hubli initiative. We are grateful for the opportunity to tackle real-world challenges in the critical fields of energy and sustainable mobility.
