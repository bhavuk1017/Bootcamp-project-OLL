
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Users, Calendar, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for batches
const batchesData = [
  { 
    id: 1, 
    name: "Business Bootcamp - Batch 1", 
    status: "ongoing", 
    startDate: "2023-05-01",
    endDate: "2023-07-30", 
    students: 15,
    earnings: 1200,
    nextSession: "2023-06-16T15:00:00",
    topic: "Marketing Strategies"
  },
  { 
    id: 2, 
    name: "Business Bootcamp - Batch 2", 
    status: "ongoing", 
    startDate: "2023-06-01",
    endDate: "2023-08-30", 
    students: 18,
    earnings: 950,
    nextSession: "2023-06-15T14:00:00",
    topic: "Financial Planning"
  },
  { 
    id: 3, 
    name: "Entrepreneurship 101", 
    status: "upcoming", 
    startDate: "2023-07-01",
    endDate: "2023-09-30", 
    students: 12,
    earnings: 0,
    nextSession: "2023-07-01T13:00:00",
    topic: "Introduction to Entrepreneurship"
  },
  { 
    id: 4, 
    name: "Business Bootcamp - Batch 0", 
    status: "completed", 
    startDate: "2023-02-01",
    endDate: "2023-04-30", 
    students: 16,
    earnings: 1450,
    nextSession: null,
    topic: null
  }
];

const MentorBatches = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredBatches = batchesData
    .filter(batch => 
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === 'all' || batch.status === activeTab)
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">My Batches</h1>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search batches..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <Card key={batch.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{batch.name}</CardTitle>
                      <CardDescription>
                        {batch.startDate} to {batch.endDate}
                      </CardDescription>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      batch.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : batch.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {batch.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{batch.students}</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">${batch.earnings}</div>
                        <div className="text-xs text-muted-foreground">Earnings</div>
                      </div>
                    </div>
                    {batch.nextSession && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">
                            {new Date(batch.nextSession).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Next Session</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => navigate(`/mentor/batches/${batch.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No batches found matching your criteria.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorBatches;
