import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/Users';
import TrainersPage from '@/pages/admin/Trainers';
import GymsPage from '@/pages/admin/Gyms';
import ExercisesPage from '@/pages/admin/Exercises';
import MuscleGroupsPage from '@/pages/admin/MuscleGroups';
import EquipmentPage from '@/pages/admin/Equipment';
import WorkoutPlansPage from '@/pages/admin/WorkoutPlans';
import TransactionsPage from '@/pages/admin/Transactions';
import ChallengesPage from '@/pages/admin/Challenges';
import ReportsPage from '@/pages/admin/Reports';
import GymDashboard from '@/pages/gym/GymDashboard';
import MembersPage from '@/pages/gym/Members';
import AttendancePage from '@/pages/gym/Attendance';
import SubscriptionPlansPage from '@/pages/gym/SubscriptionPlans';
import ReviewsPage from '@/pages/gym/Reviews';

function AuthGuard({ role }: { role: 'admin' | 'gym' }) {
  const { isAuthenticated, role: userRole } = useAuth();
  if (!isAuthenticated || userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AuthGuard role="admin" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="trainers" element={<TrainersPage />} />
            <Route path="gyms" element={<GymsPage />} />
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="muscle-groups" element={<MuscleGroupsPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="workout-plans" element={<WorkoutPlansPage />} />
            {/* <Route path="transactions" element={<TransactionsPage />} /> */}
            {/* <Route path="challenges" element={<ChallengesPage />} /> */}
            {/* <Route path="reports" element={<ReportsPage />} /> */}
          </Route>

          {/* Gym Manager Routes */}
          <Route path="/gym" element={<AuthGuard role="gym" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<GymDashboard />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="subscriptions" element={<SubscriptionPlansPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
