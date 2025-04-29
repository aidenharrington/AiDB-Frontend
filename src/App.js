import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataDisplayPage from './pages/DataDisplayPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataDisplayPage />} />
      </Routes>
    </Router>
  );
}

export default App;
