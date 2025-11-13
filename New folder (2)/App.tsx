import React, { useState, useEffect, useCallback } from 'react';
import { User, Suggestion, Match, AttendanceRecord, TeamDivision, Notification as NotificationType, PlayerMatchPreferences, MatchAwards, MatchAwardCategory, ChatMessage, MatchEvaluations } from './types';
import { api } from './services/api';

import Header from './components/Header';
import Notification from './components/Notification';
import Auth from './components/Auth';
import Spinner from './components/Spinner';
import ChatPanel from './components/ChatPanel';
import SideNav from './components/SideNav';
import SuggestionModal from './components/SuggestionModal';
import AddPlayerModal from './components/AddPlayerModal';
import EditProfileModal from './components/EditProfileModal';


import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import PreferencesPage from './pages/PreferencesPage';
import TeamsPage from './pages/TeamsPage';
import ReviewPage from './pages/ReviewPage';


export type Page = 'DASHBOARD' | 'ATTENDANCE' | 'PREFERENCES' | 'TEAMS' | 'REVIEW';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [upcomingMatch, setUpcomingMatch] = useState<Match | null>(null);
  const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [matchPreferences, setMatchPreferences] = useState<{ [userId: string]: PlayerMatchPreferences }>({});
  const [teamDivision, setTeamDivision] = useState<TeamDivision | null>(null);
  const [matchAwards, setMatchAwards] = useState<{ [matchId: string]: MatchAwards | null }>({});
  const [matchEvaluations, setMatchEvaluations] = useState<{ [matchId: string]: MatchEvaluations | null }>({});
  const [allAttendance, setAllAttendance] = useState<{ [matchId: string]: AttendanceRecord[] }>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');

  const showNotification = (message: string, type: NotificationType['type']) => {
    const newNotification = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };
  
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        sugs,
        uMatch,
        cMatches,
        users,
        chatMsgs
      ] = await Promise.all([
        api.getSuggestions(),
        api.getUpcomingMatch(),
        api.getCompletedMatches(),
        api.getAllUsers(),
        api.getChatMessages()
      ]);
      setSuggestions(sugs);
      setUpcomingMatch(uMatch);
      setCompletedMatches(cMatches);
      setAllUsers(users);
      setChatMessages(chatMsgs);

      if (uMatch) {
        const [att, prefs, division] = await Promise.all([
          api.getAttendance(uMatch.id),
          api.getMatchPreferences(uMatch.id),
          api.getTeamDivision(uMatch.id),
        ]);
        setAttendance(att);
        setMatchPreferences(prefs);
        setTeamDivision(division);
      }

      const allAwards: { [matchId: string]: MatchAwards | null } = {};
      const allAtt: { [matchId: string]: AttendanceRecord[] } = {};
      const allEval: { [matchId: string]: MatchEvaluations | null } = {};
      for (const match of cMatches) {
        const [awards, attendance, evaluations] = await Promise.all([
            api.getMatchAwards(match.id),
            api.getAttendance(match.id),
            api.getMatchEvaluations(match.id),
        ]);
        allAwards[match.id] = awards;
        allAtt[match.id] = attendance;
        allEval[match.id] = evaluations;
      }
      setMatchAwards(allAwards);
      setAllAttendance(allAtt);
      setMatchEvaluations(allEval);

    } catch (error) {
      console.error("Failed to load data", error);
      showNotification('فشل في تحميل البيانات', 'error');
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        loadData();
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [loadData]);
  
  // --- Handlers ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showNotification(`أهلاً بعودتك، ${user.name}!`, 'success');
    loadData();
  };
  
  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setSuggestions([]);
    setUpcomingMatch(null);
    setAttendance([]);
    setTeamDivision(null);
  };

  const handleAddSuggestion = async (details: { date: string; location: string; notes: string }) => {
    try {
        await api.addSuggestion(details);
        setSuggestionModalOpen(false);
        showNotification('تمت إضافة اقتراحك بنجاح!', 'success');
        setSuggestions(await api.getSuggestions());
    } catch (e) {
        showNotification('حدث خطأ أثناء إضافة الاقتراح', 'error');
    }
  };

  const handleAddPlayer = async (details: { name: string; skillLevel: number }) => {
    setIsSubmitting(true);
    try {
        const newUser = await api.addUser(details.name, details.skillLevel);
        setAddPlayerModalOpen(false);
        showNotification(`تمت إضافة اللاعب ${newUser.name} بنجاح!`, 'success');
        setAllUsers(await api.getAllUsers());
    } catch (e: any) {
        showNotification(`حدث خطأ: ${e.message}`, 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (newName: string) => {
    setIsSubmitting(true);
    try {
        const updatedUser = await api.updateUserName(newName);
        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setEditProfileModalOpen(false);
        showNotification('تم تحديث اسمك بنجاح!', 'success');
    } catch (e: any) {
        showNotification(`فشل تحديث الملف الشخصي: ${e.message}`, 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleVote = async (suggestionId: string) => {
    try {
      await api.voteForSuggestion(suggestionId);
      setSuggestions(await api.getSuggestions());
      showNotification('تم تسجيل تصويتك!', 'info');
    } catch (e) {
      showNotification('حدث خطأ أثناء التصويت', 'error');
    }
  };

  const handleSetAttendance = async (matchId: string, status: AttendanceRecord['status']) => {
    try {
      await api.setAttendance(matchId, status);
      setAttendance(await api.getAttendance(matchId));
    } catch (e) {
      showNotification('لم نتمكن من تحديث حالة حضورك', 'error');
    }
  };
  
  const handleSetMatchPreferences = async (matchId: string, preferences: Partial<PlayerMatchPreferences>) => {
    try {
        await api.setMatchPreferences(matchId, preferences);
        setMatchPreferences(await api.getMatchPreferences(matchId));
        showNotification('تم حفظ تفضيلاتك!', 'success');
    } catch (e) {
        showNotification('لم نتمكن من تحديث تفضيلاتك', 'error');
    }
  };
  
  const handleGenerateTeams = async () => {
      if (!upcomingMatch) return;
      setIsGeneratingTeams(true);
      try {
          showNotification('يتم الآن تقسيم الفرق بذكاء...', 'info');
          const division = await api.generateTeams(upcomingMatch.id);
          setTeamDivision(division);
          showNotification('تم تقسيم الفرق بنجاح!', 'success');
      } catch (e: any) {
          console.error(e);
          showNotification(`فشل تقسيم الفرق: ${e.message}`, 'error');
      } finally {
          setIsGeneratingTeams(false);
      }
  };
  
  const handleSubmitVote = async (matchId: string, votes: Partial<Record<MatchAwardCategory, string>>) => {
      try {
          await api.submitVote(matchId, votes);
          const updatedAwards = await api.getMatchAwards(matchId);
          setMatchAwards(prev => ({ ...prev, [matchId]: updatedAwards }));
          showNotification('تم تسجيل تصويتك بنجاح!', 'success');
      } catch (error) {
          showNotification('حدث خطأ أثناء إرسال التصويت.', 'error');
      }
  };

  const handleSubmitEvaluation = async (matchId: string, rating: number, comment: string) => {
    try {
        await api.submitMatchEvaluation(matchId, rating, comment);
        const updatedEvals = await api.getMatchEvaluations(matchId);
        setMatchEvaluations(prev => ({ ...prev, [matchId]: updatedEvals }));
        showNotification('تم تسجيل تقييمك بنجاح!', 'success');
    } catch (error) {
        showNotification('حدث خطأ أثناء إرسال التقييم.', 'error');
    }
  };

  const handleSubmitTeamDivisionVote = async (matchId: string, rating: number, comment: string) => {
    try {
        const updatedDivision = await api.submitTeamDivisionVote(matchId, rating, comment);
        setTeamDivision(updatedDivision);
        showNotification('شكراً لك! تم تسجيل تقييمك.', 'success');
    } catch (error) {
        showNotification('حدث خطأ أثناء إرسال تقييمك.', 'error');
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
        await api.sendChatMessage(text);
        setChatMessages(await api.getChatMessages());
    } catch (e) {
        showNotification('فشل إرسال الرسالة', 'error');
    }
  };
  
  const renderPage = () => {
      const myAttendanceStatus = attendance.find(a => a.userId === currentUser?.id)?.status;
      
      switch (currentPage) {
          case 'DASHBOARD':
              return <DashboardPage 
                suggestions={suggestions}
                currentUser={currentUser!}
                onVote={handleVote}
                upcomingMatch={upcomingMatch}
                onOpenSuggestionModal={() => setSuggestionModalOpen(true)}
                onOpenAddPlayerModal={() => setAddPlayerModalOpen(true)}
              />;
          case 'ATTENDANCE':
              return <AttendancePage
                match={upcomingMatch}
                attendance={attendance}
                currentUser={currentUser!}
                onSetAttendance={handleSetAttendance}
               />;
          case 'PREFERENCES':
              return <PreferencesPage
                match={upcomingMatch}
                currentUser={currentUser!}
                allPlayers={allUsers}
                attendance={attendance}
                myAttendanceStatus={myAttendanceStatus}
                myPreferences={matchPreferences[currentUser!.id]}
                onSetMatchPreferences={handleSetMatchPreferences}
              />;
          case 'TEAMS':
              return <TeamsPage 
                division={teamDivision}
                currentUser={currentUser!}
                match={upcomingMatch}
                attendance={attendance}
                isGeneratingTeams={isGeneratingTeams}
                onGenerateTeams={handleGenerateTeams}
                onSubmitDivisionVote={handleSubmitTeamDivisionVote}
              />;
          case 'REVIEW':
              return <ReviewPage
                completedMatches={completedMatches}
                matchAwards={matchAwards}
                attendance={allAttendance}
                currentUser={currentUser!}
                allPlayers={allUsers}
                onSubmitVote={handleSubmitVote}
                matchEvaluations={matchEvaluations}
                onSubmitEvaluation={handleSubmitEvaluation}
              />;
          default:
              return <div>Page not found</div>;
      }
  };


  if (isLoading) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center"><Spinner /></div>;
  }

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLogin} />;
  }
  
  const myAttendanceStatus = attendance.find(a => a.userId === currentUser?.id)?.status;


  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans">
      {/* Notifications Container */}
      <div className="fixed top-5 left-5 z-50 space-y-3">
          {notifications.map(n => <Notification key={n.id} message={n.message} type={n.type} />)}
      </div>

      <div className="flex">
        <SideNav 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isAttending={myAttendanceStatus === 'ATTENDING'}
        />
        <div className="flex-1 p-4 sm:p-8">
            <Header user={currentUser} onLogout={handleLogout} onOpenEditProfileModal={() => setEditProfileModalOpen(true)} />
            <main className="mt-8">
                {renderPage()}
            </main>
        </div>
      </div>


      <SuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setSuggestionModalOpen(false)}
        onSubmit={handleAddSuggestion}
      />

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setAddPlayerModalOpen(false)}
        onSubmit={handleAddPlayer}
        isSubmitting={isSubmitting}
      />
      
      {currentUser && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          onSubmit={handleUpdateProfile}
          isSubmitting={isSubmitting}
          currentUser={currentUser}
        />
      )}

      <ChatPanel
        messages={chatMessages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default App;