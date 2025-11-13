import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import Spinner from './Spinner';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await api.getAllUsers();
        setUsers(allUsers);
        if (allUsers.length > 0) {
          setSelectedUserId(allUsers[0].id);
        }
      } catch (err) {
        setError('فشل في تحميل قائمة المستخدمين.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setLoading(true);
    setError('');
    try {
      const user = await api.login(selectedUserId);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('فشل تسجيل الدخول. لم يتم العثور على المستخدم.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-400 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
            TF
            </div>
            <div>
            <h1 className="text-3xl font-bold text-white">TeamFlow</h1>
            <p className="text-slate-400">فريق كرة القدم الذكي</p>
            </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-center text-white mb-6">تسجيل الدخول</h2>
          {loading && !users.length ? (
            <div className="flex justify-center"><Spinner /></div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="userSelect" className="block text-sm font-medium text-slate-300 mb-2">اختر ملفك الشخصي</label>
                  <select
                    id="userSelect"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role === 'ORGANIZER' ? 'منظم' : 'لاعب'})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner /> : <i className="fa-solid fa-right-to-bracket"></i>}
                  <span>دخول</span>
                </button>
              </div>
              {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
