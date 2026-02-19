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

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  coins: number;
}

export type ExerciseType = 'definition' | 'translation' | 'terms';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers'>('dashboard');
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

  const handleNavigate = (view: 'dashboard' | 'exercises' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers') => {
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

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && (
        <MainDashboard 
          user={user} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'exercises' && (
        <ExercisesList 
          onBack={() => setCurrentView('dashboard')}
          onStartExercise={handleStartExercise}
        />
      )}
      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession 
          exerciseType={selectedExerciseType}
          onComplete={handleExerciseComplete}
        />
      )}
      {currentView === 'statistics' && (
        <Statistics onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'literature' && (
        <Literature onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'mock-test' && (
        <MockTest 
          onBack={() => setCurrentView('dashboard')}
          userPhone={user.phone}
          onUpdateCoins={handleUpdateCoins}
        />
      )}
      {currentView === 'rewards' && (
        <Rewards 
          onBack={() => setCurrentView('dashboard')}
          userCoins={user.coins}
          onUpdateCoins={handleUpdateCoins}
        />
      )}
      {currentView === 'learning-centers' && (
        <LearningCenters 
          onBack={() => setCurrentView('dashboard')}
          userCoins={user.coins}
          onNavigateToRewards={() => setCurrentView('rewards')}
        />
      )}
    </div>
  );
}