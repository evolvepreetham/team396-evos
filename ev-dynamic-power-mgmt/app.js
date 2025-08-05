// Professional EV Charging Power Management & Analytics System
class EVPowerManagementSystem {
    constructor() {
        // System configuration
        this.config = {
            totalSlots: 4,
            slotCapacity: 10, // kW
            baseGridPower: 20, // kW
            maxGridPower: 40, // kW
            powerRequestDelay: 2000, // ms
            updateInterval: 1000 // ms
        };

        // Initialize system state
        this.slots = [
            { id: 1, status: 'available', currentPower: 0, maxPower: 10, evConnected: false, evId: null, chargingTime: 0, demand: 10, 
              billing: { dynamicRate: 12, normalRate: 15, energyConsumed: 0, dynamicCost: 0, normalCost: 0, savings: 0 } },
            { id: 2, status: 'available', currentPower: 0, maxPower: 10, evConnected: false, evId: null, chargingTime: 0, demand: 10,
              billing: { dynamicRate: 12, normalRate: 15, energyConsumed: 0, dynamicCost: 0, normalCost: 0, savings: 0 } },
            { id: 3, status: 'available', currentPower: 0, maxPower: 10, evConnected: false, evId: null, chargingTime: 0, demand: 10,
              billing: { dynamicRate: 12, normalRate: 15, energyConsumed: 0, dynamicCost: 0, normalCost: 0, savings: 0 } },
            { id: 4, status: 'available', currentPower: 0, maxPower: 10, evConnected: false, evId: null, chargingTime: 0, demand: 10,
              billing: { dynamicRate: 12, normalRate: 15, energyConsumed: 0, dynamicCost: 0, normalCost: 0, savings: 0 } }
        ];

        this.gridStatus = {
            currentSupply: 20,
            maxSupply: 40,
            requestInProgress: false,
            additionalPowerAvailable: true
        };

        this.systemStats = {
            gridRequests: 0,
            totalChargingTime: 0,
            totalSessions: 1247,
            totalEnergyDelivered: 15380,
            totalRevenue: 369120, // ₹4614 * 80 (USD to INR conversion)
            operatingCosts: 139360 // ₹1742 * 80
        };

        // Analytics data (converted to INR)
        this.analyticsData = {
            kpi: {
                total_cost_savings: 114080, // ₹1426 * 80
                savings_percentage: 45.0,
                power_reduction: 10380,
                power_reduction_pct: 36.0,
                dynamic_efficiency: 83.8,
                static_efficiency: 53.6,
                total_dynamic_cost: 139360, // ₹1742 * 80
                total_static_cost: 253440 // ₹3168 * 80
            },
            daily: this.generateDailyData(),
            hourly: this.generateHourlyData()
        };

        // Chart colors for light theme - more vibrant and visible
        this.colors = {
            primary: '#2563eb',    // Bright blue
            secondary: '#1d4ed8',  // Deep blue
            success: '#059669',    // Vibrant green
            warning: '#d97706',    // Bright orange
            error: '#dc2626',      // Strong red
            info: '#0891b2',       // Cyan blue
            gray: '#6b7280',       // Medium gray
            purple: '#7c3aed',     // Purple
            pink: '#db2777',       // Pink
            indigo: '#4338ca'      // Indigo
        };

        this.charts = {};
        this.chargingTimers = {};
        this.updateTimer = null;
        this.currentTab = 'dashboard';
        this.currentAnalyticsTab = 'overview';
        
        // Notification state tracking
        this.lastNotificationState = {
            loadBalancing: false,
            occupiedCount: 0
        };
        
        // Firebase configuration
        this.firebaseConfig = {
            apiKey: "AIzaSyA7FnjMzCN0c3rVKeye2rSZVxF9GhKmH74",
            databaseURL: "https://databsegrid-default-rtdb.asia-southeast1.firebasedatabase.app/",
            projectId: "databsegrid"
        };
        
        this.database = null;
        this.isFirebaseConnected = false;
        
        this.init();
    }

    init() {
        this.initializeFirebase();
        this.bindEventListeners();
        this.startRealTimeUpdates();
        this.updateUI();
        this.initializeCharts();
        this.showAlert('System initialized successfully', 'success', 'high');
    }

