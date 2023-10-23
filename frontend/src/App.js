import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider} from './contexts/AuthContext';
import ApiProvider from "./contexts/ApiProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <AuthProvider>
          <Container fluid className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<HomePage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* You can add more routes as needed here */}
            </Routes>
          </Container>
        </AuthProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}
