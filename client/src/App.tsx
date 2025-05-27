import { BrowserRouter,Routes,Navigate,Route } from 'react-router';
import LoginPage from './pages/LoginPage';
import AllWeddings from './pages/AllWeddings';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AllWeddings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;