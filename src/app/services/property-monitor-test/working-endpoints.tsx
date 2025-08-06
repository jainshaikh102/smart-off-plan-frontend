"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  XCircle,
  TestTube,
  TrendingUp,
  Search,
  BarChart3,
} from "lucide-react";

/**
 * PropertyMonitor API Testing Interface - WORKING ENDPOINTS ONLY
 *
 * This component provides a testing interface for PropertyMonitor API endpoints that work
 * with the demo account. Based on comprehensive testing, only 6 out of 8 endpoints are
 * accessible with demo credentials.
 *
 * WORKING ENDPOINTS (75% success rate):
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

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  endpoint?: string;
  timestamp?: string;
}

interface TestResult {
  loading: boolean;
  result: ApiResponse | null;
  error: string | null;
}

const PropertyMonitorWorkingEndpoints = () => {
  // State for working endpoints only
  const [connectionTest, setConnectionTest] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });
  const [dubaiPriceIndex, setDubaiPriceIndex] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });
  const [priceTrends, setPriceTrends] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });
  const [comparables, setComparables] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });
  const [transactions, setTransactions] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });
  const [numTransactions, setNumTransactions] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });
  const [priceVolume, setPriceVolume] = useState<TestResult>({
    loading: false,
    result: null,
    error: null,
  });

  // Enhanced form state with better defaults based on testing
  const [priceTrendsForm, setPriceTrendsForm] = useState({
    masterDevelopment: "Dubai Marina",
    category: "sales",
  });

  const [comparablesForm, setComparablesForm] = useState({
    masterDevelopment: "Dubai Marina",
    category: "sale",
    minBeds: "2",
    maxBeds: "3",
    limit: "10",
    offPlan: "0",
  });

  const [transactionsForm, setTransactionsForm] = useState({
    masterDevelopment: "Dubai Marina",
  });

  const [numTransactionsForm, setNumTransactionsForm] = useState({
    emirate: "Dubai",
    masterDevelopment: "Arabian Ranches",
    location: "Al Reem",
    propertyType: "Townhouse",
    noBeds: "3",
    startDate: "2022-01-01",
    endDate: "2022-05-31",
  });

  const [priceVolumeForm, setPriceVolumeForm] = useState({
    masterDevelopment: "Dubai Marina",
    category: "sale",
  });

  // Popular development options based on testing
  const popularDevelopments = [
    "Dubai Marina",
    "Downtown Dubai",
    "JVC",
    "Business Bay",
    "Dubai Hills Estate",
    "Arabian Ranches",
    "Jumeirah Village Circle",
    "DIFC",
    "Palm Jumeirah",
    "Dubai South",
  ];

  // Generic API call function
  const makeApiCall = async (
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<ApiResponse> => {
    try {
      const url = new URL(
        `${window.location.origin}/api/property-monitor${endpoint}`
      );

      // Add non-empty parameters to URL
      Object.keys(params).forEach((key) => {
        if (
          params[key] !== "" &&
          params[key] !== null &&
          params[key] !== undefined
        ) {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();

      return {
        success: response.ok,
        ...data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: "Network error occurred",
      };
    }
  };

  // Test functions for working endpoints
  const testConnection = async () => {
    setConnectionTest({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall("/test-connection");
      setConnectionTest({ loading: false, result, error: null });
    } catch (error: any) {
      setConnectionTest({ loading: false, result: null, error: error.message });
    }
  };

  const testDubaiPriceIndex = async () => {
    setDubaiPriceIndex({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall("/dubai-price-index");
      setDubaiPriceIndex({ loading: false, result, error: null });
    } catch (error: any) {
      setDubaiPriceIndex({
        loading: false,
        result: null,
        error: error.message,
      });
    }
  };

  const testPriceTrends = async () => {
    setPriceTrends({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall(
        "/community-price-trends",
        priceTrendsForm
      );
      setPriceTrends({ loading: false, result, error: null });
    } catch (error: any) {
      setPriceTrends({ loading: false, result: null, error: error.message });
    }
  };

  const testComparables = async () => {
    setComparables({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall("/comparables-search", comparablesForm);
      setComparables({ loading: false, result, error: null });
    } catch (error: any) {
      setComparables({ loading: false, result: null, error: error.message });
    }
  };

  const testTransactions = async () => {
    setTransactions({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall(
        "/transactions-last-month",
        transactionsForm
      );
      setTransactions({ loading: false, result, error: null });
    } catch (error: any) {
      setTransactions({ loading: false, result: null, error: error.message });
    }
  };

  const testNumTransactions = async () => {
    setNumTransactions({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall(
        "/number-of-transactions",
        numTransactionsForm
      );
      setNumTransactions({ loading: false, result, error: null });
    } catch (error: any) {
      setNumTransactions({
        loading: false,
        result: null,
        error: error.message,
      });
    }
  };

  const testPriceVolume = async () => {
    setPriceVolume({ loading: true, result: null, error: null });
    try {
      const result = await makeApiCall("/price-volume-trends", priceVolumeForm);
      setPriceVolume({ loading: false, result, error: null });
    } catch (error: any) {
      setPriceVolume({ loading: false, result: null, error: error.message });
    }
  };

  const clearAllResults = () => {
    setConnectionTest({ loading: false, result: null, error: null });
    setDubaiPriceIndex({ loading: false, result: null, error: null });
    setPriceTrends({ loading: false, result: null, error: null });
    setComparables({ loading: false, result: null, error: null });
    setTransactions({ loading: false, result: null, error: null });
    setNumTransactions({ loading: false, result: null, error: null });
    setPriceVolume({ loading: false, result: null, error: null });
  };

  // Auto-test connection on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      testConnection();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Result display component
  const ResultDisplay = ({ testResult }: { testResult: TestResult }) => {
    if (testResult.loading) {
      return (
        <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
          <span className="text-yellow-800">Loading...</span>
        </div>
      );
    }

    if (testResult.error) {
      return (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-800">Error: {testResult.error}</span>
        </div>
      );
    }

    if (testResult.result) {
      const isSuccess = testResult.result.success;
      return (
        <div
          className={`p-4 border rounded-lg ${
            isSuccess
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {isSuccess ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={isSuccess ? "text-green-800" : "text-red-800"}>
              {isSuccess ? "Success" : "Failed"}
            </span>
            {testResult.result.endpoint && (
              <Badge variant="outline" className="text-xs">
                {testResult.result.endpoint}
              </Badge>
            )}
          </div>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-96">
            {JSON.stringify(testResult.result, null, 2)}
          </pre>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏢 PropertyMonitor API - Working Endpoints
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Testing interface for PropertyMonitor.com API endpoints that work with
          demo credentials
        </p>
        <div className="flex justify-center gap-2 mb-4">
          <Badge variant="default" className="bg-green-600">
            ✅ 6 Working Endpoints
          </Badge>
          <Badge variant="destructive">❌ 2 Restricted Endpoints</Badge>
          <Badge variant="outline">75% Success Rate</Badge>
        </div>
        <Badge variant="outline" className="text-sm">
          Base URL: /api/property-monitor
        </Badge>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <TestTube className="h-5 w-5" />
            Quick Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={testConnection} disabled={connectionTest.loading}>
              {connectionTest.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Test Connection
            </Button>
            <Button
              onClick={testDubaiPriceIndex}
              disabled={dubaiPriceIndex.loading}
            >
              {dubaiPriceIndex.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Dubai Price Index
            </Button>
            <Button variant="outline" onClick={clearAllResults}>
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test Results */}
      {(connectionTest.result ||
        connectionTest.loading ||
        connectionTest.error) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              🧪 Connection Test
            </CardTitle>
            <CardDescription>
              API connectivity and authentication test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-gray-800 mb-3">
                <strong>Purpose:</strong> Verify PropertyMonitor API
                connectivity and authentication status.
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>📥 Request:</strong> No parameters required - simple
                  connectivity test
                </p>
                <p>
                  <strong>📤 Response:</strong> Authentication status and API
                  availability confirmation
                </p>
                <p>
                  <strong>🔑 Authentication:</strong> Uses demo API credentials
                  (x-api-key + company-key)
                </p>
                <p>
                  <strong>🎯 Use Case:</strong> Always test this first to verify
                  API is accessible
                </p>
              </div>
            </div>
            <ResultDisplay testResult={connectionTest} />
          </CardContent>
        </Card>
      )}

      {/* Individual Endpoint Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dubai Price Index */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              💹 Dubai Price Index
            </CardTitle>
            <CardDescription>
              Get current Dubai real estate price index (no parameters required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                <strong>Purpose:</strong> Retrieves the official Dubai real
                estate price index showing market trends over time.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>
                  <strong>📥 Request:</strong> No parameters required - simple
                  GET request
                </p>
                <p>
                  <strong>📤 Response:</strong> Monthly price index data with
                  percentage changes
                </p>
                <p>
                  <strong>📈 Data Period:</strong> July 2024 to July 2025 (13
                  months)
                </p>
                <p>
                  <strong>🎯 Use Case:</strong> Market overview, trend analysis,
                  investment decisions
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✅ Status:</strong> Working perfectly - Returns
                comprehensive market index data
              </p>
            </div>
            <Button
              onClick={testDubaiPriceIndex}
              disabled={dubaiPriceIndex.loading}
              className="w-full"
            >
              {dubaiPriceIndex.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Get Dubai Price Index
            </Button>
            {(dubaiPriceIndex.result ||
              dubaiPriceIndex.loading ||
              dubaiPriceIndex.error) && (
              <ResultDisplay testResult={dubaiPriceIndex} />
            )}
          </CardContent>
        </Card>

        {/* Community Price Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              📈 Community Price Trends
            </CardTitle>
            <CardDescription>
              Get price trends for specific communities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-green-800 mb-3">
                <strong>Purpose:</strong> Get price trends and changes for
                specific communities/developments in Dubai.
              </p>
              <div className="space-y-2 text-sm text-green-700">
                <p>
                  <strong>📥 Required Fields:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>masterDevelopment:</strong> Community name (e.g.,
                    "Dubai Marina", "Downtown Dubai")
                  </li>
                  <li>
                    • <strong>category:</strong> Data type - "sales", "rentals",
                    or "yields"
                  </li>
                </ul>
                <p>
                  <strong>📤 Response:</strong> Price changes (monthly,
                  quarterly, yearly) with percentage variations
                </p>
                <p>
                  <strong>🎯 Use Case:</strong> Community analysis, investment
                  research, market comparison
                </p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>✅ Status:</strong> Working - Best results with major
                developments like Dubai Marina, Downtown Dubai
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price-trends-master-dev">
                  Master Development
                </Label>
                <Select
                  value={priceTrendsForm.masterDevelopment}
                  onValueChange={(value) =>
                    setPriceTrendsForm({
                      ...priceTrendsForm,
                      masterDevelopment: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDevelopments.map((dev) => (
                      <SelectItem key={dev} value={dev}>
                        {dev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price-trends-category">Category</Label>
                <Select
                  value={priceTrendsForm.category}
                  onValueChange={(value) =>
                    setPriceTrendsForm({ ...priceTrendsForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="rentals">Rentals</SelectItem>
                    <SelectItem value="yields">Yields</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={testPriceTrends}
              disabled={priceTrends.loading}
              className="w-full"
            >
              {priceTrends.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Get Price Trends
            </Button>
            {(priceTrends.result ||
              priceTrends.loading ||
              priceTrends.error) && <ResultDisplay testResult={priceTrends} />}
          </CardContent>
        </Card>

        {/* Comparables Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              🔍 Comparables Search
            </CardTitle>
            <CardDescription>
              Search for comparable properties with detailed transaction data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-purple-800 mb-3">
                <strong>Purpose:</strong> Search for comparable property
                transactions to analyze market values and trends.
              </p>
              <div className="space-y-2 text-sm text-purple-700">
                <p>
                  <strong>📥 Required Fields:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>masterDevelopment:</strong> Community name (e.g.,
                    "Dubai Marina")
                  </li>
                  <li>
                    • <strong>category:</strong> Transaction type - "sale" or
                    "rent"
                  </li>
                </ul>
                <p>
                  <strong>📥 Optional Fields:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>minBeds/maxBeds:</strong> Bedroom range filter
                    (1-5+)
                  </li>
                  <li>
                    • <strong>limit:</strong> Number of results (5, 10, 20, 50)
                  </li>
                  <li>
                    • <strong>offPlan:</strong> 0 = Ready properties, 1 =
                    Off-plan properties
                  </li>
                </ul>
                <p>
                  <strong>📤 Response:</strong> Detailed transaction records
                  with prices, dates, property details
                </p>
                <p>
                  <strong>🎯 Use Case:</strong> Property valuation, market
                  analysis, comparable sales research
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✅ Status:</strong> Working excellently - Returns 125+
                detailed transaction records with pagination
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comparables-master-dev">
                  Master Development
                </Label>
                <Select
                  value={comparablesForm.masterDevelopment}
                  onValueChange={(value) =>
                    setComparablesForm({
                      ...comparablesForm,
                      masterDevelopment: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDevelopments.map((dev) => (
                      <SelectItem key={dev} value={dev}>
                        {dev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comparables-category">Category</Label>
                <Select
                  value={comparablesForm.category}
                  onValueChange={(value) =>
                    setComparablesForm({ ...comparablesForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comparables-min-beds">Min Beds</Label>
                <Input
                  id="comparables-min-beds"
                  type="number"
                  value={comparablesForm.minBeds}
                  onChange={(e) =>
                    setComparablesForm({
                      ...comparablesForm,
                      minBeds: e.target.value,
                    })
                  }
                  placeholder="e.g., 2"
                />
              </div>
              <div>
                <Label htmlFor="comparables-max-beds">Max Beds</Label>
                <Input
                  id="comparables-max-beds"
                  type="number"
                  value={comparablesForm.maxBeds}
                  onChange={(e) =>
                    setComparablesForm({
                      ...comparablesForm,
                      maxBeds: e.target.value,
                    })
                  }
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <Label htmlFor="comparables-limit">Results Limit</Label>
                <Select
                  value={comparablesForm.limit}
                  onValueChange={(value) =>
                    setComparablesForm({ ...comparablesForm, limit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 results</SelectItem>
                    <SelectItem value="10">10 results</SelectItem>
                    <SelectItem value="20">20 results</SelectItem>
                    <SelectItem value="50">50 results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comparables-offplan">Off Plan</Label>
                <Select
                  value={comparablesForm.offPlan}
                  onValueChange={(value) =>
                    setComparablesForm({ ...comparablesForm, offPlan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Ready Properties</SelectItem>
                    <SelectItem value="1">Off Plan Properties</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={testComparables}
              disabled={comparables.loading}
              className="w-full"
            >
              {comparables.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Search Comparables
            </Button>
            {(comparables.result ||
              comparables.loading ||
              comparables.error) && <ResultDisplay testResult={comparables} />}
          </CardContent>
        </Card>

        {/* Transactions Last Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              📋 Transactions Last Month
            </CardTitle>
            <CardDescription>
              Get transaction volume data for the last month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-orange-800 mb-3">
                <strong>Purpose:</strong> Get transaction volume data for the
                last month to analyze market activity.
              </p>
              <div className="space-y-2 text-sm text-orange-700">
                <p>
                  <strong>📥 Required Fields:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>masterDevelopment:</strong> Community name (e.g.,
                    "Dubai Marina", "Downtown Dubai")
                  </li>
                </ul>
                <p>
                  <strong>📤 Response:</strong> Transaction counts by type:
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>Sales Transactions:</strong> Completed property
                    sales
                  </li>
                  <li>
                    • <strong>Title Deed Registrations:</strong> Official
                    property transfers
                  </li>
                  <li>
                    • <strong>Oqood Registrations:</strong> Off-plan property
                    bookings
                  </li>
                </ul>
                <p>
                  <strong>🎯 Use Case:</strong> Market activity monitoring,
                  investment timing, demand analysis
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✅ Status:</strong> Working well - Returns comprehensive
                transaction volume data
              </p>
            </div>
            <div>
              <Label htmlFor="transactions-master-dev">
                Master Development
              </Label>
              <Select
                value={transactionsForm.masterDevelopment}
                onValueChange={(value) =>
                  setTransactionsForm({
                    ...transactionsForm,
                    masterDevelopment: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {popularDevelopments.map((dev) => (
                    <SelectItem key={dev} value={dev}>
                      {dev}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={testTransactions}
              disabled={transactions.loading}
              className="w-full"
            >
              {transactions.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Get Transactions
            </Button>
            {(transactions.result ||
              transactions.loading ||
              transactions.error) && (
              <ResultDisplay testResult={transactions} />
            )}
          </CardContent>
        </Card>

        {/* Number of Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              🔢 Number of Transactions
            </CardTitle>
            <CardDescription>
              Get transaction counts for specific areas and criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-indigo-800 mb-3">
                <strong>Purpose:</strong> Get detailed transaction counts
                filtered by specific criteria and date ranges.
              </p>
              <div className="space-y-2 text-sm text-indigo-700">
                <p>
                  <strong>📥 Available Filters:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>emirate:</strong> Dubai, Abu Dhabi, Sharjah
                  </li>
                  <li>
                    • <strong>masterDevelopment:</strong> Community name
                  </li>
                  <li>
                    • <strong>location:</strong> Specific area within
                    development
                  </li>
                  <li>
                    • <strong>propertyType:</strong> Apartment, Villa,
                    Townhouse, Penthouse
                  </li>
                  <li>
                    • <strong>noBeds:</strong> Number of bedrooms (1-5+)
                  </li>
                  <li>
                    • <strong>startDate/endDate:</strong> Date range filter
                    (YYYY-MM-DD)
                  </li>
                </ul>
                <p>
                  <strong>📤 Response:</strong> Detailed transaction counts
                  matching your criteria
                </p>
                <p>
                  <strong>🎯 Use Case:</strong> Market research, demand
                  analysis, investment planning
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✅ Status:</strong> Working excellently - Returns
                detailed transaction counts with flexible filtering
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="num-transactions-emirate">Emirate</Label>
                <Select
                  value={numTransactionsForm.emirate}
                  onValueChange={(value) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      emirate: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dubai">Dubai</SelectItem>
                    <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                    <SelectItem value="Sharjah">Sharjah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="num-transactions-master-dev">
                  Master Development
                </Label>
                <Select
                  value={numTransactionsForm.masterDevelopment}
                  onValueChange={(value) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      masterDevelopment: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDevelopments.map((dev) => (
                      <SelectItem key={dev} value={dev}>
                        {dev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="num-transactions-location">Location</Label>
                <Input
                  id="num-transactions-location"
                  value={numTransactionsForm.location}
                  onChange={(e) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., Al Reem"
                />
              </div>
              <div>
                <Label htmlFor="num-transactions-property-type">
                  Property Type
                </Label>
                <Select
                  value={numTransactionsForm.propertyType}
                  onValueChange={(value) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      propertyType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="num-transactions-beds">Number of Beds</Label>
                <Select
                  value={numTransactionsForm.noBeds}
                  onValueChange={(value) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      noBeds: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5">5+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="num-transactions-start-date">Start Date</Label>
                <Input
                  id="num-transactions-start-date"
                  type="date"
                  value={numTransactionsForm.startDate}
                  onChange={(e) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="num-transactions-end-date">End Date</Label>
                <Input
                  id="num-transactions-end-date"
                  type="date"
                  value={numTransactionsForm.endDate}
                  onChange={(e) =>
                    setNumTransactionsForm({
                      ...numTransactionsForm,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button
              onClick={testNumTransactions}
              disabled={numTransactions.loading}
              className="w-full"
            >
              {numTransactions.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Get Transaction Count
            </Button>
            {(numTransactions.result ||
              numTransactions.loading ||
              numTransactions.error) && (
              <ResultDisplay testResult={numTransactions} />
            )}
          </CardContent>
        </Card>

        {/* Price Volume Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              📊 Price Volume Trends
            </CardTitle>
            <CardDescription>
              Get volume and price trend analysis (basic parameters work best)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-semibold text-teal-900 mb-2">
                📊 API Description
              </h4>
              <p className="text-sm text-teal-800 mb-3">
                <strong>Purpose:</strong> Analyze volume and price trends over
                time for specific communities.
              </p>
              <div className="space-y-2 text-sm text-teal-700">
                <p>
                  <strong>📥 Required Fields:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>
                    • <strong>masterDevelopment:</strong> Community name (e.g.,
                    "Dubai Marina")
                  </li>
                  <li>
                    • <strong>category:</strong> Transaction type - "sale" or
                    "rent"
                  </li>
                </ul>
                <p>
                  <strong>📤 Response:</strong> Monthly volume and price data
                  with trends
                </p>
                <p>
                  <strong>⚠️ Important:</strong> Keep parameters simple -
                  complex combinations may cause server errors
                </p>
                <p>
                  <strong>🎯 Use Case:</strong> Market trend analysis, volume
                  tracking, price movement studies
                </p>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Status:</strong> Partially working - Use basic
                parameters only, avoid complex combinations
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price-volume-master-dev">
                  Master Development
                </Label>
                <Select
                  value={priceVolumeForm.masterDevelopment}
                  onValueChange={(value) =>
                    setPriceVolumeForm({
                      ...priceVolumeForm,
                      masterDevelopment: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularDevelopments.map((dev) => (
                      <SelectItem key={dev} value={dev}>
                        {dev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price-volume-category">Category</Label>
                <Select
                  value={priceVolumeForm.category}
                  onValueChange={(value) =>
                    setPriceVolumeForm({ ...priceVolumeForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={testPriceVolume}
              disabled={priceVolume.loading}
              className="w-full"
            >
              {priceVolume.loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Get Price Volume Trends
            </Button>
            {(priceVolume.result ||
              priceVolume.loading ||
              priceVolume.error) && <ResultDisplay testResult={priceVolume} />}
          </CardContent>
        </Card>
      </div>

      {/* Restricted Endpoints Info */}
      <Card className="mt-8 bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <XCircle className="h-5 w-5" />❌ Restricted Endpoints (Demo Account
            Limitations)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <h4 className="font-semibold text-red-800">
                📊 Community Historic Trends
              </h4>
              <p className="text-sm text-red-700">
                Returns 401 "Invalid API Token" - Historical data not available
                with demo credentials
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <h4 className="font-semibold text-red-800">
                📍 Points of Interest (POI)
              </h4>
              <p className="text-sm text-red-700">
                Returns 401 "Invalid API Token" for all types (school, hospital,
                mall, landmark) - Location data not available with demo
                credentials
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-800">
                💡 Production Access
              </h4>
              <p className="text-sm text-blue-700">
                These endpoints will be available with production
                PropertyMonitor API credentials
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyMonitorWorkingEndpoints;
