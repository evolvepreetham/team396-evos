// EV Charging Power Management & Analytics System
class EVChargingSystem {
    constructor() {
        // System configuration
        this.config = {
            baseGridPower: 20, // kW
            maxSlotPower: 10, // kW per slot
            totalSlots: 4,
            updateInterval: 5000 // 5 seconds
        };

        // Charging slots state
        this.slots = {
            1: { occupied: false, power: 0, demand: 8 },
            2: { occupied: false, power: 0, demand: 9 },
            3: { occupied: false, power: 0, demand: 7 },
            4: { occupied: false, power: 0, demand: 8.5 }
        };

        // Analytics data from JSON
        this.analyticsData = {
            kpi: {
                total_cost_savings: 1426,
                savings_percentage: 45.0,
                power_reduction: 10380,
                power_reduction_pct: 36.0,
                dynamic_efficiency: 83.8,
                static_efficiency: 53.6,
                total_dynamic_cost: 1742,
                total_static_cost: 3168
            },
            daily: [
                {"day": 1, "dynamic_power_used": 480, "dynamic_power_supplied": 600, "dynamic_cost": 55.8, "static_power_used": 480, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.0, "dynamic_efficiency": 80.0, "static_efficiency": 50.0, "cost_savings": 49.8, "cost_savings_pct": 47.2},
                {"day": 2, "dynamic_power_used": 490, "dynamic_power_supplied": 610, "dynamic_cost": 57.0, "static_power_used": 490, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.04, "dynamic_efficiency": 80.3, "static_efficiency": 51.0, "cost_savings": 48.6, "cost_savings_pct": 46.0},
                {"day": 3, "dynamic_power_used": 510, "dynamic_power_supplied": 600, "dynamic_cost": 55.8, "static_power_used": 510, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.12, "dynamic_efficiency": 85.0, "static_efficiency": 53.1, "cost_savings": 49.8, "cost_savings_pct": 47.2},
                {"day": 4, "dynamic_power_used": 510, "dynamic_power_supplied": 600, "dynamic_cost": 57.6, "static_power_used": 510, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.12, "dynamic_efficiency": 85.0, "static_efficiency": 53.1, "cost_savings": 48.0, "cost_savings_pct": 45.5},
                {"day": 5, "dynamic_power_used": 530, "dynamic_power_supplied": 640, "dynamic_cost": 62.2, "static_power_used": 530, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.21, "dynamic_efficiency": 82.8, "static_efficiency": 55.2, "cost_savings": 43.4, "cost_savings_pct": 41.1},
                {"day": 6, "dynamic_power_used": 530, "dynamic_power_supplied": 630, "dynamic_cost": 60.2, "static_power_used": 530, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.21, "dynamic_efficiency": 84.1, "static_efficiency": 55.2, "cost_savings": 45.4, "cost_savings_pct": 43.0},
                {"day": 7, "dynamic_power_used": 480, "dynamic_power_supplied": 610, "dynamic_cost": 58.0, "static_power_used": 480, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.0, "dynamic_efficiency": 78.7, "static_efficiency": 50.0, "cost_savings": 47.6, "cost_savings_pct": 45.1},
                {"day": 8, "dynamic_power_used": 510, "dynamic_power_supplied": 610, "dynamic_cost": 57.6, "static_power_used": 510, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.12, "dynamic_efficiency": 83.6, "static_efficiency": 53.1, "cost_savings": 48.0, "cost_savings_pct": 45.5},
                {"day": 9, "dynamic_power_used": 490, "dynamic_power_supplied": 600, "dynamic_cost": 56.2, "static_power_used": 490, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.04, "dynamic_efficiency": 81.7, "static_efficiency": 51.0, "cost_savings": 49.4, "cost_savings_pct": 46.8},
                {"day": 10, "dynamic_power_used": 490, "dynamic_power_supplied": 590, "dynamic_cost": 54.8, "static_power_used": 490, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.04, "dynamic_efficiency": 83.1, "static_efficiency": 51.0, "cost_savings": 50.8, "cost_savings_pct": 48.1},
                {"day": 11, "dynamic_power_used": 600, "dynamic_power_supplied": 660, "dynamic_cost": 64.6, "static_power_used": 600, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.5, "dynamic_efficiency": 90.9, "static_efficiency": 62.5, "cost_savings": 41.0, "cost_savings_pct": 38.8},
                {"day": 12, "dynamic_power_used": 560, "dynamic_power_supplied": 660, "dynamic_cost": 63.0, "static_power_used": 560, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.33, "dynamic_efficiency": 84.8, "static_efficiency": 58.3, "cost_savings": 42.6, "cost_savings_pct": 40.3},
                {"day": 13, "dynamic_power_used": 470, "dynamic_power_supplied": 600, "dynamic_cost": 57.4, "static_power_used": 470, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 1.96, "dynamic_efficiency": 78.3, "static_efficiency": 49.0, "cost_savings": 48.2, "cost_savings_pct": 45.6},
                {"day": 14, "dynamic_power_used": 490, "dynamic_power_supplied": 590, "dynamic_cost": 54.6, "static_power_used": 490, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.04, "dynamic_efficiency": 83.1, "static_efficiency": 51.0, "cost_savings": 51.0, "cost_savings_pct": 48.3},
                {"day": 15, "dynamic_power_used": 500, "dynamic_power_supplied": 600, "dynamic_cost": 56.2, "static_power_used": 500, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.08, "dynamic_efficiency": 83.3, "static_efficiency": 52.1, "cost_savings": 49.4, "cost_savings_pct": 46.8},
                {"day": 16, "dynamic_power_used": 470, "dynamic_power_supplied": 590, "dynamic_cost": 54.4, "static_power_used": 470, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 1.96, "dynamic_efficiency": 79.7, "static_efficiency": 49.0, "cost_savings": 51.2, "cost_savings_pct": 48.5},
                {"day": 17, "dynamic_power_used": 580, "dynamic_power_supplied": 660, "dynamic_cost": 64.2, "static_power_used": 580, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.42, "dynamic_efficiency": 87.9, "static_efficiency": 60.4, "cost_savings": 41.4, "cost_savings_pct": 39.2},
                {"day": 18, "dynamic_power_used": 530, "dynamic_power_supplied": 610, "dynamic_cost": 58.2, "static_power_used": 530, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.21, "dynamic_efficiency": 86.9, "static_efficiency": 55.2, "cost_savings": 47.4, "cost_savings_pct": 44.9},
                {"day": 19, "dynamic_power_used": 510, "dynamic_power_supplied": 630, "dynamic_cost": 60.0, "static_power_used": 510, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.12, "dynamic_efficiency": 81.0, "static_efficiency": 53.1, "cost_savings": 45.6, "cost_savings_pct": 43.2},
                {"day": 20, "dynamic_power_used": 520, "dynamic_power_supplied": 660, "dynamic_cost": 63.6, "static_power_used": 520, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.17, "dynamic_efficiency": 78.8, "static_efficiency": 54.2, "cost_savings": 42.0, "cost_savings_pct": 39.8},
                {"day": 21, "dynamic_power_used": 550, "dynamic_power_supplied": 620, "dynamic_cost": 59.8, "static_power_used": 550, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.29, "dynamic_efficiency": 88.7, "static_efficiency": 57.3, "cost_savings": 45.8, "cost_savings_pct": 43.4},
                {"day": 22, "dynamic_power_used": 590, "dynamic_power_supplied": 670, "dynamic_cost": 65.8, "static_power_used": 590, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.46, "dynamic_efficiency": 88.1, "static_efficiency": 61.5, "cost_savings": 39.8, "cost_savings_pct": 37.7},
                {"day": 23, "dynamic_power_used": 620, "dynamic_power_supplied": 650, "dynamic_cost": 63.4, "static_power_used": 620, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.58, "dynamic_efficiency": 95.4, "static_efficiency": 64.6, "cost_savings": 42.2, "cost_savings_pct": 40.0},
                {"day": 24, "dynamic_power_used": 520, "dynamic_power_supplied": 600, "dynamic_cost": 57.0, "static_power_used": 520, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.17, "dynamic_efficiency": 86.7, "static_efficiency": 54.2, "cost_savings": 48.6, "cost_savings_pct": 46.0},
                {"day": 25, "dynamic_power_used": 470, "dynamic_power_supplied": 560, "dynamic_cost": 51.2, "static_power_used": 470, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 1.96, "dynamic_efficiency": 83.9, "static_efficiency": 49.0, "cost_savings": 54.4, "cost_savings_pct": 51.5},
                {"day": 26, "dynamic_power_used": 440, "dynamic_power_supplied": 590, "dynamic_cost": 54.0, "static_power_used": 440, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 1.83, "dynamic_efficiency": 74.6, "static_efficiency": 45.8, "cost_savings": 51.6, "cost_savings_pct": 48.9},
                {"day": 27, "dynamic_power_used": 470, "dynamic_power_supplied": 580, "dynamic_cost": 52.4, "static_power_used": 470, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 1.96, "dynamic_efficiency": 81.0, "static_efficiency": 49.0, "cost_savings": 53.2, "cost_savings_pct": 50.4},
                {"day": 28, "dynamic_power_used": 470, "dynamic_power_supplied": 540, "dynamic_cost": 46.4, "static_power_used": 470, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 1.96, "dynamic_efficiency": 87.0, "static_efficiency": 49.0, "cost_savings": 59.2, "cost_savings_pct": 56.1},
                {"day": 29, "dynamic_power_used": 540, "dynamic_power_supplied": 630, "dynamic_cost": 59.6, "static_power_used": 540, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.25, "dynamic_efficiency": 85.7, "static_efficiency": 56.2, "cost_savings": 46.0, "cost_savings_pct": 43.6},
                {"day": 30, "dynamic_power_used": 520, "dynamic_power_supplied": 630, "dynamic_cost": 61.0, "static_power_used": 520, "static_power_supplied": 960, "static_cost": 105.6, "occupancy": 2.17, "dynamic_efficiency": 82.5, "static_efficiency": 54.2, "cost_savings": 44.6, "cost_savings_pct": 42.2}
            ],
            hourly: [
                {"hour": 0, "avg_occupancy": 0.5, "avg_power": 15},
                {"hour": 1, "avg_occupancy": 1.2, "avg_power": 18},
                {"hour": 2, "avg_occupancy": 0.8, "avg_power": 16},
                {"hour": 3, "avg_occupancy": 0.6, "avg_power": 15},
                {"hour": 4, "avg_occupancy": 0.4, "avg_power": 14},
                {"hour": 5, "avg_occupancy": 0.3, "avg_power": 13},
                {"hour": 6, "avg_occupancy": 1.1, "avg_power": 17},
                {"hour": 7, "avg_occupancy": 3.2, "avg_power": 32},
                {"hour": 8, "avg_occupancy": 2.8, "avg_power": 28},
                {"hour": 9, "avg_occupancy": 2.5, "avg_power": 25},
                {"hour": 10, "avg_occupancy": 1.8, "avg_power": 20},
                {"hour": 11, "avg_occupancy": 3.5, "avg_power": 35},
                {"hour": 12, "avg_occupancy": 3.8, "avg_power": 38},
                {"hour": 13, "avg_occupancy": 2.2, "avg_power": 22},
                {"hour": 14, "avg_occupancy": 2.1, "avg_power": 21},
                {"hour": 15, "avg_occupancy": 2.3, "avg_power": 23},
                {"hour": 16, "avg_occupancy": 2.4, "avg_power": 24},
                {"hour": 17, "avg_occupancy": 3.1, "avg_power": 31},
                {"hour": 18, "avg_occupancy": 3.0, "avg_power": 30},
                {"hour": 19, "avg_occupancy": 2.0, "avg_power": 20},
                {"hour": 20, "avg_occupancy": 2.8, "avg_power": 28},
                {"hour": 21, "avg_occupancy": 1.9, "avg_power": 19},
                {"hour": 22, "avg_occupancy": 1.7, "avg_power": 17},
                {"hour": 23, "avg_occupancy": 0.8, "avg_power": 16}
            ]
        };

        // Chart colors
        this.colors = {
            primary: '#1FB8CD',
            secondary: '#FFC185',
            tertiary: '#B4413C',
            quaternary: '#ECEBD5',
            success: '#5D878F',
            warning: '#DB4545',
            info: '#D2BA4C'
        };

        this.charts = {};
        this.updateTimer = null;
    }

