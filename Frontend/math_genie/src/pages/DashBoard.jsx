import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';

const Dashboard = () => {
  const [escapeRank, setEscapeRank] = useState(null);
  const [escapeTotal, setEscapeTotal] = useState(null);
  const [quizRank, setQuizRank] = useState(null);
  const [quizTotal, setQuizTotal] = useState(null);
  const [escapeLeaderboard, setEscapeLeaderboard] = useState([]);
  const [quizLeaderboard, setQuizLeaderboard] = useState([]);
  const [userSkillLevel, setUserSkillLevel] = useState('Beginner');
  const [loadingEscapeRank, setLoadingEscapeRank] = useState(true);

  useEffect(() => {
    const fetchRanks = async () => {
      setLoadingEscapeRank(true);
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const uid = user.uid;
            console.log('User UID:', uid);

            // Fetch and process Escape Room Scores
            const escapeQuery = query(collection(db, 'escapeScores')); // Changed collection name
            const escapeSnapshot = await getDocs(escapeQuery);
            let escapeScores = [];

            escapeSnapshot.forEach((doc) => {
              const data = doc.data();
              console.log('Escape Score Doc Data:', data);
              escapeScores.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
                email: data.email,
                score: data.score,
                levelReached: data.levelReached,
              });
            });
            console.log('Escape Scores Array:', escapeScores);

            // Sort Escape Scores (Highest Score, Earliest Completion Time)
            escapeScores.sort((a, b) => {
              if (b.score !== a.score) {
                return b.score - a.score;
              }
              if (a.createdAt && b.createdAt) {
                return a.createdAt.getTime() - b.createdAt.getTime();
              }
              return 0;
            });
            console.log('Sorted Escape Scores Array:', escapeScores);

            // Calculate Escape Rank
            let eRank = 1;
            let foundEscape = false;
            escapeScores.forEach((score) => {
              if (score.uid === uid) {
                setEscapeRank(eRank);
                foundEscape = true;
              }
              if (!foundEscape) eRank++;
            });
            setEscapeTotal(escapeScores.length);
            setEscapeLeaderboard(escapeScores);
            console.log('Escape Leaderboard State:', escapeLeaderboard);
            setLoadingEscapeRank(false);

            // Fetch and process Quiz Scores
            const quizQuery = query(collection(db, 'userScores'));
            const quizSnapshot = await getDocs(quizQuery);
            let quizScores = [];

            quizSnapshot.forEach((doc) => {
              const data = doc.data();
              console.log('Quiz Score Doc Data:', data);
              quizScores.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
              });
            });
            console.log('Quiz Scores Array:', quizScores);

            // Sort Quiz Scores (Highest Score, Lowest Total Time)
            quizScores.sort((a, b) => {
              if (b.score !== a.score) {
                return b.score - a.score;
              }
              return a.totalTime - b.totalTime;
            });
            console.log('Sorted Quiz Scores Array:', quizScores);

            // Calculate Quiz Rank
            let qRank = 1;
            let foundQuiz = false;
            quizScores.forEach((score) => {
              if (score.uid === uid) {
                setQuizRank(qRank);
                foundQuiz = true;
              }
              if (!foundQuiz) qRank++;
            });
            setQuizTotal(quizScores.length);
            setQuizLeaderboard(quizScores);
            console.log('Quiz Leaderboard State:', quizLeaderboard);

            // Determine User Skill Level (Example Logic)
            const totalEscapeScore = escapeScores.reduce((sum, score) => (score.uid === uid ? sum + score.score : sum), 0);
            const totalQuizScore = quizScores.reduce((sum, score) => (score.uid === uid ? sum + score.score : sum), 0);
            const combinedScore = totalEscapeScore + totalQuizScore;
            console.log('Total Escape Score:', totalEscapeScore);
            console.log('Total Quiz Score:', totalQuizScore);
            console.log('Combined Score:', combinedScore);

            if (combinedScore < 500) {
              setUserSkillLevel('Beginner');
            } else if (combinedScore < 1500) {
              setUserSkillLevel('Intermediate');
            } else {
              setUserSkillLevel('Advanced');
            }
            console.log('User Skill Level:', userSkillLevel);
          } else {
            console.log('User is not authenticated');
            setLoadingEscapeRank(false);
          }
        });
      } catch (error) {
        console.error('Error fetching rankings:', error);
        setLoadingEscapeRank(false);
      }
    };

    fetchRanks();
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
    <div
      className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col"
      style={{
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
      }}
    >
      {injectKeyframes()}
      <div
        className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 py-8"
        style={{
          width: '100%',
          maxWidth: '1280px',
          padding: '2rem',
        }}
      >
        <div
          className="text-center mb-10 w-full"
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
            width: '100%',
          }}
        >
          <h1
            className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center"
            style={{
              fontSize: '2.8rem',
              fontWeight: '700',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span role="img" aria-label="chart" className="mr-2">
              📊
            </span>
            Math Performance Dashboard
          </h1>
          <p
            className="text-lg text-gray-600"
            style={{
              fontSize: '1.2rem',
              color: '#555',
              marginTop: '0.5rem',
            }}
          >
            Track your progress and rise to the top!
          </p>
        </div>

        {/* Top Cards */}
        <div
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            marginBottom: '3rem',
            width: '100%',
          }}
        >
          <div
            className="bg-white shadow-xl rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              width: '250px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
            }}
          >
            <p
              className="text-xl font-medium text-gray-700 mb-2"
              style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                color: '#34495e',
              }}
            >
              Your Skill Level
            </p>
            <div
              className="text-blue-500 text-2xl font-bold flex items-center justify-center gap-2"
              style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#007bff',
                background: '#e3f2fd',
                padding: '0.5rem 1rem',
                borderRadius: '30px',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            >
              🔥 {userSkillLevel}
            </div>
          </div>
          <div
            className="bg-white shadow-xl rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              width: '250px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
            }}
          >
            <p
              className="text-xl font-medium text-gray-700 mb-2"
              style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                color: '#34495e',
              }}
            >
              Escape Game Rank
            </p>
            <p
              className="text-gray-600 text-lg"
              style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#9b59b6',
              }}
            >
              {loadingEscapeRank ? 'Loading...' : escapeRank !== null && escapeTotal !== null
                ? `#${escapeRank} of ${escapeTotal}`
                : 'Not Ranked'}
            </p>
          </div>
          <div
            className="bg-white shadow-xl rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              width: '250px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
            }}
          >
            <p
              className="text-xl font-medium text-gray-700 mb-2"
              style={{
                fontSize: '1.3rem',
                marginBottom: '1rem',
                color: '#34495e',
              }}
            >
              Math Quiz Rank
            </p>
            <p
              className="text-gray-600 text-lg"
              style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                color: '#9b59b6',
              }}
            >
              {quizRank !== null && quizTotal !== null
                ? `#${quizRank} of ${quizTotal}`
                : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Escape Leaderboard */}
        <div
          className="w-full mb-10"
          style={{
            width: '100%',
            maxWidth: '700px',
            marginBottom: '2.5rem',
          }}
        >
          <h2
            className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center"
            style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🏁 Escape Game Leaderboard
          </h2>
          <div
            className="bg-white rounded-xl shadow-md p-4 w-full"
            style={{
              background: '#ffffffc7',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {escapeLeaderboard.length > 0 ? (
              escapeLeaderboard.slice(0, 5).map((entry, index) => (
                <div
                  className={`py-2 text-gray-700 font-medium ${
                    index < escapeLeaderboard.length - 1 ? 'border-b' : ''
                  }`}
                  key={entry.id}
                  style={{
                    padding: '0.6rem 0',
                    borderBottom: index < escapeLeaderboard.length - 1 ? '1px solid #eee' : 'none',
                    fontSize: '1rem',
                    color: '#333',
                  }}
                >
                  <span
                    className="font-bold"
                    style={{ fontWeight: 'bold', color: getRankColor(index + 1) }}
                  >
                    #{index + 1}
                  </span>{' '}
                  {entry.email} — <strong>{entry.score} pts</strong> | Level{' '}
                  {entry.levelReached}
                  {entry.createdAt && (
                    <span>
                      {' '}
                      (
                      {format(entry.createdAt, 'MMM dd, h:mm:ss a')}
                      )
                    </span>
                  )}
                </div>
              ))
            ) : (
              !loadingEscapeRank && <p>No data available</p>
            )}
          </div>
        </div>

        {/* Math Quiz Leaderboard */}
        <div
          className="w-full"
          style={{
            width: '100%',
            maxWidth: '700px',
            marginBottom: '2rem',
          }}
        >
          <h2
            className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-center"
            style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🤯 Math Quiz Leaderboard
          </h2>
          <div
            className="bg-white rounded-xl shadow-md p-4 w-full"
            style={{
              background: '#ffffffc7',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {quizLeaderboard.slice(0, 5).map((entry, index) => (
              <div
                className={`py-2 text-gray-700 font-medium ${
                  index < quizLeaderboard.length - 1 ? 'border-b' : ''
                }`}
                key={entry.id}
                style={{
                  padding: '0.6rem 0',
                  borderBottom: index < quizLeaderboard.length - 1 ? '1px solid #eee' : 'none',
                  fontSize: '1rem',
                  color: '#333',
                }}
              >
                <span
                  className="font-bold"
                  style={{ fontWeight: 'bold', color: getRankColor(index + 1) }}
                >
                  #{index + 1}
                </span>{' '}
                {entry.email} — <strong>{entry.score} pts</strong> | Level{' '}
                {entry.level}
                {entry.createdAt && (
                  <span>
                    {' '}
                    (
                    {format(entry.createdAt, 'MMM dd, h:mm:ss a')}
                    )
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getRankColor = (rank) => {
  switch (rank) {
    case 1:
      return '#e83e8c';
    case 2:
      return '#9b59b6';
    case 3:
      return '#2ecc71';
    default:
      return '#333';
  }
};

export default Dashboard;

