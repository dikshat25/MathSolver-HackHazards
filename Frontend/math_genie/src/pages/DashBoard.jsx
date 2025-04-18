import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [escapeRank, setEscapeRank] = useState(null);
  const [escapeTotal, setEscapeTotal] = useState(null);
  const [quizRank, setQuizRank] = useState(null);
  const [quizTotal, setQuizTotal] = useState(null);

  useEffect(() => {
    // Inject keyframes for animations
    injectKeyframes();
    
    // Simulate data loading
    setTimeout(() => {
      setEscapeRank(1);
      setEscapeTotal(2);
      setQuizRank(1);
      setQuizTotal(1);
    }, 500);

    // In a real implementation, you would fetch data from Firebase here
    // const fetchData = async () => {
    //   try {
    //     // Firebase data fetching logic
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // fetchData();
  }, []);

  const injectKeyframes = () => {
    if (!document.getElementById('dashboard-animations')) {
      const style = document.createElement('style');
      style.id = 'dashboard-animations';
      style.innerHTML = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col" style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      overflow: 'auto',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 py-8" style={{
        width: '100%',
        maxWidth: '1280px',
        padding: '2rem',
      }}>
        <div className="text-center mb-10 w-full" style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          width: '100%',
        }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center" style={{
            fontSize: '2.8rem',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span role="img" aria-label="chart" className="mr-2">📊</span>
            Math Performance Dashboard
          </h1>
          <p className="text-lg text-gray-600" style={{
            fontSize: '1.2rem',
            color: '#555',
            marginTop: '0.5rem',
          }}>
            Track your progress and rise to the top!
          </p>
        </div>

        {/* Top Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          marginBottom: '3rem',
          width: '100%',
        }}>
          <div className="bg-white shadow-xl rounded-2xl p-6 text-center" style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            padding: '2rem',
            width: '250px',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
          }}>
            <p className="text-xl font-medium text-gray-700 mb-2" style={{
              fontSize: '1.3rem',
              marginBottom: '1rem',
              color: '#34495e',
            }}>Your Skill Level</p>
            <div className="text-blue-500 text-2xl font-bold flex items-center justify-center gap-2" style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#007bff',
              background: '#e3f2fd',
              padding: '0.5rem 1rem',
              borderRadius: '30px',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
            }}>
              🔥 Good
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-2xl p-6 text-center" style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            padding: '2rem',
            width: '250px',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
          }}>
            <p className="text-xl font-medium text-gray-700 mb-2" style={{
              fontSize: '1.3rem',
              marginBottom: '1rem',
              color: '#34495e',
            }}>Escape Game Rank</p>
            <p className="text-gray-600 text-lg" style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#9b59b6',
            }}>
              {escapeRank !== null && escapeTotal !== null
                ? `#${escapeRank} of ${escapeTotal}`
                : "Loading..."}
            </p>
          </div>
          <div className="bg-white shadow-xl rounded-2xl p-6 text-center" style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            padding: '2rem',
            width: '250px',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
          }}>
            <p className="text-xl font-medium text-gray-700 mb-2" style={{
              fontSize: '1.3rem',
              marginBottom: '1rem',
              color: '#34495e',
            }}>Math Quiz Rank</p>
            <p className="text-gray-600 text-lg" style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              color: '#9b59b6',
            }}>
              {quizRank !== null && quizTotal !== null
                ? `#${quizRank} of ${quizTotal}`
                : "Loading..."}
            </p>
          </div>
        </div>

        {/* Escape Leaderboard */}
        <div className="w-full mb-10" style={{
          width: '100%',
          maxWidth: '700px',
          marginBottom: '2.5rem',
        }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center" style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            🏁 Escape Game Leaderboard
          </h2>
          <div className="bg-white rounded-xl shadow-md p-4 w-full" style={{
            background: '#ffffffc7',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <div className="border-b py-2 text-gray-700 font-medium" style={{
              padding: '0.6rem 0',
              borderBottom: '1px solid #eee',
              fontSize: '1rem',
              color: '#333',
            }}>
              <span className="text-pink-600 font-bold" style={{ fontWeight: 'bold', color: '#e83e8c' }}>
                #1
              </span> diksha.thongire7@gmail.com — <strong>720 pts</strong> | Level 10
            </div>
            <div className="py-2 text-gray-700 font-medium" style={{
              padding: '0.6rem 0',
              fontSize: '1rem',
              color: '#333',
            }}>
              <span className="text-purple-600 font-bold" style={{ fontWeight: 'bold', color: '#9b59b6' }}>
                #2
              </span> diksha.thongire7@gmail.com — <strong>603 pts</strong> | Level 10
            </div>
          </div>
        </div>

        {/* Math Quiz Leaderboard */}
        <div className="w-full" style={{
          width: '100%',
          maxWidth: '700px',
          marginBottom: '2rem',
        }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center" style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            🤯 Math Quiz Leaderboard
          </h2>
          <div className="bg-white rounded-xl shadow-md p-4 w-full" style={{
            background: '#ffffffc7',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <div className="py-2 text-gray-700 font-medium" style={{
              padding: '0.6rem 0',
              fontSize: '1rem',
              color: '#333',
            }}>
              <span className="text-green-600 font-bold" style={{ fontWeight: 'bold', color: '#2ecc71' }}>
                #1
              </span> diksha.thongire7@gmail.com — <strong>608 pts</strong> | Level 10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;