    // Firebase initialization
    initializeFirebase() {
        try {
            console.log('Initializing Firebase...');
            
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK not loaded');
            }
            
            // Initialize Firebase
            if (!firebase.apps.length) {
                console.log('Initializing Firebase app with config:', this.firebaseConfig);
                firebase.initializeApp(this.firebaseConfig);
            }
            
            this.database = firebase.database();
            
            // Test connection
            this.database.ref('.info/connected').on('value', (snapshot) => {
                if (snapshot.val() === true) {
                    console.log('Firebase connected successfully');
                    this.isFirebaseConnected = true;
                    this.updateDatabaseStatus('connected');
                    
                    // Set up real-time listeners
                    this.setupFirebaseListeners();
                    
                    // Initial data sync
                    this.syncToFirebase();
                    
                    this.showAlert('Connected to Firebase database', 'success', 'high');
                } else {
                    console.log('Firebase disconnected');
                    this.isFirebaseConnected = false;
                    this.updateDatabaseStatus('disconnected');
                }
            });
            
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.isFirebaseConnected = false;
            this.updateDatabaseStatus('error');
            this.showAlert(`Database connection failed: ${error.message}`, 'error', 'high');
        }
    }

    // Update database status indicator
    updateDatabaseStatus(status) {
        const indicator = document.getElementById('db-status-indicator');
        const text = document.getElementById('db-status-text');
        
        if (indicator && text) {
            indicator.className = 'status-indicator';
            
            switch (status) {
                case 'connected':
                    indicator.classList.add('online');
                    text.textContent = 'Connected';
                    break;
                case 'disconnected':
                    indicator.classList.add('offline');
                    text.textContent = 'Disconnected';
                    break;
                case 'error':
                    indicator.classList.add('error');
                    text.textContent = 'Error';
                    break;
                case 'syncing':
                    indicator.classList.add('syncing');
                    text.textContent = 'Syncing...';
                    break;
            }
        }
    }

    // Set up Firebase real-time listeners
    setupFirebaseListeners() {
        if (!this.isFirebaseConnected) return;

        // Listen for slot changes from other clients
        this.database.ref('ev-charging/slots').on('value', (snapshot) => {
            const remoteSlots = snapshot.val();
            if (remoteSlots && this.shouldSyncFromRemote) {
                this.syncFromFirebase(remoteSlots);
            }
        });

        // Listen for grid status changes
        this.database.ref('ev-charging/gridStatus').on('value', (snapshot) => {
            const remoteGridStatus = snapshot.val();
            if (remoteGridStatus && this.shouldSyncFromRemote) {
                this.gridStatus = { ...this.gridStatus, ...remoteGridStatus };
                this.updateUI();
            }
        });

        // Listen for system events
        this.database.ref('ev-charging/events').limitToLast(10).on('child_added', (snapshot) => {
            const event = snapshot.val();
            if (event && event.timestamp !== this.lastEventTimestamp) {
                this.handleRemoteEvent(event);
            }
        });
    }

    // Sync current state to Firebase
    syncToFirebase() {
        if (!this.isFirebaseConnected) return;

        this.shouldSyncFromRemote = false; // Prevent circular updates
        
        const data = {
            slots: this.slots,
            gridStatus: this.gridStatus,
            systemStats: this.systemStats,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            lastUpdate: new Date().toISOString()
        };

        console.log('Syncing data to Firebase:', data);
        
        this.database.ref('ev-charging').update(data)
            .then(() => {
                console.log('Data synced to Firebase successfully');
                setTimeout(() => {
                    this.shouldSyncFromRemote = true;
                }, 1000);
            })
            .catch((error) => {
                console.error('Firebase sync failed:', error);
                this.showAlert(`Cloud sync failed: ${error.message}`, 'error', 'high');
            });
    }

    // Sync from Firebase (when data changes from other clients)
    syncFromFirebase(remoteSlots) {
        if (!remoteSlots) return;

        // Update local slots with remote data
        remoteSlots.forEach((remoteSlot, index) => {
            if (remoteSlot && this.slots[index]) {
                const localSlot = this.slots[index];
                
                // Only update if there's a meaningful change
                if (localSlot.evConnected !== remoteSlot.evConnected ||
                    localSlot.status !== remoteSlot.status) {
                    
                    // Handle EV connection changes
                    if (remoteSlot.evConnected && !localSlot.evConnected) {
                        this.handleRemoteEVConnection(index + 1, remoteSlot);
                    } else if (!remoteSlot.evConnected && localSlot.evConnected) {
                        this.handleRemoteEVDisconnection(index + 1);
                    }
                }
            }
        });

        this.updateUI();
    }

    // Handle remote EV connection
    handleRemoteEVConnection(slotId, remoteSlot) {
        const slot = this.slots[slotId - 1];
        
        slot.evConnected = true;
        slot.evId = remoteSlot.evId;
        slot.status = 'occupied';
        slot.chargingTime = remoteSlot.chargingTime || 0;

        // Start charging timer
        this.chargingTimers[slotId] = setInterval(() => {
            slot.chargingTime++;
            this.updateSlotDisplay(slotId);
        }, 1000);

        this.showAlert(`Remote: EV ${remoteSlot.evId} connected to Slot ${slotId}`, 'info', 'high');
        this.calculatePowerAllocation();
    }

    // Handle remote EV disconnection
    handleRemoteEVDisconnection(slotId) {
        const slot = this.slots[slotId - 1];
        const evId = slot.evId;
        
        slot.evConnected = false;
        slot.evId = null;
        slot.status = 'available';
        slot.currentPower = 0;
        slot.chargingTime = 0;

        // Clear charging timer
        if (this.chargingTimers[slotId]) {
            clearInterval(this.chargingTimers[slotId]);
            delete this.chargingTimers[slotId];
        }

        this.showAlert(`Remote: EV ${evId} disconnected from Slot ${slotId}`, 'info', 'high');
        this.calculatePowerAllocation();
    }

    // Log events to Firebase
    logEventToDatabase(eventType, eventData) {
        if (!this.isFirebaseConnected) return;

        const event = {
            type: eventType,
            data: eventData,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            clientId: this.getClientId()
        };

        this.lastEventTimestamp = Date.now();
        
        this.database.ref('ev-charging/events').push(event)
            .catch((error) => {
                console.error('Failed to log event:', error);
            });
    }

    // Handle events from other clients
    handleRemoteEvent(event) {
        if (event.clientId === this.getClientId()) return; // Ignore own events

        switch (event.type) {
            case 'EV_CONNECTED':
                this.showAlert(`Remote: EV connected to Slot ${event.data.slotId}`, 'info', 'high');
                break;
            case 'EV_DISCONNECTED':
                this.showAlert(`Remote: EV disconnected from Slot ${event.data.slotId}`, 'info', 'high');
                break;
            case 'POWER_REQUEST':
                this.showAlert(`Remote: Additional power requested`, 'info', 'high');
                break;
        }
    }

    // Get unique client ID
    getClientId() {
        if (!this.clientId) {
            this.clientId = 'client_' + Math.random().toString(36).substr(2, 9);
        }
        return this.clientId;
    }

    // Manual sync button handler
    manualSync() {
        if (!this.isFirebaseConnected) {
            this.showAlert('Database not connected - attempting reconnection...', 'warning', 'high');
            this.initializeFirebase();
            return;
        }

        this.updateDatabaseStatus('syncing');
        
        // Test write to Firebase
        const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Connection test successful'
        };
        
        this.database.ref('ev-charging/connectionTest').set(testData)
            .then(() => {
                console.log('Test write successful');
                this.syncToFirebase();
                this.updateDatabaseStatus('connected');
                this.showAlert('Data synced to cloud successfully', 'success', 'high');
            })
            .catch((error) => {
                console.error('Test write failed:', error);
                this.updateDatabaseStatus('error');
                this.showAlert(`Sync failed: ${error.message}`, 'error', 'high');
            });
    }

    bindEventListeners() {
        // Main navigation tabs
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.getAttribute('data-tab');
                this.switchMainTab(tabName);
            });
        });

        // Analytics navigation
        document.querySelectorAll('.analytics-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.getAttribute('data-analytics');
                this.switchAnalyticsTab(tabName);
            });
        });

        // Slot toggle buttons
        for (let i = 1; i <= 4; i++) {
            const toggleBtn = document.getElementById(`toggle-${i}`);
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleSlot(i));
            }
        }

        // Power request button
        const requestBtn = document.getElementById('request-power-btn');
        if (requestBtn) {
            requestBtn.addEventListener('click', () => this.requestAdditionalPower());
        }

        // Sync data button
        const syncBtn = document.getElementById('sync-data-btn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.manualSync());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                        e.preventDefault();
                        this.toggleSlot(parseInt(e.key));
                        break;
                    case 'p':
                        e.preventDefault();
                        this.simulateScenario('peak-load');
                        break;
                    case 'l':
                        e.preventDefault();
                        this.simulateScenario('load-balancing');
                        break;
                }
            }
        });
    }

    switchMainTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Initialize charts when switching to analytics
        if (tabName === 'analytics') {
            setTimeout(() => {
                this.initializeAnalyticsCharts();
            }, 100);
        }
    }

    switchAnalyticsTab(tabName) {
        // Update analytics navigation
        document.querySelectorAll('.analytics-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-analytics="${tabName}"]`).classList.add('active');

        // Update analytics content
        document.querySelectorAll('.analytics-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentAnalyticsTab = tabName;

        // Initialize specific charts
        setTimeout(() => {
            this.initializeTabCharts(tabName);
        }, 100);
    }

    toggleSlot(slotId) {
        const slot = this.slots[slotId - 1];
        
        if (slot.evConnected) {
            this.disconnectEV(slotId);
        } else {
            this.connectEV(slotId);
        }
    }

    connectEV(slotId) {
        const slot = this.slots[slotId - 1];
        
        // Generate random EV ID
        const evId = `EV-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        
        slot.evConnected = true;
        slot.evId = evId;
        slot.status = 'occupied';
        slot.chargingTime = 0;

        // Start charging timer
        this.chargingTimers[slotId] = setInterval(() => {
            slot.chargingTime++;
            this.updateSlotBilling(); // Update billing every second
            this.updateSlotDisplay(slotId);
        }, 1000);

        this.showAlert(`EV ${evId} connected to Slot ${slotId}`, 'success', 'high');
        
        // Log to database
        this.logEventToDatabase('EV_CONNECTED', {
            slotId: slotId,
            evId: evId,
            timestamp: new Date().toISOString()
        });
        
        // Recalculate power allocation
        this.calculatePowerAllocation();
        this.updateUI();
        
        // Sync to Firebase
        this.syncToFirebase();
    }

    disconnectEV(slotId) {
        const slot = this.slots[slotId - 1];
        const evId = slot.evId;
        
        slot.evConnected = false;
        slot.evId = null;
        slot.status = 'available';
        slot.currentPower = 0;
        slot.chargingTime = 0;

        // Clear charging timer
        if (this.chargingTimers[slotId]) {
            clearInterval(this.chargingTimers[slotId]);
            delete this.chargingTimers[slotId];
        }

        this.showAlert(`EV ${evId} disconnected from Slot ${slotId}`, 'info', 'high');
        
        // Log to database
        this.logEventToDatabase('EV_DISCONNECTED', {
            slotId: slotId,
            evId: evId,
            timestamp: new Date().toISOString()
        });
        
        // Recalculate power allocation
        this.calculatePowerAllocation();
        this.updateUI();
        
        // Sync to Firebase
        this.syncToFirebase();
    }

    calculatePowerAllocation() {
        const connectedSlots = this.slots.filter(slot => slot.evConnected);
        const occupiedCount = connectedSlots.length;

        // Reset all power allocations
        this.slots.forEach(slot => {
            if (!slot.evConnected) {
                slot.currentPower = 0;
                slot.status = 'available';
            }
        });

        if (occupiedCount === 0) {
            this.gridStatus.currentSupply = this.config.baseGridPower;
            this.updateAlgorithmStatus('Equal Distribution Active', 'success');
            return;
        }

        // Calculate total power needed (10kW per slot)
        const totalDemand = occupiedCount * 10; // Each slot needs exactly 10kW
        
        // Check if we need additional power from grid
        if (totalDemand > this.gridStatus.currentSupply && !this.gridStatus.requestInProgress) {
            this.requestAdditionalPower();
        }
        
        // Distribute available power
        const availablePower = this.gridStatus.currentSupply;
        
        if (availablePower >= totalDemand) {
            // Sufficient power - give each slot 10kW
            connectedSlots.forEach(slot => {
                slot.currentPower = 10;
                slot.status = 'charging';
            });
            this.lastNotificationState.loadBalancing = false;
            this.updateAlgorithmStatus('Equal Distribution Active - 10kW per slot', 'success');
            
        } else {
            // Insufficient power - load balancing required
            const powerPerSlot = Math.round((availablePower / occupiedCount) * 10) / 10;
            
            connectedSlots.forEach(slot => {
                slot.currentPower = powerPerSlot;
                slot.status = 'charging';
            });

            // Only show load balancing alert if state changed
            if (!this.lastNotificationState.loadBalancing || this.lastNotificationState.occupiedCount !== occupiedCount) {
                this.showAlert(`Load balancing active: ${powerPerSlot.toFixed(1)}kW per slot (Target: 10kW)`, 'warning', 'high');
                this.lastNotificationState.loadBalancing = true;
                this.lastNotificationState.occupiedCount = occupiedCount;
            }
            this.updateAlgorithmStatus(`Load Balancing Active - ${powerPerSlot.toFixed(1)}kW per slot`, 'warning');
        }
        
        // Update billing for all connected slots
        this.updateSlotBilling();
    }

    // Update billing information for all slots
    updateSlotBilling() {
        this.slots.forEach(slot => {
            if (slot.evConnected && slot.currentPower > 0) {
                // Calculate energy consumed (kWh) = power (kW) × time (hours)
                const timeInHours = slot.chargingTime / 3600; // Convert seconds to hours
                slot.billing.energyConsumed = slot.currentPower * timeInHours;
                
                // Calculate costs
                slot.billing.dynamicCost = slot.billing.energyConsumed * slot.billing.dynamicRate;
                slot.billing.normalCost = slot.billing.energyConsumed * slot.billing.normalRate;
                
                // Calculate savings
                slot.billing.savings = slot.billing.normalCost - slot.billing.dynamicCost;
                
                // Calculate power savings (difference from 10kW)
                slot.billing.powerSaved = Math.max(0, 10 - slot.currentPower);
                slot.billing.powerSavingsPercent = (slot.billing.powerSaved / 10) * 100;
            } else {
                // Reset billing for disconnected slots
                slot.billing.energyConsumed = 0;
                slot.billing.dynamicCost = 0;
                slot.billing.normalCost = 0;
                slot.billing.savings = 0;
                slot.billing.powerSaved = 0;
                slot.billing.powerSavingsPercent = 0;
            }
        });
    }

    updateAlgorithmStatus(text, type) {
        const statusElement = document.getElementById('algorithm-status');
        if (statusElement) {
            statusElement.textContent = text;
            statusElement.className = `algorithm-status ${type}`;
        }
    }

    async requestAdditionalPower() {
        if (this.gridStatus.requestInProgress) return;

        const connectedSlots = this.slots.filter(slot => slot.evConnected);
        const occupiedCount = connectedSlots.length;
        const requiredPower = occupiedCount * 10; // 10kW per slot
        
        if (requiredPower <= this.gridStatus.currentSupply) return;

        this.gridStatus.requestInProgress = true;
        this.systemStats.gridRequests++;
        
        // Update UI to show request in progress
        const requestBtn = document.getElementById('request-power-btn');
        if (requestBtn) {
            requestBtn.textContent = 'Requesting...';
            requestBtn.classList.add('requesting-power');
            requestBtn.disabled = true;
        }

        const additionalNeeded = requiredPower - this.gridStatus.currentSupply;
        this.showAlert(`Requesting ${additionalNeeded.toFixed(1)}kW for ${occupiedCount} slots (10kW each)`, 'info', 'high');

        // Simulate grid communication delay
        await new Promise(resolve => setTimeout(resolve, this.config.powerRequestDelay));

        // Grant additional power (simulate grid response)
        const additionalPower = Math.min(additionalNeeded, 
                                       this.config.maxGridPower - this.gridStatus.currentSupply);
        
        this.gridStatus.currentSupply += additionalPower;
        this.gridStatus.requestInProgress = false;

        // Reset button
        if (requestBtn) {
            requestBtn.textContent = 'Request Additional Power';
            requestBtn.classList.remove('requesting-power');
        }

        if (additionalPower >= additionalNeeded) {
            this.showAlert(`Full power granted: +${additionalPower.toFixed(1)}kW (Total: ${this.gridStatus.currentSupply}kW)`, 'success', 'high');
        } else {
            this.showAlert(`Partial power granted: +${additionalPower.toFixed(1)}kW (Total: ${this.gridStatus.currentSupply}kW) - Load balancing required`, 'warning', 'high');
        }

        // Log to database
        this.logEventToDatabase('POWER_REQUEST', {
            additionalPower: additionalPower,
            totalSupply: this.gridStatus.currentSupply,
            occupiedSlots: occupiedCount,
            timestamp: new Date().toISOString()
        });

        // Recalculate power allocation with new supply
        this.calculatePowerAllocation();
        this.updateUI();
        
        // Sync to Firebase
        this.syncToFirebase();
    }

    updateUI() {
        this.updateDashboard();
        this.updateControlPanel();
        this.updateSlotDisplays();
        this.updateCharts();
    }

    updateDashboard() {
        // Update dashboard metrics
        const activeSlots = this.slots.filter(slot => slot.evConnected).length;
        const totalDemand = this.slots.reduce((sum, slot) => sum + slot.currentPower, 0);
        const occupancyRate = (activeSlots / this.config.totalSlots) * 100;
        const efficiency = totalDemand > 0 ? (totalDemand / (activeSlots * this.config.slotCapacity)) * 100 : 100;

        // Update dashboard cards
        this.updateElement('dashboard-grid-power', this.gridStatus.currentSupply);
        this.updateElement('dashboard-active-slots', activeSlots);
        this.updateElement('dashboard-occupancy', `${occupancyRate.toFixed(0)}% occupied`);
        this.updateElement('dashboard-efficiency', efficiency.toFixed(0));
        
        // Update grid status
        const gridStatusEl = document.getElementById('dashboard-grid-status');
        if (gridStatusEl) {
            if (this.gridStatus.currentSupply >= this.config.maxGridPower) {
                gridStatusEl.textContent = 'Maximum';
                gridStatusEl.className = 'metric-status warning';
            } else if (totalDemand > this.gridStatus.currentSupply) {
                gridStatusEl.textContent = 'Deficit';
                gridStatusEl.className = 'metric-status error';
            } else {
                gridStatusEl.textContent = 'Normal';
                gridStatusEl.className = 'metric-status';
            }
        }

        // Update efficiency status
        const efficiencyStatusEl = document.getElementById('dashboard-efficiency-status');
        if (efficiencyStatusEl) {
            if (efficiency >= 90) {
                efficiencyStatusEl.textContent = 'Optimal';
                efficiencyStatusEl.className = 'metric-status positive';
            } else if (efficiency >= 70) {
                efficiencyStatusEl.textContent = 'Good';
                efficiencyStatusEl.className = 'metric-status';
            } else {
                efficiencyStatusEl.textContent = 'Needs Optimization';
                efficiencyStatusEl.className = 'metric-status warning';
            }
        }
    }

    updateControlPanel() {
        // Update grid metrics
        const additionalPower = this.gridStatus.currentSupply - this.config.baseGridPower;
        const totalDemand = this.slots.reduce((sum, slot) => sum + slot.currentPower, 0);

        this.updateElement('additional-supply', additionalPower);
        this.updateElement('total-supply', this.gridStatus.currentSupply);
        this.updateElement('current-demand', totalDemand.toFixed(1));

        // Update grid utilization bar
        const utilizationPercentage = (this.gridStatus.currentSupply / this.gridStatus.maxSupply) * 100;
        const utilizationBar = document.getElementById('grid-utilization-bar');
        if (utilizationBar) {
            utilizationBar.style.width = `${utilizationPercentage}%`;
        }

        // Update request button
        const requestBtn = document.getElementById('request-power-btn');
        if (requestBtn && !this.gridStatus.requestInProgress) {
            const needsAdditionalPower = totalDemand > this.gridStatus.currentSupply && 
                                       this.gridStatus.currentSupply < this.config.maxGridPower;
            requestBtn.disabled = !needsAdditionalPower;
        }
    }

    updateSlotDisplays() {
        for (let i = 1; i <= 4; i++) {
            this.updateSlotDisplay(i);
        }
    }

    updateSlotDisplay(slotId) {
        const slot = this.slots[slotId - 1];
        
        // Update slot card status
        const slotCard = document.querySelector(`[data-slot-id="${slotId}"]`);
        if (slotCard) {
            slotCard.setAttribute('data-status', slot.status);
        }

        // Update status indicator
        const statusElement = document.getElementById(`status-${slotId}`);
        if (statusElement) {
            statusElement.textContent = slot.status.charAt(0).toUpperCase() + slot.status.slice(1);
            statusElement.className = `slot-status ${slot.status}`;
        }

        // Update toggle button
        const toggleBtn = document.getElementById(`toggle-${slotId}`);
        if (toggleBtn) {
            if (slot.evConnected) {
                toggleBtn.textContent = 'Disconnect EV';
                toggleBtn.className = 'btn btn-slot connected';
            } else {
                toggleBtn.textContent = 'Connect EV';
                toggleBtn.className = 'btn btn-slot';
            }
        }

        // Update power allocation
        this.updateElement(`power-${slotId}`, slot.currentPower.toFixed(1));
        
        // Update progress bar
        const progressBar = document.getElementById(`progress-${slotId}`);
        if (progressBar) {
            const progressPercentage = (slot.currentPower / slot.maxPower) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            
            if (slot.status === 'charging') {
                progressBar.classList.add('charging');
            } else {
                progressBar.classList.remove('charging');
            }
        }

        // Update EV details
        const evDetails = document.getElementById(`ev-details-${slotId}`);
        if (evDetails) {
            if (slot.evConnected) {
                evDetails.style.display = 'block';
                this.updateElement(`ev-id-${slotId}`, slot.evId);
                
                const minutes = Math.floor(slot.chargingTime / 60);
                const seconds = slot.chargingTime % 60;
                this.updateElement(`charging-time-${slotId}`, 
                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                
                // Update billing information
                this.updateElement(`energy-${slotId}`, `${slot.billing.energyConsumed.toFixed(2)} kWh`);
                this.updateElement(`dynamic-cost-${slotId}`, `₹${slot.billing.dynamicCost.toFixed(2)}`);
                this.updateElement(`normal-cost-${slotId}`, `₹${slot.billing.normalCost.toFixed(2)}`);
                this.updateElement(`savings-${slotId}`, `₹${slot.billing.savings.toFixed(2)}`);
                this.updateElement(`power-saved-${slotId}`, `${slot.billing.powerSaved.toFixed(1)} kW (${slot.billing.powerSavingsPercent.toFixed(1)}%)`);
            } else {
                evDetails.style.display = 'none';
            }
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateCharts() {
        this.updateRealTimePowerChart();
    }

    startRealTimeUpdates() {
        // Update current time
        this.updateCurrentTime();
        
        // Update UI every second
        this.updateTimer = setInterval(() => {
            this.updateCurrentTime();
            this.simulateRealTimeData();
            this.updateUI();
        }, this.config.updateInterval);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        this.updateElement('last-update', timeString);
        this.updateElement('footer-time', timeString);
    }

    simulateRealTimeData() {
        // Small variations in slot demands to simulate real conditions
        this.slots.forEach(slot => {
            if (slot.evConnected) {
                // Add small random variation to demand
                const variation = (Math.random() - 0.5) * 0.3;
                slot.demand = Math.max(6, Math.min(10, slot.demand + variation));
            }
        });

        // Recalculate if needed
        if (this.slots.some(slot => slot.evConnected)) {
            this.calculatePowerAllocation();
        }
    }

    // Chart initialization methods
    initializeCharts() {
        // Set global chart defaults for better visibility in light theme
        Chart.defaults.color = '#374151';
        Chart.defaults.borderColor = '#d1d5db';
        Chart.defaults.backgroundColor = 'rgba(55, 65, 81, 0.1)';
        
        this.createRealTimePowerChart();
        this.createDailyUsageChart();
    }

    initializeAnalyticsCharts() {
        this.createDailyPatternChart();
        this.createEfficiencyComparisonChart();
    }

    initializeTabCharts(tabName) {
        switch (tabName) {
            case 'cost':
                this.createCostChart();
                this.createSavingsBreakdownChart();
                break;
            case 'efficiency':
                this.createPowerChart();
                this.createEfficiencyChart();
                break;
            case 'predictive':
                this.createForecastChart();
                break;
        }
    }

    createRealTimePowerChart() {
        const ctx = document.getElementById('realTimePowerChart');
        if (!ctx) return;

        if (this.charts.realTimePower) {
            this.charts.realTimePower.destroy();
        }

        this.charts.realTimePower = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Available'],
                datasets: [{
                    data: [0, 0, 0, 0, 40],
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.success,
                        this.colors.warning,
                        this.colors.purple,
                        '#cbd5e0'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                family: 'Inter',
                                size: 12
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed} kW`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateRealTimePowerChart() {
        if (!this.charts.realTimePower) return;

        const totalUsed = this.slots.reduce((sum, slot) => sum + slot.currentPower, 0);
        const data = [
            this.slots[0].currentPower,
            this.slots[1].currentPower,
            this.slots[2].currentPower,
            this.slots[3].currentPower,
            Math.max(0, 40 - totalUsed)
        ];

        this.charts.realTimePower.data.datasets[0].data = data;
        this.charts.realTimePower.update('none');
    }

    createDailyUsageChart() {
        const ctx = document.getElementById('dailyUsageChart');
        if (!ctx) return;

        if (this.charts.dailyUsage) {
            this.charts.dailyUsage.destroy();
        }

        const hours = this.analyticsData.hourly.map(h => `${h.hour}:00`);
        const occupancy = this.analyticsData.hourly.map(h => h.avg_occupancy);

        this.charts.dailyUsage = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Average Occupancy',
                    data: occupancy,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '30',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4,
                        title: {
                            display: true,
                            text: 'Slots Occupied'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createDailyPatternChart() {
        const ctx = document.getElementById('dailyPatternChart');
        if (!ctx) return;

        if (this.charts.dailyPattern) {
            this.charts.dailyPattern.destroy();
        }

        const hours = this.analyticsData.hourly.map(h => `${h.hour}:00`);
        const occupancy = this.analyticsData.hourly.map(h => h.avg_occupancy);
        const power = this.analyticsData.hourly.map(h => h.avg_power);

        this.charts.dailyPattern = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [
                    {
                        label: 'Average Occupancy',
                        data: occupancy,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '30',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y',
                        pointBackgroundColor: this.colors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Power Usage (kW)',
                        data: power,
                        borderColor: this.colors.warning,
                        backgroundColor: this.colors.warning + '30',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1',
                        pointBackgroundColor: this.colors.warning,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Occupancy (slots)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Power (kW)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    createEfficiencyComparisonChart() {
        const ctx = document.getElementById('efficiencyComparisonChart');
        if (!ctx) return;

        if (this.charts.efficiencyComparison) {
            this.charts.efficiencyComparison.destroy();
        }

        this.charts.efficiencyComparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dynamic System', 'Static System'],
                datasets: [{
                    label: 'System Efficiency (%)',
                    data: [83.8, 53.6],
                    backgroundColor: [this.colors.success, this.colors.error],
                    borderColor: [this.colors.success, this.colors.error],
                    borderWidth: 2,
                    borderRadius: 12,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Efficiency (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx) return;

        if (this.charts.cost) {
            this.charts.cost.destroy();
        }

        const days = this.analyticsData.daily.slice(0, 15).map(d => `Day ${d.day}`);
        const dynamicCosts = this.analyticsData.daily.slice(0, 15).map(d => d.dynamic_cost);
        const staticCosts = this.analyticsData.daily.slice(0, 15).map(d => d.static_cost);

        this.charts.cost = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Dynamic System Cost',
                        data: dynamicCosts,
                        borderColor: this.colors.success,
                        backgroundColor: this.colors.success + '30',
                        borderWidth: 4,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: this.colors.success,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: 'Static System Cost',
                        data: staticCosts,
                        borderColor: this.colors.error,
                        backgroundColor: this.colors.error + '30',
                        borderWidth: 4,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: this.colors.error,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cost (₹)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
    }

    createSavingsBreakdownChart() {
        const ctx = document.getElementById('savingsBreakdownChart');
        if (!ctx) return;

        if (this.charts.savingsBreakdown) {
            this.charts.savingsBreakdown.destroy();
        }

        this.charts.savingsBreakdown = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Load Balancing', 'Peak Shaving', 'Demand Response', 'Efficiency Gains'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.success,
                        this.colors.warning,
                        this.colors.purple
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    createPowerChart() {
        const ctx = document.getElementById('powerChart');
        if (!ctx) return;

        if (this.charts.power) {
            this.charts.power.destroy();
        }

        const days = this.analyticsData.daily.slice(0, 15).map(d => `Day ${d.day}`);
        const dynamicPower = this.analyticsData.daily.slice(0, 15).map(d => d.dynamic_power_used);
        const staticPower = this.analyticsData.daily.slice(0, 15).map(d => d.static_power_used);

        this.charts.power = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Dynamic System (kWh)',
                        data: dynamicPower,
                        backgroundColor: this.colors.success,
                        borderColor: this.colors.success,
                        borderWidth: 2,
                        borderRadius: 8
                    },
                    {
                        label: 'Static System (kWh)',
                        data: staticPower,
                        backgroundColor: this.colors.error,
                        borderColor: this.colors.error,
                        borderWidth: 2,
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Power Consumption (kWh)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    createEfficiencyChart() {
        const ctx = document.getElementById('efficiencyChart');
        if (!ctx) return;

        if (this.charts.efficiency) {
            this.charts.efficiency.destroy();
        }

        const days = this.analyticsData.daily.slice(0, 15).map(d => `Day ${d.day}`);
        const dynamicEfficiency = this.analyticsData.daily.slice(0, 15).map(d => d.dynamic_efficiency);
        const staticEfficiency = this.analyticsData.daily.slice(0, 15).map(d => d.static_efficiency);

        this.charts.efficiency = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Dynamic System Efficiency',
                        data: dynamicEfficiency,
                        borderColor: this.colors.success,
                        backgroundColor: this.colors.success + '30',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.colors.success,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: 'Static System Efficiency',
                        data: staticEfficiency,
                        borderColor: this.colors.error,
                        backgroundColor: this.colors.error + '30',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.colors.error,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Efficiency (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    createForecastChart() {
        const ctx = document.getElementById('forecastChart');
        if (!ctx) return;

        if (this.charts.forecast) {
            this.charts.forecast.destroy();
        }

        // Generate forecast data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const historicalSavings = [1200, 1350, 1426, 1480, 1520, 1580];
        const forecastSavings = [1650, 1720, 1800, 1890, 1980, 2100];

        this.charts.forecast = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Historical Savings',
                        data: historicalSavings,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '30',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.colors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    },
                    {
                        label: 'Projected Savings',
                        data: forecastSavings,
                        borderColor: this.colors.success,
                        backgroundColor: this.colors.success + '30',
                        borderWidth: 4,
                        borderDash: [8, 4],
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.colors.success,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Monthly Savings ($)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // Simulation methods
    simulateScenario(scenario) {
        switch (scenario) {
            case 'peak-load':
                this.showAlert('Peak load simulation started', 'info', 'high');
                setTimeout(() => this.connectEV(1), 500);
                setTimeout(() => this.connectEV(2), 1000);
                setTimeout(() => this.connectEV(3), 1500);
                setTimeout(() => this.connectEV(4), 2000);
                break;
                
            case 'load-balancing':
                this.showAlert('Load balancing simulation started', 'info', 'high');
                setTimeout(() => this.connectEV(1), 500);
                setTimeout(() => this.connectEV(2), 1000);
                setTimeout(() => this.connectEV(3), 1500);
                break;
        }
    }

    // Utility methods
    formatCurrency(amount) {
        // Format number in Indian currency format (₹1,23,456)
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showAlert(message, type = 'info', priority = 'normal') {
        // Only show high priority alerts to reduce notification spam
        if (priority !== 'high' && type === 'info') return;
        
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;
        
        // Limit to maximum 3 alerts at once
        const existingAlerts = alertContainer.children;
        if (existingAlerts.length >= 3) {
            alertContainer.removeChild(existingAlerts[0]);
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert--${type}`;
        alert.textContent = message;
        
        alertContainer.appendChild(alert);
        
        // Auto-remove alert after 3 seconds for better UX
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            slots: this.slots,
            gridStatus: this.gridStatus,
            systemStats: this.systemStats,
            analyticsData: this.analyticsData
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ev-power-management-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showAlert('Data exported successfully', 'success', 'high');
    }

    // Data generation methods
    generateDailyData() {
        const data = [];
        for (let day = 1; day <= 30; day++) {
            const occupancy = 1.5 + Math.random() * 1.5; // 1.5-3 slots average
            const dynamicPowerUsed = 400 + Math.random() * 200;
            const dynamicPowerSupplied = dynamicPowerUsed * (1 + Math.random() * 0.3);
            const staticPowerSupplied = 960; // Fixed static supply
            const dynamicCost = dynamicPowerSupplied * 7.2; // ₹7.2 per kWh (0.09 USD * 80)
            const staticCost = 8448; // ₹105.6 * 80
            const dynamicEfficiency = (dynamicPowerUsed / dynamicPowerSupplied) * 100;
            const staticEfficiency = (dynamicPowerUsed / staticPowerSupplied) * 100;
            const costSavings = staticCost - dynamicCost;
            const costSavingsPct = (costSavings / staticCost) * 100;

            data.push({
                day,
                dynamic_power_used: Math.round(dynamicPowerUsed),
                dynamic_power_supplied: Math.round(dynamicPowerSupplied),
                dynamic_cost: Math.round(dynamicCost * 10) / 10,
                static_power_used: Math.round(dynamicPowerUsed),
                static_power_supplied: staticPowerSupplied,
                static_cost: staticCost,
                occupancy: Math.round(occupancy * 100) / 100,
                dynamic_efficiency: Math.round(dynamicEfficiency * 10) / 10,
                static_efficiency: Math.round(staticEfficiency * 10) / 10,
                cost_savings: Math.round(costSavings * 10) / 10,
                cost_savings_pct: Math.round(costSavingsPct * 10) / 10
            });
        }
        return data;
    }

    generateHourlyData() {
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            let occupancy, power;
            
            // Simulate realistic usage patterns
            if (hour >= 7 && hour <= 9) { // Morning peak
                occupancy = 2.5 + Math.random() * 1.5;
            } else if (hour >= 11 && hour <= 13) { // Lunch peak
                occupancy = 3 + Math.random() * 1;
            } else if (hour >= 17 && hour <= 19) { // Evening peak
                occupancy = 2.8 + Math.random() * 1.2;
            } else if (hour >= 22 || hour <= 5) { // Night
                occupancy = 0.3 + Math.random() * 0.7;
            } else { // Regular hours
                occupancy = 1.5 + Math.random() * 1;
            }
            
            power = occupancy * 10; // Approximate power usage
            
            data.push({
                hour,
                avg_occupancy: Math.round(occupancy * 10) / 10,
                avg_power: Math.round(power)
            });
        }
        return data;
    }

    // Database Integration Methods
    configureDatabase(url, apiKey) {
        this.dbConfig = {
            url: url,
            apiKey: apiKey,
            enabled: true
        };
        this.showAlert('Database connection configured successfully', 'success', 'high');
        console.log('Database configured:', { url: url.substring(0, 30) + '...', apiKey: apiKey.substring(0, 10) + '...' });
    }

    async syncToDatabase(data) {
        if (!this.dbConfig.enabled) {
            console.log('Database not configured, skipping sync');
            return;
        }

        try {
            const response = await fetch(this.dbConfig.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.dbConfig.apiKey}`,
                    'X-API-Key': this.dbConfig.apiKey
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    data: data
                })
            });

            if (response.ok) {
                console.log('Data synced to database successfully');
            } else {
                console.error('Database sync failed:', response.statusText);
            }
        } catch (error) {
            console.error('Database sync error:', error);
        }
    }

    async fetchFromDatabase() {
        if (!this.dbConfig.enabled) {
            console.log('Database not configured, using local data');
            return null;
        }

        try {
            const response = await fetch(this.dbConfig.url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.dbConfig.apiKey}`,
                    'X-API-Key': this.dbConfig.apiKey
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Data fetched from database successfully');
                return data;
            } else {
                console.error('Database fetch failed:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Database fetch error:', error);
            return null;
        }
    }

    // Auto-sync important events to database
    async logEventToDatabase(eventType, eventData) {
        const logData = {
            eventType: eventType,
            eventData: eventData,
            systemState: {
                slots: this.slots,
                gridStatus: this.gridStatus,
                systemStats: this.systemStats
            }
        };

        await this.syncToDatabase(logData);
    }

    // Cleanup method
    destroy() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        Object.values(this.chargingTimers).forEach(timer => {
            clearInterval(timer);
        });
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const powerSystem = new EVPowerManagementSystem();
    
    // Make it available globally for debugging and external access
    window.powerSystem = powerSystem;
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        powerSystem.destroy();
    });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EVPowerManagementSystem;
}