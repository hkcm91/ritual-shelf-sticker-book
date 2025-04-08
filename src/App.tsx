
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import WidgetLauncher from './pages/WidgetLauncher';
import RecipeBook from './pages/RecipeBook';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/widgets" element={<WidgetLauncher />} />
      <Route path="/recipes" element={<RecipeBook />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
