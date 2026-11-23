
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DietFoodPage } from '@/pages/DietFood';
import { SettingsPage } from '@/pages/SettingsPage';
import { ProtectedRoute } from './ProtectRoute';
import { StatsPage } from '@/pages/StatsPage';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<DashboardPage drawerId="main-drawer" />}
          />

          <Route
            path="/foods"
            element={<DietFoodPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
          <Route
            path="/stats"
            element={<StatsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
