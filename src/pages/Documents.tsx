
import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  FileText,
  Filter,
  FolderOpen,
  Grid, 
  List,
  MoreHorizontal,
  PlusCircle,
  Search,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Documents = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('all');
  
  const documents = [
    { 
      id: '1', 
      name: 'Project Requirements.docx', 
      type: 'Word',
      size: '2.4 MB',
      modified: '2 hours ago',
      author: 'John Doe',
      shared: true,
      starred: true
    },
    { 
      id: '2', 
      name: 'Design Mockups.fig', 
      type: 'Figma',
      size: '7.8 MB',
      modified: 'Yesterday',
      author: 'Jane Smith',
      shared: true,
      starred: false
    },
    { 
      id: '3', 
      name: 'Marketing Strategy.pdf', 
      type: 'PDF',
      size: '1.2 MB',
      modified: '3 days ago',
      author: 'Emily Davis',
      shared: false,
      starred: true
    },
    { 
      id: '4', 
      name: 'Budget 2023.xlsx', 
      type: 'Excel',
      size: '875 KB',
      modified: '1 week ago',
      author: 'Robert Johnson',
      shared: true,
      starred: false
    },
    { 
      id: '5', 
      name: 'Team Meeting Notes.txt', 
      type: 'Text',
      size: '45 KB',
      modified: '2 weeks ago',
      author: 'Michael Brown',
      shared: false,
      starred: false
    },
    { 
      id: '6', 
      name: 'Product Roadmap.pptx', 
      type: 'PowerPoint',
      size: '3.2 MB',
      modified: '1 month ago',
      author: 'John Doe',
      shared: true,
      starred: false
    },
  ];
  
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'Word':
        return <div className="bg-blue-500/15 text-blue-500 p-3 rounded-md"><FileText className="h-6 w-6" /></div>;
      case 'PDF':
        return <div className="bg-red-500/15 text-red-500 p-3 rounded-md"><FileText className="h-6 w-6" /></div>;
      case 'Excel':
        return <div className="bg-green-500/15 text-green-500 p-3 rounded-md"><FileText className="h-6 w-6" /></div>;
      case 'PowerPoint':
        return <div className="bg-orange-500/15 text-orange-500 p-3 rounded-md"><FileText className="h-6 w-6" /></div>;
      case 'Figma':
        return <div className="bg-purple-500/15 text-purple-500 p-3 rounded-md"><FileText className="h-6 w-6" /></div>;
      default:
        return <div className="bg-gray-500/15 text-gray-500 p-3 rounded-md"><FileText className="h-6 w-6" /></div>;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = fileType === 'all' || 
                       (fileType === 'shared' && doc.shared) ||
                       (fileType === 'starred' && doc.starred);
    
    return matchesSearch && matchesType;
  });
  
  const renderFileActions = (doc: typeof documents[0]) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Download</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuItem>Copy Link</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
  return (
    <PageContainer 
      title="Documents" 
      subtitle="Manage and organize project files"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    className="pl-9" 
                    placeholder="Search files..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select defaultValue={fileType} onValueChange={setFileType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Files</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-1 p-1 border rounded-md">
                  <Button 
                    variant={view === 'list' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setView('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={view === 'grid' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setView('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
                
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>New Document</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFileType('all')}>All Files</TabsTrigger>
                <TabsTrigger value="shared" onClick={() => setFileType('shared')}>Shared</TabsTrigger>
                <TabsTrigger value="starred" onClick={() => setFileType('starred')}>Starred</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FolderOpen className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Upload a document or create a new one.'}
                </p>
              </div>
            ) : view === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Modified</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Size</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">{doc.type} Document</div>
                            </div>
                            {doc.starred && (
                              <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-600 border-amber-300">
                                Starred
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{doc.modified}</td>
                        <td className="py-3 px-4 text-sm">{doc.author}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{doc.size}</td>
                        <td className="py-3 px-4 text-right">
                          {renderFileActions(doc)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 bg-muted/30 flex items-center justify-center aspect-video">
                      {getFileIcon(doc.type)}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium line-clamp-1">{doc.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{doc.modified} by {doc.author}</p>
                        </div>
                        {renderFileActions(doc)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.slice(0, 3).map((doc) => (
                <div key={`recent-${doc.id}`} className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">{doc.modified}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">View All</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shared with Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.filter(d => d.shared).slice(0, 3).map((doc) => (
                <div key={`shared-${doc.id}`} className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">By {doc.author}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">View All</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="text-sm">
                <span className="font-medium">6.5 GB</span> of <span className="text-muted-foreground">10 GB</span> used
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Documents</span>
                  </div>
                  <span>2.8 GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Images</span>
                  </div>
                  <span>1.9 GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Videos</span>
                  </div>
                  <span>1.2 GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span>Other</span>
                  </div>
                  <span>0.6 GB</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-2">Upgrade Storage</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Documents;
