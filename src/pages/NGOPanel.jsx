import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileWarning, Search, Loader2 } from 'lucide-react';

const urgencyColors = {
  Critical: 'bg-red-500 hover:bg-red-600',
  High: 'bg-orange-500 hover:bg-orange-600',
  Medium: 'bg-yellow-500 hover:bg-yellow-600',
  Low: 'bg-blue-500 hover:bg-blue-600',
};

const statusColors = {
  Pending: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
  Allocated: 'border-blue-500 text-blue-500 bg-blue-500/10',
  Fulfilled: 'border-green-500 text-green-500 bg-green-500/10',
};

const NGOPanel = () => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemType, setNewItemType] = useState('Medical Kits');
  const [newQty, setNewQty] = useState('');
  const [newUrgency, setNewUrgency] = useState('Critical');

  useEffect(() => {
    fetch('http://localhost:5000/api/needs/1')
      .then(res => res.json())
      .then(data => {
        setNeeds(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSubmitRequest = () => {
    if(!newQty) return;
    fetch('http://localhost:5000/api/needs/1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_type: newItemType, quantity: Number(newQty), urgency: newUrgency })
    })
    .then(res => res.json())
    .then(res => {
      if(res.data) setNeeds(res.data);
      setNewQty('');
    })
    .catch(console.error);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">NGO / Camp Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle>Post New Need</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Type</label>
              <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                <option>Food</option>
                <option>Water</option>
                <option>Medical Kits</option>
                <option>Essentials</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input type="number" placeholder="e.g. 1000" value={newQty} onChange={e => setNewQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Urgency Level</label>
              <select value={newUrgency} onChange={e => setNewUrgency(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <Button className="w-full gap-2 hover:bg-primary/90" onClick={handleSubmitRequest}>
              <FileWarning className="w-4 h-4" /> Submit Request
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3 bg-card border-border overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center bg-muted/50 pb-4 border-b border-border">
            <CardTitle>Active Requests</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search requests..." className="pl-8 bg-background h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
               <div className="flex justify-center flex-col items-center py-12 text-muted-foreground">
                 <Loader2 className="w-8 h-8 animate-spin mb-4" /> Loading requests...
               </div>
            ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Req ID</TableHead>
                  <TableHead>Item Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-center">Urgency</TableHead>
                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needs.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50 text-muted-foreground h-12">
                    <TableCell className="font-medium text-foreground pl-6">#{item.id}</TableCell>
                    <TableCell className="text-foreground">{item.item_type}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${urgencyColors[item.urgency]} text-white border-0`}>
                        {item.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant="outline" className={`${statusColors[item.status]} font-medium`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {needs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">No requests found.</TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NGOPanel;
