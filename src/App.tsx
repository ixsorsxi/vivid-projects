
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import Documents from "./pages/Documents";
import Team from "./pages/Team";
import TimeTracking from "./pages/TimeTracking";
import Inbox from "./pages/Inbox";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/team" element={<Team />} />
          <Route path="/time-tracking" element={<TimeTracking />} />
          <Route path="/inbox" element={<Inbox />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
