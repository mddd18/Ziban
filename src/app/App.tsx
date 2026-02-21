import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import ExercisesList from './components/ExercisesList';
import ExerciseSession from './components/ExerciseSession';
import Statistics from './components/Statistics';
import Literature from './components/Literature';
import MockTest from './components/MockTest';
import Rewards from './components/Rewards';
import LearningCenters from './components/LearningCenters';
import AdminPanel from './components/AdminPanel';
import PremiumScreen from './components/PremiumScreen';

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  coins: number;
  isPremium?: boolean;
}

export type ExerciseType = 'definition' | 'translation' | 'terms';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium'>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: any) => {
    // Agar premium bo'lmagan foydalanuvchi Mock Test yoki Rewards ga kirmoqchi bo'lsa, Premium oynasiga otadi
    if ((view === 'mock-test' || view === 'rewards') && !user?.isPremium) {
      setCurrentView('premium');
      return;
    }
    setCurrentView(view);
  };

  const handleStartExercise = (type: ExerciseType) => {
    setSelectedExerciseType(type);
    setCurrentView('exercise-session');
  };

  const handleExerciseComplete = () => {
    setCurrentView('exercises');
  };

  const handleUpdateCoins = (newCoins: number) => {
    if (user) {
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleUpgradeSuccess = () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentView('dashboard');
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && (
        <MainDashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentView === 'exercises' && (
        <ExercisesList onBack={() => setCurrentView('dashboard')} onStartExercise={handleStartExercise} />
      )}
      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession exerciseType={selectedExerciseType} onComplete={handleExerciseComplete} />
      )}
      {currentView === 'statistics' && (
        <Statistics onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'literature' && (
        <Literature onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'mock-test' && (
        <MockTest onComplete={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'rewards' && (
        <Rewards onBack={() => setCurrentView('dashboard')} userCoins={user.coins} onUpdateCoins={handleUpdateCoins} />
      )}
      {currentView === 'learning-centers' && (
        <LearningCenters onBack={() => setCurrentView('dashboard')} userCoins={user.coins} onNavigateToRewards={() => setCurrentView('rewards')} />
      )}
      
      {/* YANGI QO'SHILGAN OYNALAR */}
      {currentView === 'admin-panel' && (
        <AdminPanel onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'premium' && (
        <PremiumScreen onBack={() => setCurrentView('dashboard')} onUpgradeSuccess={handleUpgradeSuccess} />
      )}
    </div>
  );
}
