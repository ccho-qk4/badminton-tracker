import { useState } from 'react';
import { Trophy, User, Users, Trash2, TrendingUp, Calendar, Edit2, X, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Rally {
  winner: 'player' | 'opponent';
  length: number;
}

interface Match {
  id: number;
  type: 'singles' | 'doubles';
  date: string;
  playerName: string;
  opponentName: string;
  partnerName?: string;
  opponent2Name?: string;
  playerScore: number;
  opponentScore: number;
  rallies: Rally[];
  status: 'ongoing' | 'completed';
  result?: 'win' | 'loss';
}

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [view, setView] = useState<'home' | 'match' | 'setup'>('home');
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [pendingPoint, setPendingPoint] = useState<'player' | 'opponent' | null>(null);
  const [rallyLength, setRallyLength] = useState('');
  const [selectedMatchType, setSelectedMatchType] = useState<'singles' | 'doubles' | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [opponent2Name, setOpponent2Name] = useState('');
  const [transitionState, setTransitionState] = useState<'visible' | 'exiting' | 'entering'>('visible');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editPlayerScore, setEditPlayerScore] = useState('');
  const [editOpponentScore, setEditOpponentScore] = useState('');

  const transitionToView = (newView: 'home' | 'match' | 'setup') => {
    if (view === newView) return; // Don't transition to the same view
    
    // Start exit animation
    setTransitionState('exiting');
    
    // After exit completes, change view and start enter animation
    setTimeout(() => {
      setView(newView);
      setTransitionState('entering');
      
      // After a brief moment, transition to visible
      setTimeout(() => {
        setTransitionState('visible');
      }, 50);
    }, 300);
  };

  const showMatchSetup = (type: 'singles' | 'doubles') => {
    setSelectedMatchType(type);
    transitionToView('setup');
  };

  const startNewMatch = () => {
    if (!selectedMatchType || !playerName.trim() || !opponentName.trim()) return;
    if (selectedMatchType === 'doubles' && (!partnerName.trim() || !opponent2Name.trim())) return;
    
    setCurrentMatch({
      id: Date.now(),
      type: selectedMatchType,
      date: new Date().toISOString(),
      playerName: playerName.trim(),
      opponentName: opponentName.trim(),
      partnerName: selectedMatchType === 'doubles' ? partnerName.trim() : undefined,
      opponent2Name: selectedMatchType === 'doubles' ? opponent2Name.trim() : undefined,
      playerScore: 0,
      opponentScore: 0,
      rallies: [],
      status: 'ongoing'
    });
    transitionToView('match');
  };

  const cancelSetup = () => {
    setPlayerName('');
    setOpponentName('');
    setPartnerName('');
    setOpponent2Name('');
    setSelectedMatchType(null);
    transitionToView('home');
  };

  const addPoint = (winner: 'player' | 'opponent', rallyLength: number) => {
    if (!currentMatch) return;
    
    const updated: Match = {
      ...currentMatch,
      playerScore: winner === 'player' ? currentMatch.playerScore + 1 : currentMatch.playerScore,
      opponentScore: winner === 'opponent' ? currentMatch.opponentScore + 1 : currentMatch.opponentScore,
      rallies: [...currentMatch.rallies, { winner, length: rallyLength }]
    };
    setCurrentMatch(updated);
    setPendingPoint(null);
    setRallyLength('');
  };

  const selectWinner = (winner: 'player' | 'opponent') => {
    setPendingPoint(winner);
  };

  const submitRally = () => {
    if (pendingPoint && rallyLength && parseInt(rallyLength) > 0) {
      addPoint(pendingPoint, parseInt(rallyLength));
    }
  };

  const resetAllData = () => {
    setMatches([]);
    setCurrentMatch(null);
    setView('home');
    setPendingPoint(null);
    setRallyLength('');
    setShowResetConfirm(false);
  };

  const startEditMatch = (match: Match) => {
    setEditingMatch(match);
    setEditPlayerScore(match.playerScore.toString());
    setEditOpponentScore(match.opponentScore.toString());
  };

  const cancelEditMatch = () => {
    setEditingMatch(null);
    setEditPlayerScore('');
    setEditOpponentScore('');
  };

  const saveEditMatch = () => {
    if (!editingMatch) return;
    
    const playerScore = parseInt(editPlayerScore) || 0;
    const opponentScore = parseInt(editOpponentScore) || 0;
    
    const updatedMatches = matches.map(m => 
      m.id === editingMatch.id 
        ? { 
            ...m, 
            playerScore, 
            opponentScore,
            result: playerScore > opponentScore ? 'win' : 'loss' as 'win' | 'loss'
          }
        : m
    );
    
    setMatches(updatedMatches);
    cancelEditMatch();
  };

  const finishMatch = () => {
    if (!currentMatch) return;
    
    const completed: Match = {
      ...currentMatch,
      status: 'completed',
      result: currentMatch.playerScore > currentMatch.opponentScore ? 'win' : 'loss'
    };
    setMatches([completed, ...matches]);
    setCurrentMatch(null);
    transitionToView('home');
  };

  const calculateStats = () => {
    if (matches.length === 0) return null;
    
    const wins = matches.filter(m => m.result === 'win').length;
    const totalMatches = matches.length;
    const winRate = ((wins / totalMatches) * 100).toFixed(1);
    
    const allRallies = matches.flatMap(m => m.rallies);
    const avgRallyLength = allRallies.length > 0 
      ? (allRallies.reduce((sum, r) => sum + r.length, 0) / allRallies.length).toFixed(1)
      : '0';
    
    const avgScoreDiff = (matches.reduce((sum, m) => 
      sum + Math.abs(m.playerScore - m.opponentScore), 0) / totalMatches).toFixed(1);

    return { wins, totalMatches, winRate, avgRallyLength, avgScoreDiff };
  };

  const getChartData = () => {
    return matches.slice(0, 10).reverse().map((m, i) => ({
      match: `Match ${i + 1}`,
      yourScore: m.playerScore,
      opponentScore: m.opponentScore,
      result: m.result === 'win' ? 1 : 0
    }));
  };

  const stats = calculateStats();

  // Determine CSS class based on transition state
  const getTransitionClass = () => {
    if (transitionState === 'exiting') return 'view-container view-exit';
    if (transitionState === 'entering') return 'view-container view-enter';
    return 'view-container view-visible';
  };

  // Setup view - enter player names
  if (view === 'setup' && selectedMatchType) {
    return (
      <div key="setup-view" className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 ${getTransitionClass()}`}>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {selectedMatchType === 'singles' ? (
                  <User className="w-8 h-8 text-emerald-600" />
                ) : (
                  <Users className="w-8 h-8 text-teal-600" />
                )}
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedMatchType === 'singles' ? 'Singles' : 'Doubles'} Match Setup
                </h2>
              </div>
              <p className="text-gray-600 text-sm">Enter player names to begin</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-emerald-200 bg-emerald-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
                  autoFocus
                />
              </div>

              {selectedMatchType === 'doubles' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Partner's Name
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter your partner's name"
                    className="w-full px-4 py-3 border-2 border-emerald-200 bg-emerald-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedMatchType === 'doubles' ? 'Opponent 1' : "Opponent's Name"}
                </label>
                <input
                  type="text"
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder={selectedMatchType === 'doubles' ? "Enter opponent 1's name" : "Enter opponent's name"}
                  className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                />
              </div>

              {selectedMatchType === 'doubles' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Opponent 2
                  </label>
                  <input
                    type="text"
                    value={opponent2Name}
                    onChange={(e) => setOpponent2Name(e.target.value)}
                    placeholder="Enter opponent 2's name"
                    className="w-full px-4 py-3 border-2 border-teal-200 bg-teal-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelSetup}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={startNewMatch}
                disabled={
                  !playerName.trim() || 
                  !opponentName.trim() || 
                  (selectedMatchType === 'doubles' && (!partnerName.trim() || !opponent2Name.trim()))
                }
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
              >
                Start Match
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'match' && currentMatch) {
    return (
      <div key="match-view" className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 ${getTransitionClass()}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                {currentMatch.type === 'singles' ? <User className="text-emerald-600" /> : <Users className="text-emerald-600" />}
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentMatch.type === 'singles' ? 'Singles' : 'Doubles'} Match
                </h2>
              </div>
              <button onClick={() => transitionToView('home')} className="text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">
                  {currentMatch.playerName}
                  {currentMatch.type === 'doubles' && currentMatch.partnerName && (
                    <> & {currentMatch.partnerName}</>
                  )}
                </div>
                <div className="text-5xl font-bold text-emerald-600">{currentMatch.playerScore}</div>
                <div className="text-xs text-gray-500 mt-1">Your Score</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">
                  {currentMatch.opponentName}
                  {currentMatch.type === 'doubles' && currentMatch.opponent2Name && (
                    <> & {currentMatch.opponent2Name}</>
                  )}
                </div>
                <div className="text-5xl font-bold text-gray-700">{currentMatch.opponentScore}</div>
                <div className="text-xs text-gray-500 mt-1">Opponent</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="text-center text-sm text-gray-600 mb-2">Who won the rally?</div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => selectWinner('player')}
                  className={`py-4 px-6 rounded-lg font-semibold transition ${
                    pendingPoint === 'player' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  You Won Point
                </button>
                <button
                  onClick={() => selectWinner('opponent')}
                  className={`py-4 px-6 rounded-lg font-semibold transition ${
                    pendingPoint === 'opponent' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  Opponent Won
                </button>
              </div>

              {pendingPoint && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm text-gray-700 mb-2 font-semibold">
                    How many shots in this rally?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={rallyLength}
                      onChange={(e) => setRallyLength(e.target.value)}
                      placeholder="Enter number of shots"
                      className="flex-1 px-4 py-2 border-2 border-blue-200 bg-blue-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                      autoFocus
                    />
                    <button
                      onClick={submitRally}
                      disabled={!rallyLength || parseInt(rallyLength) <= 0}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {currentMatch.rallies.length > 0 && (
              <div className="mb-8">
                <div className="text-sm text-gray-600 mb-2">Recent Rallies</div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {currentMatch.rallies.slice(-10).reverse().map((rally, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                      rally.winner === 'player' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rally.length} shots
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={finishMatch}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition"
            >
              Finish Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key="home-view" className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 ${getTransitionClass()}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-800">Badminton Tracker</h1>
          </div>
          <p className="text-gray-600">Track your matches and improve your game</p>
          {matches.length > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowResetConfirm(true);
              }}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Statistics
            </button>
          )}
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => showMatchSetup('singles')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 group"
            >
              <User className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition" />
              <div className="text-left">
                <div className="text-xl font-bold text-gray-800">Singles Match</div>
                <div className="text-sm text-gray-600">1v1 competition</div>
              </div>
            </button>
            <button
              onClick={() => showMatchSetup('doubles')}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 group"
            >
              <Users className="w-8 h-8 text-teal-600 group-hover:scale-110 transition" />
              <div className="text-left">
                <div className="text-xl font-bold text-gray-800">Doubles Match</div>
                <div className="text-sm text-gray-600">2v2 competition</div>
              </div>
            </button>
          </div>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                <div className="text-3xl font-bold text-emerald-600">{stats.winRate}%</div>
                <div className="text-xs text-gray-500 mt-1">{stats.wins} of {stats.totalMatches} wins</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Avg Rally</div>
                <div className="text-3xl font-bold text-teal-600">{stats.avgRallyLength}</div>
                <div className="text-xs text-gray-500 mt-1">shots per rally</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Total Matches</div>
                <div className="text-3xl font-bold text-blue-600">{stats.totalMatches}</div>
                <div className="text-xs text-gray-500 mt-1">games played</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Avg Score Diff</div>
                <div className="text-3xl font-bold text-purple-600">{stats.avgScoreDiff}</div>
                <div className="text-xs text-gray-500 mt-1">points difference</div>
              </div>
            </div>

            {matches.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  Performance History
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="yourScore" fill="#10b981" name="Your Score" />
                    <Bar dataKey="opponentScore" fill="#6b7280" name="Opponent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-600" />
                Match History
              </h3>
              <div className="space-y-3">
                {matches.slice(0, 10).map(match => (
                  <div key={match.id} className="p-4 bg-gray-50 rounded-lg">
                    {editingMatch?.id === match.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          {match.type === 'singles' ? <User className="w-5 h-5 text-gray-600" /> : <Users className="w-5 h-5 text-gray-600" />}
                          <div>
                            <div className="font-semibold text-gray-800">
                              {match.playerName}
                              {match.type === 'doubles' && match.partnerName && ` & ${match.partnerName}`}
                              {' vs '}
                              {match.opponentName}
                              {match.type === 'doubles' && match.opponent2Name && ` & ${match.opponent2Name}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {match.type.charAt(0).toUpperCase() + match.type.slice(1)} • {new Date(match.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">{match.playerName} Score</label>
                            <input
                              type="number"
                              value={editPlayerScore}
                              onChange={(e) => setEditPlayerScore(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-emerald-200 bg-emerald-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              min="0"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">{match.opponentName} Score</label>
                            <input
                              type="number"
                              value={editOpponentScore}
                              onChange={(e) => setEditOpponentScore(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-200 bg-gray-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                              min="0"
                            />
                          </div>
                          <div className="flex gap-2 items-end">
                            <button
                              onClick={saveEditMatch}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditMatch}
                              className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {match.type === 'singles' ? <User className="w-5 h-5 text-gray-600" /> : <Users className="w-5 h-5 text-gray-600" />}
                          <div>
                            <div className="font-semibold text-gray-800">
                              {match.playerName}
                              {match.type === 'doubles' && match.partnerName && ` & ${match.partnerName}`}
                              {' vs '}
                              {match.opponentName}
                              {match.type === 'doubles' && match.opponent2Name && ` & ${match.opponent2Name}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {match.type.charAt(0).toUpperCase() + match.type.slice(1)} • {new Date(match.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-gray-800">
                              {match.playerScore} - {match.opponentScore}
                            </div>
                            <div className="text-sm text-gray-600">
                              {match.rallies.length} rallies
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            match.result === 'win' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {match.result === 'win' ? 'Won' : 'Lost'}
                          </div>
                          <button
                            onClick={() => startEditMatch(match)}
                            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit match"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {matches.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No matches yet. Start your first match above!
                </div>
              )}
            </div>
          </>
        )}

        {!stats && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Start Your First Match</h3>
            <p className="text-gray-600">Track your games and watch your stats grow!</p>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex sm:items-center items-start sm:justify-center justify-center p-4 z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 fade-in mt-4 sm:mt-0">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reset All Statistics?</h3>
              <p className="text-gray-600">
                This will permanently delete all your match history and statistics. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={resetAllData}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
