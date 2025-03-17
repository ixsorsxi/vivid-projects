
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeEntry } from './types';
import TimeEntriesTable from './TimeEntriesTable';
import TimeFilterBar from './TimeFilterBar';

interface TimeEntriesCardProps {
  entries: TimeEntry[];
}

const TimeEntriesCard: React.FC<TimeEntriesCardProps> = ({ entries: initialEntries }) => {
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    let filteredEntries = [...initialEntries];
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredEntries = filteredEntries.filter(
        entry => 
          entry.task.toLowerCase().includes(lowerCaseQuery) || 
          entry.project.toLowerCase().includes(lowerCaseQuery) ||
          entry.user.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply project filter
    if (projectFilter !== 'all') {
      filteredEntries = filteredEntries.filter(entry => entry.project === projectFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredEntries = filteredEntries.filter(entry => entry.status === statusFilter);
    }
    
    setEntries(filteredEntries);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, projectFilter, statusFilter, initialEntries]);

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <TimeFilterBar 
          onSearch={setSearchQuery} 
          onFilterChange={setProjectFilter}
          onStatusChange={setStatusFilter}
        />
        
        <TimeEntriesTable 
          entries={currentEntries}
          currentPage={currentPage}
          totalEntries={entries.length}
          entriesPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};

export default TimeEntriesCard;