    init() {
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.initializeCharts();
        this.updateCurrentTime();
        this.calculatePowerAllocation();
    }

    setupEventListeners() {
        // Tab navigation - fixed event listener
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Analytics navigation - fixed event listener
        document.querySelectorAll('.analytics-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const analyticsTab = btn.getAttribute('data-analytics');
                this.switchAnalyticsTab(analyticsTab);
            });
        });

        // Charging slot toggles - fixed event listener
        document.querySelectorAll('.slot-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const slotElement = btn.closest('.charging-slot');
                const slotId = slotElement.getAttribute('data-slot');
                this.toggleSlot(slotId);
            });
        });

        // Also make entire slot clickable
        document.querySelectorAll('.charging-slot').forEach(slot => {
            slot.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (e.target.classList.contains('slot-toggle')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                const slotId = slot.getAttribute('data-slot');
                this.toggleSlot(slotId);
            });
        });
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Initialize charts when switching to analytics
        if (tabName === 'analytics') {
            setTimeout(() => {
                this.initializeAnalyticsCharts();
            }, 100);
        }
    }

    switchAnalyticsTab(tabName) {
        console.log('Switching to analytics tab:', tabName);
        
        // Update analytics tab buttons
        document.querySelectorAll('.analytics-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-analytics="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update analytics content
        document.querySelectorAll('.analytics-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Initialize specific charts based on tab
        setTimeout(() => {
            this.initializeTabCharts(tabName);
        }, 100);
    }

    toggleSlot(slotId) {
        console.log('Toggling slot:', slotId);
        
        const slot = this.slots[slotId];
        const slotElement = document.querySelector(`[data-slot="${slotId}"]`);
        
        if (!slot || !slotElement) {
            console.error('Slot not found:', slotId);
            return;
        }
        
        slot.occupied = !slot.occupied;
        
        const statusElement = slotElement.querySelector('.slot-status');
        const toggleButton = slotElement.querySelector('.slot-toggle');
        
        if (slot.occupied) {
            slotElement.classList.add('occupied');
            statusElement.textContent = 'Occupied';
            statusElement.classList.add('occupied');
            toggleButton.textContent = 'Disconnect';
        } else {
            slotElement.classList.remove('occupied');
            statusElement.textContent = 'Available';
            statusElement.classList.remove('occupied');
            toggleButton.textContent = 'Click to Occupy';
            slot.power = 0;
        }
        
        this.calculatePowerAllocation();
    }

    calculatePowerAllocation() {
        const occupiedSlots = Object.values(this.slots).filter(slot => slot.occupied);
        const occupiedCount = occupiedSlots.length;
        
        if (occupiedCount === 0) {
            // Reset all slot powers to 0
            Object.values(this.slots).forEach(slot => {
                slot.power = 0;
            });
            this.updateSlotDisplays();
            this.updateGridStatus(0, 'Standby');
            this.updatePowerAllocationChart();
            return;
        }

        let totalDemand = occupiedSlots.reduce((sum, slot) => sum + slot.demand, 0);
        let availablePower = this.config.baseGridPower;
        let additionalPower = 0;

        // Reset all non-occupied slots to 0
        Object.values(this.slots).forEach(slot => {
            if (!slot.occupied) {
                slot.power = 0;
            }
        });

        // Dynamic allocation logic
        if (occupiedCount <= 2) {
            // Base grid power is sufficient
            occupiedSlots.forEach(slot => {
                slot.power = Math.min(slot.demand, this.config.maxSlotPower);
            });
        } else {
            // Need additional power and load balancing
            additionalPower = Math.min(20, Math.max(0, totalDemand - this.config.baseGridPower));
            availablePower += additionalPower;
            
            if (totalDemand <= availablePower) {
                // Can meet all demand
                occupiedSlots.forEach(slot => {
                    slot.power = slot.demand;
                });
            } else {
                // Need to balance power across slots
                const powerPerSlot = availablePower / occupiedCount;
                occupiedSlots.forEach(slot => {
                    slot.power = Math.min(powerPerSlot, this.config.maxSlotPower);
                });
            }
        }

        this.updateSlotDisplays();
        this.updateGridStatus(additionalPower, occupiedCount > 2 ? 'Load Balancing' : 'Optimal');
        this.updatePowerAllocationChart();
    }

    updateSlotDisplays() {
        Object.keys(this.slots).forEach(slotId => {
            const slot = this.slots[slotId];
            const slotElement = document.querySelector(`[data-slot="${slotId}"]`);
            
            if (!slotElement) return;
            
            const powerValue = slotElement.querySelector('.power-value');
            const powerFill = slotElement.querySelector('.power-fill');
            
            if (powerValue) {
                powerValue.textContent = `${slot.power.toFixed(1)} kW`;
            }
            
            if (powerFill) {
                const percentage = (slot.power / this.config.maxSlotPower) * 100;
                powerFill.style.width = `${percentage}%`;
            }
        });
    }

    updateGridStatus(additionalPower, status) {
        const totalPower = this.config.baseGridPower + additionalPower;
        
        const additionalPowerEl = document.getElementById('additional-power');
        const totalPowerEl = document.getElementById('total-power');
        const additionalStatusEl = document.getElementById('additional-status');
        const totalStatusEl = document.getElementById('total-status');
        
        if (additionalPowerEl) additionalPowerEl.textContent = `${additionalPower} kW`;
        if (totalPowerEl) totalPowerEl.textContent = `${totalPower} kW`;
        if (additionalStatusEl) additionalStatusEl.textContent = additionalPower > 0 ? 'Active' : 'On Demand';
        if (totalStatusEl) totalStatusEl.textContent = status;
        
        // Update status colors
        if (additionalStatusEl) {
            additionalStatusEl.className = 'metric-status ' + (additionalPower > 0 ? 'on-demand' : '');
        }
        if (totalStatusEl) {
            totalStatusEl.className = 'metric-status ' + (status === 'Optimal' ? 'available' : 'on-demand');
        }
    }

    startRealTimeUpdates() {
        this.updateTimer = setInterval(() => {
            this.updateCurrentTime();
            this.simulateRealTimeData();
        }, this.config.updateInterval);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const lastUpdateEl = document.getElementById('last-update');
        const currentDateEl = document.getElementById('current-date');
        
        if (lastUpdateEl) lastUpdateEl.textContent = timeString;
        if (currentDateEl) currentDateEl.textContent = dateString;
    }

    simulateRealTimeData() {
        // Small variations in slot demands to simulate real conditions
        Object.keys(this.slots).forEach(slotId => {
            const slot = this.slots[slotId];
            if (slot.occupied) {
                // Add small random variation to demand
                const variation = (Math.random() - 0.5) * 0.5;
                slot.demand = Math.max(6, Math.min(10, slot.demand + variation));
            }
        });

        this.calculatePowerAllocation();
    }

    initializeCharts() {
        this.createPowerAllocationChart();
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
            case 'historical':
                this.createMonthlyPerformanceChart();
                this.createRevenueChart();
                break;
            case 'predictive':
                this.createForecastChart();
                break;
        }
    }

    createPowerAllocationChart() {
        const ctx = document.getElementById('powerAllocationChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.powerAllocation) {
            this.charts.powerAllocation.destroy();
        }

        this.charts.powerAllocation = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Available'],
                datasets: [{
                    data: [0, 0, 0, 0, 40],
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.secondary,
                        this.colors.tertiary,
                        this.colors.success,
                        this.colors.quaternary
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
                            padding: 15
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

    updatePowerAllocationChart() {
        if (!this.charts.powerAllocation) return;

        const totalUsed = Object.values(this.slots).reduce((sum, slot) => sum + slot.power, 0);
        const data = [
            this.slots[1].power,
            this.slots[2].power,
            this.slots[3].power,
            this.slots[4].power,
            Math.max(0, 40 - totalUsed)
        ];

        this.charts.powerAllocation.data.datasets[0].data = data;
        this.charts.powerAllocation.update('none');
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
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Power Usage (kW)',
                        data: power,
                        borderColor: this.colors.secondary,
                        backgroundColor: this.colors.secondary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
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
                    backgroundColor: [this.colors.primary, this.colors.tertiary],
                    borderColor: [this.colors.primary, this.colors.tertiary],
                    borderWidth: 2,
                    borderRadius: 8,
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

        const days = this.analyticsData.daily.map(d => `Day ${d.day}`);
        const dynamicCosts = this.analyticsData.daily.map(d => d.dynamic_cost);
        const staticCosts = this.analyticsData.daily.map(d => d.static_cost);

        this.charts.cost = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Dynamic System',
                        data: dynamicCosts,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Static System',
                        data: staticCosts,
                        borderColor: this.colors.tertiary,
                        backgroundColor: this.colors.tertiary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Daily Cost ($)'
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
                labels: ['Power Optimization', 'Load Balancing', 'Peak Reduction', 'Grid Efficiency'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.secondary,
                        this.colors.success,
                        this.colors.info
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
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

        const days = this.analyticsData.daily.map(d => `Day ${d.day}`);
        const dynamicPower = this.analyticsData.daily.map(d => d.dynamic_power_supplied);
        const staticPower = this.analyticsData.daily.map(d => d.static_power_supplied);

        this.charts.power = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Dynamic System',
                        data: dynamicPower,
                        backgroundColor: this.colors.primary,
                        borderRadius: 4
                    },
                    {
                        label: 'Static System',
                        data: staticPower,
                        backgroundColor: this.colors.tertiary,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Power Consumption (kWh)'
                        }
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

        const days = this.analyticsData.daily.map(d => `Day ${d.day}`);
        const dynamicEfficiency = this.analyticsData.daily.map(d => d.dynamic_efficiency);
        const staticEfficiency = this.analyticsData.daily.map(d => d.static_efficiency);

        this.charts.efficiency = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Dynamic System',
                        data: dynamicEfficiency,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Static System',
                        data: staticEfficiency,
                        borderColor: this.colors.tertiary,
                        backgroundColor: this.colors.tertiary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Efficiency (%)'
                        }
                    }
                }
            }
        });
    }

    createMonthlyPerformanceChart() {
        const ctx = document.getElementById('monthlyPerformanceChart');
        if (!ctx) return;

        if (this.charts.monthlyPerformance) {
            this.charts.monthlyPerformance.destroy();
        }

        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const weeklyData = [
            { savings: 340, efficiency: 81.2, utilization: 65 },
            { savings: 356, efficiency: 83.1, utilization: 68 },
            { savings: 365, efficiency: 84.8, utilization: 71 },
            { savings: 365, efficiency: 85.2, utilization: 69 }
        ];

        this.charts.monthlyPerformance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeks,
                datasets: [
                    {
                        label: 'Weekly Savings ($)',
                        data: weeklyData.map(w => w.savings),
                        borderColor: this.colors.success,
                        backgroundColor: this.colors.success + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Efficiency (%)',
                        data: weeklyData.map(w => w.efficiency),
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1'
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
                            text: 'Weekly Savings ($)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Efficiency (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenue = [2340, 2580, 2720, 2890, 3120, 3250];
        const sessions = [156, 172, 181, 193, 208, 217];

        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Revenue ($)',
                        data: revenue,
                        backgroundColor: this.colors.success,
                        borderRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Sessions',
                        data: sessions,
                        type: 'line',
                        borderColor: this.colors.secondary,
                        backgroundColor: this.colors.secondary,
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y1'
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
                            text: 'Revenue ($)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Charging Sessions'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
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

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const historical = [1426, 1450, 1475, 1490, 1520, 1545, null, null, null];
        const forecast = [null, null, null, null, null, 1545, 1580, 1620, 1660];

        this.charts.forecast = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Historical Savings',
                        data: historical,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Forecast',
                        data: forecast,
                        borderColor: this.colors.warning,
                        backgroundColor: this.colors.warning + '20',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Monthly Savings ($)'
                        }
                    }
                }
            }
        });
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            system_status: {
                slots: this.slots,
                grid_power: this.config.baseGridPower,
                total_slots: this.config.totalSlots
            },
            analytics: this.analyticsData,
            kpi_summary: {
                total_savings: this.analyticsData.kpi.total_cost_savings,
                efficiency_improvement: this.analyticsData.kpi.dynamic_efficiency - this.analyticsData.kpi.static_efficiency,
                power_reduction: this.analyticsData.kpi.power_reduction,
                roi: 540
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ev_charging_analytics_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    destroy() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.evSystem = new EVChargingSystem();
    window.evSystem.init();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey) {
            switch (e.key) {
                case 'E':
                    e.preventDefault();
                    window.evSystem.exportData();
                    break;
                case 'D':
                    e.preventDefault();
                    window.evSystem.switchTab('dashboard');
                    break;
                case 'A':
                    e.preventDefault();
                    window.evSystem.switchTab('analytics');
                    break;
            }
        }
    });

    console.log('EV Charging Power Management & Analytics System initialized');
});