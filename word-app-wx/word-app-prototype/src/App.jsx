import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learning from './pages/Learning';
import Vocabulary from './pages/Vocabulary';
import Mine from './pages/Mine';
import Test from './pages/Test';
import Statistics from './pages/Statistics';
import SettingsPage from './pages/Settings';
import AiChat from './pages/AiChat';
import StudyGroup from './pages/StudyGroup';
import Friends from './pages/Friends';
import VocabularyImport from './pages/VocabularyImport';
import VocabularyEdit from './pages/VocabularyEdit';
import Mistakes from './pages/Mistakes';
import StudyPlan from './pages/StudyPlan';
import Notifications from './pages/Notifications';
import HelpFeedback from './pages/HelpFeedback';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);

  // Map view to tab if possible, or keep null if it's a full screen page
  const getActiveTab = (view) => {
    if (['home', 'learning', 'vocabulary', 'mine'].includes(view)) {
      return view;
    }
    return null; // No tab active or keep previous? Let's return null to unhighlight or hide
  };

  const activeTab = getActiveTab(currentView);
  const showTabbar = activeTab !== null;

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'learning':
        return <Learning navigateTo={navigateTo} />;
      case 'vocabulary':
        return <Vocabulary navigateTo={navigateTo} setSelectedBook={setSelectedBook} />;
      case 'mine':
        return <Mine navigateTo={navigateTo} />;
      case 'test':
        return <Test onBack={() => navigateTo('home')} />; 
      case 'statistics':
        return <Statistics onBack={() => navigateTo('mine')} />; 
      case 'settings':
        return <SettingsPage onBack={() => navigateTo('mine')} />; 
      case 'ai-chat':
        return <AiChat onBack={() => navigateTo('home')} />;
      case 'study-group':
        return <StudyGroup onBack={() => navigateTo('mine')} />;
      case 'friends':
        return <Friends onBack={() => navigateTo('mine')} />;
      case 'study-plan':
        return <StudyPlan onBack={() => navigateTo('mine')} />;
      case 'notifications':
        return <Notifications onBack={() => navigateTo('mine')} />;
      case 'help-feedback':
        return <HelpFeedback onBack={() => navigateTo('mine')} />;
      case 'vocab-import':
        return <VocabularyImport onBack={() => navigateTo('vocabulary')} />;
      case 'vocab-edit':
        return <VocabularyEdit onBack={() => navigateTo('vocabulary')} book={selectedBook} />;
      case 'mistakes':
        return <Mistakes onBack={() => navigateTo('home')} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab || 'home'} // Fallback for visual if needed, but if showTabbar is false it doesn't matter
      onTabChange={navigateTo} 
      showTabbar={showTabbar}
      currentView={currentView}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
