import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataDisplayPage from './pages/DataDisplayPage';
import AuthenticationPage from './pages/AuthenticationPage';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthenticationPage />} />
          <Route path="/data" element={<DataDisplayPage />} />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;
