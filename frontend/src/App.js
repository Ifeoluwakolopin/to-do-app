import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ApiProvider from "./contexts/ApiProvider";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <AuthProvider>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div style={{ flexGrow: 1, overflow: 'auto' }}>
                <Routes>
                  <Route path="/" element={<AuthenticatedRoute />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/logout" element={<LandingPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

// New component to handle the conditional routing based on authentication status
function AuthenticatedRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <HomePage />;
  } else {
    return <LandingPage />;
  }
}
