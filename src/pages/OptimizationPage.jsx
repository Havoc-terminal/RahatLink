import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const OptimizationPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleOptimize = () => {
    setLoading(true);
    setConfirmed(false);
    
    fetch('http://localhost:5000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        setTimeout(() => { // Artificially delay slightly for UX feel
            setResults(data.plan);
            setLoading(false);
        }, 800);
    })
    .catch(err => {
        console.error("Optimization failed", err);
        setLoading(false);
    });
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distribution Engine</h1>
          <p className="text-muted-foreground mt-1">Smart Priority-Weighted Greedy Allocation</p>
        </div>
        <Button onClick={handleOptimize} disabled={loading} size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {loading ? "Calculating..." : "Run Optimization Algorithm"}
        </Button>
      </div>

      {!results && !loading && (
        <Card className="bg-muted/10 border-dashed border-2 flex flex-col items-center justify-center p-12 text-center text-muted-foreground min-h-[400px]">
          <Zap className="w-16 h-16 mb-4 opacity-30 text-blue-500" />
          <h3 className="text-2xl font-medium mb-2 text-foreground">Ready to Optimize</h3>
          <p className="max-w-md text-base">The engine will calculate the shortest distance and highest priority needs to distribute resources efficiently over the live database.</p>
        </Card>
      )}

      {loading && (
        <Card className="flex flex-col items-center justify-center p-16 text-center shadow-lg border-blue-500/30 min-h-[400px] animate-in zoom-in duration-300">
          <Loader2 className="w-16 h-16 mb-6 animate-spin text-blue-500" />
          <h3 className="text-2xl font-medium text-foreground tracking-tight">Running Advanced Matchmaking</h3>
          <p className="text-base text-muted-foreground mt-2 max-w-md">Executing node.js optimization function across datasets...</p>
        </Card>
      )}

      {results && !loading && (
        <Card className="border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] animate-in slide-in-from-bottom-8 duration-500">
          <CardHeader className="border-b border-border bg-blue-500/5 flex flex-row justify-between items-center py-6">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-6 h-6"/> Allocation Plan Ready
              </CardTitle>
              <CardDescription className="mt-2 flex gap-3 text-sm font-medium">
                <Badge variant="secondary" className="px-3 py-1">{results.length} Routes Identified</Badge>
              </CardDescription>
            </div>
            {!confirmed ? (
              <Button onClick={handleConfirm} size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-500/20 animate-pulse">
                 Confirm Distribution
              </Button>
            ) : (
              <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 px-6 py-3 text-sm flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5"/> Success: Database Updated
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 h-12">
                  <TableHead className="pl-8 text-foreground">Source Warehouse</TableHead>
                  <TableHead className="text-foreground">Target Camp</TableHead>
                  <TableHead className="text-foreground">Resource</TableHead>
                  <TableHead className="text-right pr-8 text-foreground">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition-colors h-14">
                    <TableCell className="font-medium text-blue-400 pl-8">{r.warehouse}</TableCell>
                    <TableCell className="font-medium text-orange-400">{r.camp}</TableCell>
                    <TableCell className="text-foreground">{r.item}</TableCell>
                    <TableCell className="text-right pr-8 font-bold text-lg">{r.qty.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizationPage;
