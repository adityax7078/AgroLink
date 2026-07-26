import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui';
import AIAdvisor from './components/AIAdvisor';
import DevToolsNetworkMonitor from './components/DevToolsNetworkMonitor';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-50/20 dark:bg-slate-955 text-slate-800 dark:text-slate-100 antialiased transition-colors duration-300 pb-44">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/ai-advisor" element={<AIAdvisor />} />
                <Route path="/dashboard/ai-advisor" element={<AIAdvisor />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>


            {/* Footer */}
            <Footer />

            {/* Global DevTools Network Simulator */}
            <DevToolsNetworkMonitor />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}


