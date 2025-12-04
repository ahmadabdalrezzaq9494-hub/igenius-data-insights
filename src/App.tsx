import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from './pages/Login';
import AddVideo from './pages/AddVideo';
import ManageComments from "./pages/ManageComments";
import Dashboard from "@/pages/Dashboard";
import ContactManagementPage from "@/pages/ContactManagementPage";
import UsersManagementPage from "@/pages/UsersManagementPage";
import VideosList from "@/pages/VideosList";
import EditVideo from "@/pages/EditVideo";
import ViewVideo from './pages/ViewVideo';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-video" element={<AddVideo />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-comments" element={<ManageComments />} />
            <Route path="/contact-management" element={<ContactManagementPage />} />
            <Route path="/user-management" element={<UsersManagementPage />} />
            <Route path="/list-video" element={<VideosList />} />
            <Route path="/edit-video/:id" element={<EditVideo />} />
            <Route path="/view-video/:id" element={<ViewVideo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider> 
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;