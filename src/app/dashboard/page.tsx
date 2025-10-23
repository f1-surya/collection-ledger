"use client";

import {
  AlertTriangle,
  BarChart3,
  Download,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data
const summaryData = {
  totalConnections: 1250,
  activeConnections: 1180,
  monthlyRevenue: 45000,
  overduePayments: 45,
};

const recentPayments = [
  {
    id: 1,
    name: "John Doe",
    pack: "Basic Pack",
    amount: 500,
    date: "2024-10-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    pack: "Premium Pack",
    amount: 800,
    date: "2024-10-02",
  },
  {
    id: 3,
    name: "Bob Johnson",
    pack: "Standard Pack",
    amount: 600,
    date: "2024-10-03",
  },
  {
    id: 4,
    name: "Alice Brown",
    pack: "Basic Pack",
    amount: 500,
    date: "2024-10-04",
  },
];

const connectionsByArea = [
  { name: "Downtown", value: 350 },
  { name: "Suburb A", value: 280 },
  { name: "Suburb B", value: 220 },
  { name: "Rural Area", value: 180 },
  { name: "Industrial Zone", value: 120 },
];

const revenueTrends = [
  { month: "Jan", revenue: 38000 },
  { month: "Feb", revenue: 42000 },
  { month: "Mar", revenue: 39000 },
  { month: "Apr", revenue: 45000 },
  { month: "May", revenue: 48000 },
  { month: "Jun", revenue: 46000 },
  { month: "Jul", revenue: 50000 },
  { month: "Aug", revenue: 52000 },
  { month: "Sep", revenue: 49000 },
  { month: "Oct", revenue: 45000 },
];

const packPopularity = [
  { name: "Basic Pack", subscribers: 450 },
  { name: "Standard Pack", subscribers: 380 },
  { name: "Premium Pack", subscribers: 280 },
  { name: "Ultra Pack", subscribers: 140 },
];

const alerts = [
  {
    id: 1,
    type: "overdue",
    message: "45 connections have payments overdue by more than 30 days",
  },
  {
    id: 2,
    type: "low_stock",
    message: "Ultra Pack has only 10 remaining slots",
  },
];

const topMetrics = {
  mostProfitableArea: "Downtown",
  highestRevenuePack: "Premium Pack",
  customerGrowthRate: "+12.5%",
};

export default function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Connections
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.totalConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Connections
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.activeConnections}
            </div>
            <p className="text-xs text-muted-foreground">94.4% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summaryData.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Payments
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryData.overduePayments}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connections by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={connectionsByArea}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pack Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={packPopularity}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="subscribers" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Most Profitable Area</p>
              <p className="text-2xl font-bold">
                {topMetrics.mostProfitableArea}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Highest Revenue Pack</p>
              <p className="text-2xl font-bold">
                {topMetrics.highestRevenuePack}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Customer Growth Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {topMetrics.customerGrowthRate}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{payment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.pack}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention Required</AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Connection
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
