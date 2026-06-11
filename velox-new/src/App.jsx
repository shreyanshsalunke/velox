import { useState } from 'react';
import TopBar from './components/TopBar';
import Dashboard from './views/Dashboard';
import Screener from './views/Screener';
import MomentumLeaders from './views/MomentumLeaders';
import Universe from './views/Universe';
import Analysis from './views/Analysis';
import { MARKET_REGIME } from './data/market';
import './index.css';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTicker, setSelectedTicker] = useState('NVDA');

  function handleSelectStock(ticker) {
    setSelectedTicker(ticker);
    setActiveView('analysis');
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)' }}>
      <TopBar activeView={activeView} onViewChange={setActiveView} regime={MARKET_REGIME} />
      <div style={{ flex:1, overflow:'hidden' }}>
        {activeView === 'dashboard'  && <Dashboard onSelectStock={handleSelectStock} />}
        {activeView === 'screener'   && <Screener  onSelectStock={handleSelectStock} />}
        {activeView === 'momentum'   && <MomentumLeaders onSelectStock={handleSelectStock} />}
        {activeView === 'universe'   && <Universe  onSelectStock={handleSelectStock} />}
        {activeView === 'analysis'   && <Analysis  selectedTicker={selectedTicker} />}
      </div>
    </div>
  );
}
