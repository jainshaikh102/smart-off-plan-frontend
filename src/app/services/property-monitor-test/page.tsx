import PropertyMonitorWorkingEndpoints from "./working-endpoints";

/**
 * PropertyMonitor API Testing Interface - Main Page
 *
 * This page shows only the PropertyMonitor API endpoints that work with demo credentials.
 * Based on comprehensive testing, 6 out of 8 endpoints are accessible with 75% success rate.
 * 
 * WORKING ENDPOINTS:
 * ✅ Test Connection - API connectivity test
 * ✅ Dubai Price Index - Market index data
 * ✅ Community Price Trends - Price trends by area
 * ✅ Comparables Search - Property transaction data
 * ✅ Transactions Last Month - Recent transaction volumes
 * ✅ Number of Transactions - Transaction counts by criteria
 * ✅ Price Volume Trends - Volume and price analysis (basic parameters)
 * 
 * RESTRICTED ENDPOINTS (demo account limitations):
 * ❌ Community Historic Trends - 401 Invalid API Token
 * ❌ Points of Interest - 401 Invalid API Token
 */

const PropertyMonitorTestPage = () => {
  return <PropertyMonitorWorkingEndpoints />;
};

export default PropertyMonitorTestPage;
