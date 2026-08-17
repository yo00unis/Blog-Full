import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { ROUTES } from './config/routes';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>        
        {/* 1. Public Routes (Accessible only when NOT logged in) */}
        <Route element={<AuthGuard isPublicOnly={true} />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
        </Route>

        {/* 2. Protected Routes (Accessible only when logged in) */}
        <Route element={<AuthGuard isPublicOnly={false} />}>
          <Route path={ROUTES.HOME} element={<Dashboard />} />
        </Route>

        {/* 3. Wildcard Route (Must be at the very bottom) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;