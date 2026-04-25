import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";
import TOT2Course from "./courses/TOT2/index";
import TOT2Feedback from "./courses/TOT2/feedback/index";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ToastContainer position="top-right" autoClose={5000} />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/tot2" element={<TOT2Course />} />
              <Route path="/tot2/feedback" element={<TOT2Feedback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
