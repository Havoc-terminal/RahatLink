import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PackagePlus, Search, Loader2 } from 'lucide-react';

const WarehousePanel = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemType, setNewItemType] = useState('Food');
  const [newQty, setNewQty] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/inventory/1')
      .then(res => res.json())
      .then(data => {
        setInventory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch inventory", err);
        setLoading(false);
      });
  }, []);

  const handleAddStock = () => {
    if (!newQty) return;
    fetch('http://localhost:5000/api/inventory/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_type: newItemType, quantity: Number(newQty) })
    })
    .then(res => res.json())
    .then(res => {
      if (res.data) setInventory(res.data);
      setNewQty('');
    })
    .catch(console.error);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Panel</h1>
        <Button className="flex items-center gap-2">
          <PackagePlus className="w-4 h-4" /> Add Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle>Add New Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Type</label>
              <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option>Food</option>
                <option>Water</option>
                <option>Medical Kits</option>
                <option>Essentials</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input type="number" placeholder="e.g. 500" value={newQty} onChange={e => setNewQty(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleAddStock}>Update Inventory</Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3 bg-card border-border overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center bg-muted/50 pb-4 border-b border-border">
            <CardTitle>Current Inventory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." className="pl-8 bg-background h-9" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center flex-col items-center py-12 text-muted-foreground">
                 <Loader2 className="w-8 h-8 animate-spin mb-4" /> Loading inventory...
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="pl-6">ID</TableHead>
                    <TableHead>Item Type</TableHead>
                    <TableHead className="text-right pr-6">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 text-muted-foreground h-12">
                      <TableCell className="font-medium text-foreground pl-6">#{item.id}</TableCell>
                      <TableCell className="text-foreground">{item.item_type}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground pr-6">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                  {inventory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">No inventory found.</TableCell>
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

export default WarehousePanel;
