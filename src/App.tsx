import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Simulator from "./pages/Simulator.tsx";
import QuoteResult from "./pages/QuoteResult.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminLeadDetail from "./pages/admin/AdminLeadDetail.tsx";
import AdminCatalog from "./pages/admin/AdminCatalog.tsx";
import AdminPricing from "./pages/admin/AdminPricing.tsx";
import AdminPipeline from "./pages/admin/AdminPipeline.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/simulador" element={<Simulator />} />
            <Route path="/resultado" element={<QuoteResult />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
            <Route path="/admin/leads/:id" element={<ProtectedRoute><AdminLeadDetail /></ProtectedRoute>} />
            <Route path="/admin/catalog" element={<ProtectedRoute><AdminCatalog /></ProtectedRoute>} />
            <Route path="/admin/pricing" element={<ProtectedRoute><AdminPricing /></ProtectedRoute>} />
            <Route path="/admin/pipeline" element={<ProtectedRoute><AdminPipeline /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
