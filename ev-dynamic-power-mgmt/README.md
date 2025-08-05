# EVISION - EV Charging Power Management & Analytics Platform

A comprehensive, professional web application for managing EV charging stations with dynamic power allocation, real-time analytics, and Firebase integration.

## 🚀 Features

### Core Functionality
- **Dynamic Power Management**: Intelligent 10kW per slot allocation with load balancing
- **Real-time Monitoring**: Live power consumption and slot status tracking
- **Firebase Integration**: Cloud database synchronization and multi-client support
- **Comprehensive Analytics**: Cost analysis, efficiency metrics, and predictive insights
- **Professional Billing System**: Dynamic vs normal rate comparison with savings calculation

### Technical Highlights
- **Responsive Design**: Professional light theme optimized for business environments
- **Real-time Charts**: Interactive visualizations using Chart.js
- **Multi-tab Interface**: Dashboard, Control Panel, Analytics, and Reports
- **Indian Currency Support**: All financial data displayed in ₹ (INR)
- **Professional UI**: Clean, modern interface suitable for corporate use

## 📁 Project Structure

```
evision-ev-management/
├── index.html          # Main application file
├── app.js             # Core JavaScript functionality
├── style.css          # Professional light theme styles
├── README.md          # This documentation
└── package.json       # Project configuration
```

## 🛠 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase and Chart.js CDN)

### Quick Start
1. Download all project files to a folder
2. Open `index.html` in your web browser
3. The application will initialize automatically

### Firebase Configuration
The application is pre-configured with Firebase Realtime Database:
- **Database URL**: `https://databsegrid-default-rtdb.asia-southeast1.firebasedatabase.app/`
- **API Key**: Pre-configured for immediate use
- **Real-time sync**: Automatic data synchronization across multiple clients

## 💡 Usage

### Power Management
- **Connect EVs**: Click "Connect EV" buttons to simulate vehicle connections
- **Monitor Power**: Real-time power allocation and grid status monitoring
- **Load Balancing**: Automatic power distribution when demand exceeds supply
- **Grid Requests**: Dynamic power requests from grid when needed

### Analytics Dashboard
- **Overview**: Key performance indicators and system metrics
- **Cost Analysis**: Dynamic vs static pricing comparison
- **Efficiency Tracking**: Power consumption and system performance
- **Predictive Analytics**: Forecasting and optimization recommendations

### Billing Information
Each connected EV displays:
- Energy consumed (kWh)
- Dynamic rate cost (₹12/kWh)
- Normal rate cost (₹15/kWh)
- Real-time savings calculation
- Power efficiency metrics

## 🎨 Customization

### Branding
- Logo: Update `.logo-text` in `index.html`
- Colors: Modify color variables in `app.js` and `style.css`
- Title: Change page title in `index.html`

### Firebase Integration
- Update `firebaseConfig` in `app.js` with your database credentials
- Modify database structure in sync methods if needed

### Power Management Rules
- Adjust `config` object in `app.js` for different power limits
- Modify billing rates in slot initialization
- Customize load balancing algorithms

## 📊 Technical Specifications

### Power System
- **Base Grid Power**: 20kW
- **Maximum Grid Power**: 40kW
- **Slot Capacity**: 10kW each (4 slots)
- **Load Balancing**: Automatic when demand > supply

### Billing Rates
- **Dynamic Rate**: ₹12 per kWh
- **Normal Rate**: ₹15 per kWh
- **Savings**: 20% cost reduction with dynamic pricing

### Data Storage
- **Local State**: Real-time slot and grid status
- **Firebase Sync**: Automatic cloud backup and multi-client sync
- **Analytics Data**: 30-day historical data with hourly patterns

## 🔧 Development

### File Structure
- **index.html**: Main HTML structure and UI components
- **app.js**: Core application logic, Firebase integration, and chart management
- **style.css**: Professional light theme with responsive design

### Key Classes
- `EVPowerManagementSystem`: Main application class
- Chart management methods for real-time visualizations
- Firebase integration for cloud synchronization
- Billing calculation system

### Dependencies
- **Chart.js**: For interactive charts and visualizations
- **Firebase**: For real-time database and cloud sync
- **Inter Font**: For professional typography

## 🚀 Deployment

### Local Deployment
1. Place all files in a web server directory
2. Access via `http://localhost/your-folder/`

### Cloud Deployment
1. Upload files to your web hosting service
2. Ensure Firebase configuration is correct
3. Test real-time synchronization

### Integration with Other Projects
1. Copy all files to your project directory
2. Update Firebase configuration if needed
3. Customize branding and colors as required
4. Integrate with existing authentication systems if needed

## 📈 Performance

- **Real-time Updates**: 1-second intervals for live data
- **Chart Rendering**: Optimized for smooth animations
- **Firebase Sync**: Efficient delta updates
- **Responsive Design**: Optimized for all screen sizes

## 🔒 Security

- **Firebase Rules**: Configure database security rules
- **API Key**: Secure your Firebase API key for production
- **Input Validation**: Built-in validation for all user inputs

## 📞 Support

This is a complete, production-ready EV charging management system with:
- Professional UI/UX design
- Real-time data synchronization
- Comprehensive analytics
- Indian currency support
- Firebase cloud integration

Perfect for integration into larger EV management platforms or as a standalone solution.

## 📄 License

This project is ready for commercial use and integration into other applications.

---

**EVISION** - Powering the Future of EV Charging Management