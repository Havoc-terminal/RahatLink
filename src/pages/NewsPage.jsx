import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const newsItems = [
  { 
    id: 1, 
    title: "Severe Flooding Requires Evacuation in Northern Region",
    location: "Northern Region, Delta District",
    date: "2023-11-22",
    verified: true,
    description: "Multi-agency response initiated. Over 1,200 people displaced due to continuous heavy rainfall leading to swollen riverbanks.",
    source: "Global News Net"
  },
  { 
    id: 2, 
    title: "Earthquake Aftershocks Cause Mild Panic",
    location: "Eastern Valley",
    date: "2023-11-21",
    verified: false,
    description: "Reports of aftershocks following yesterday's 4.5 magnitude tremor. Local residents report minor structural damages to old buildings.",
    source: "Social Media / Twitter"
  },
  { 
    id: 3, 
    title: "Emergency Medical Supplies Dwindling in Coastal Camp",
    location: "Coastal Sector 4",
    date: "2023-11-21",
    verified: true,
    description: "Relief workers urgently requesting antibiotics and sterile dressings as casualties from the storm surge continue to arrive.",
    source: "Red Cross Field Report"
  }
];

const NewsPage = () => {
  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disaster Intelligence</h1>
          <p className="text-muted-foreground mt-1">Real-time reports and verified priority zones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map(news => (
          <Card key={news.id} className="bg-card border-border flex flex-col h-full hover:border-primary/50 transition-colors shadow-none hover:shadow-lg">
             <CardHeader className="pb-4 border-b border-border bg-muted/10">
               <div className="flex justify-between items-start mb-3">
                 <Badge variant="outline" className={news.verified ? "border-green-500/30 text-green-500 bg-green-500/10 px-2 py-0.5" : "border-gray-500/30 text-gray-400 bg-gray-500/10 px-2 py-0.5"}>
                   {news.verified ? "Verified Report" : "Unverified"}
                 </Badge>
                 <span className="flex items-center text-xs text-muted-foreground font-medium">
                   <Calendar className="w-3 h-3 mr-1.5"/> {news.date}
                 </span>
               </div>
               <CardTitle className="text-xl leading-tight text-foreground group">
                 {news.title}
               </CardTitle>
             </CardHeader>
             <CardContent className="flex-1 pt-5 text-sm text-muted-foreground">
               <div className="flex items-center text-xs font-semibold text-blue-400 mb-4 bg-blue-500/10 px-3 py-1.5 rounded-md w-fit">
                 <MapPin className="w-3.5 h-3.5 mr-1.5"/> {news.location}
               </div>
               <p className="leading-relaxed text-[15px]">{news.description}</p>
             </CardContent>
             <CardFooter className="pt-4 pb-4 border-t border-border flex justify-between items-center bg-muted/5">
               <span className="text-xs text-muted-foreground italic truncate max-w-[150px]">Source: {news.source}</span>
               <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:text-blue-400 transition-colors">
                 Read More <ExternalLink className="w-3.5 h-3.5"/>
               </Button>
             </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
