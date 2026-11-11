import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Activity, AlertTriangle } from 'lucide-react';

const supplyDemandData = [
  { name: 'Food', supply: 4000, demand: 2400 },
  { name: 'Water', supply: 3000, demand: 1398 },
  { name: 'Medical', supply: 2000, demand: 9800 },
  { name: 'Essentials', supply: 2780, demand: 3908 },
];

const resourceData = [
  { name: 'Food', value: 400 },
  { name: 'Water', value: 300 },
  { name: 'Medical', value: 300 },
  { name: 'Essentials', value: 200 },
];
const COLORS = ['#3b82f6', '#06b6d4', '#ef4444', '#f59e0b'];

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Main Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Supply</CardTitle>
            <Package className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,780</div>
            <p className="text-xs text-muted-foreground">+20% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Demand</CardTitle>
            <Activity className="w-4 h-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17,506</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">24</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card col-span-1">
          <CardHeader>
            <CardTitle>Supply vs Demand</CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyDemandData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <RechartsTooltip cursor={{fill: '#222'}} contentStyle={{ backgroundColor: '#161B22', borderColor: '#333' }} />
                <Bar dataKey="supply" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Supply" />
                <Bar dataKey="demand" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Demand" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card col-span-1">
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#161B22', borderColor: '#333' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
