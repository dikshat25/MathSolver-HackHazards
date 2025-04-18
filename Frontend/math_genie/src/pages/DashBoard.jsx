import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const styles = {
    wrapper: {
      padding: '2rem',
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'Segoe UI, sans-serif',
      boxSizing: 'border-box',
    },
    hero: {
      textAlign: 'center',
      marginBottom: '2rem',
      width: '100%',
    },
    title: {
      fontSize: '2.8rem',
      fontWeight: '700',
      color: '#2c3e50',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#555',
      marginTop: '0.5rem',
    },
    summary: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: '3rem',
      width: '100%',
    },
    card: {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      padding: '2rem',
      width: '250px',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
    },
    cardHover: {
      transform: 'translateY(-5px)',
    },
    cardTitle: {
      fontSize: '1.3rem',
      marginBottom: '1rem',
      color: '#34495e',
    },
    skillBadge: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#007bff',
      background: '#e3f2fd',
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      display: 'inline-block',
      animation: 'pulse 1.5s infinite',
    },
    leaderboards: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
      justifyContent: 'center',
      width: '100%',
    },
    section: {
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.8rem',
      color: '#2c3e50',
      textAlign: 'center',
    },
    boardCard: {
      background: '#ffffffc7',
      borderRadius: '12px',
      padding: '1rem',
      maxHeight: '300px',
      overflowY: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    listItem: {
      padding: '0.6rem 0',
      borderBottom: '1px solid #eee',
      fontSize: '0.95rem',
      color: '#333',
    },
    rank: {
      fontWeight: 'bold',
      color: '#9b59b6',
      marginRight: '0.4rem',
    },
    loading: {
      fontSize: '1.3rem',
      color: '#666',
      marginTop: '4rem',
      textAlign: 'center',
    },
    error: {
      fontSize: '1.3rem',
      color: '#e74c3c',
      marginTop: '4rem',
      textAlign: 'center',
    },
  };

  const injectKeyframes = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.85; }
      }
    `;
    document.head.appendChild(style);
  };
  

const Dashboard = () => {
    const [escapeRank, setEscapeRank] = useState(null);
    const [escapeTotal, setEscapeTotal] = useState(null);
    const [quizRank, setQuizRank] = useState(null);
    const [quizTotal, setQuizTotal] = useState(null);
  
    useEffect(() => {
      setTimeout(() => {
        setEscapeRank(1);
        setEscapeTotal(2);
        setQuizRank(1);
        setQuizTotal(1);
      }, 500);
    }, []);
  
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-200 p-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <span role="img" aria-label="chart" className="mr-2">📊</span>
            Math Performance Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your progress and rise to the top!
          </p>
  
          {/* Top Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
              <p className="text-xl font-medium text-gray-700 mb-2">Your Skill Level</p>
              <div className="text-blue-500 text-2xl font-bold flex items-center justify-center gap-2">
                🔥 Good
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
              <p className="text-xl font-medium text-gray-700 mb-2">Escape Game Rank</p>
              <p className="text-gray-600 text-lg">
                {escapeRank !== null && escapeTotal !== null
                  ? `#${escapeRank} of ${escapeTotal}`
                  : "Loading..."}
              </p>
            </div>
            <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
              <p className="text-xl font-medium text-gray-700 mb-2">Math Quiz Rank</p>
              <p className="text-gray-600 text-lg">
                {quizRank !== null && quizTotal !== null
                  ? `#${quizRank} of ${quizTotal}`
                  : "Loading..."}
              </p>
            </div>
          </div>
  
          {/* Escape Leaderboard */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            🏁 Escape Game Leaderboard
          </h2>
          <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-2xl mb-10">
            <div className="border-b py-2 text-gray-700 font-medium">
              <span className="text-pink-600 font-bold">#1</span> diksha.thongire7@gmail.com — <strong>720 pts</strong> | Level 10
            </div>
            <div className="py-2 text-gray-700 font-medium">
              <span className="text-purple-600 font-bold">#2</span> diksha.thongire7@gmail.com — <strong>603 pts</strong> | Level 10
            </div>
          </div>
  
          {/* Math Quiz Leaderboard */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            🤯 Math Quiz Leaderboard
          </h2>
          <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-2xl">
            <div className="py-2 text-gray-700 font-medium">
              <span className="text-green-600 font-bold">#1</span> diksha.thongire7@gmail.com — <strong>608 pts</strong> | Level 10
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  