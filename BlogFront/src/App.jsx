import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { ROUTES } from './config/routes';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';
import ChangePassword from './pages/changePassword/ChangePassword';
import ForgotPassword from './pages/forgetPassword/ForgotPassword';
import ResetPassword from './pages/resetPassword/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>        
        {/* 1. Public Routes (Accessible only when NOT logged in) */}
        <Route element={<AuthGuard isPublicOnly={true} />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        {/* 2. Protected Routes (Accessible only when logged in) */}
        <Route element={<AuthGuard isPublicOnly={false} />}>
          <Route path={ROUTES.HOME} element={<Dashboard />} />
          <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
        </Route>

        {/* 3. Wildcard Route (Must be at the very bottom) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;