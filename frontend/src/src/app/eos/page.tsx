'use client';

import React, { useState, useEffect } from 'react';
import '../minigame.css';

export default function EOSPage() {
  const [activeTab, setActiveTab] = useState('EOS');
  const [currentTime, setCurrentTime] = useState<string>('00:00:00');
  const [iframeVisible, setIframeVisible] = useState(true);
  const [selectedPick, setSelectedPick] = useState<{name: string, odds: string}>({name: '', odds: ''});
  const [betAmount, setBetAmount] = useState<string>('');
  const [balance] = useState<string>('300,000 Won');
  const [winAmount] = useState<string>('292,500');

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tabName: string) => {
    if (tabName !== 'EOS') {
      // Navigate to the appropriate page
      window.location.href = `/${tabName.toLowerCase()}`;
      return;
    }
    setActiveTab(tabName);
    setIframeVisible(true);
    setSelectedPick({name: '', odds: ''});
    setBetAmount('');
  };

  const handlePickSelection = (pickName: string, odds: string) => {
    setSelectedPick({name: pickName, odds: odds});
  };

  const handleAmountClick = (amount: string) => {
    if (amount === 'Reset') {
      setBetAmount('');
    } else if (amount === 'Max') {
      setBetAmount('300000');
    } else {
      const current = parseInt(betAmount.replace(/,/g, '')) || 0;
      const add = parseInt(amount);
      setBetAmount(formatNumber(current + add));
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getGameName = (tab: string) => {
    const gameNames: {[key: string]: string} = {
      'EOS1': 'EOS1 Min Powerball',
      'EOS2': 'EOS2 Min Powerball', 
      'EOS3': 'EOS3 Min Powerball',
      'EOS4': 'EOS4 Min Powerball',
      'EOS5': 'EOS5 Min Powerball',
      'Bepick': 'Bepick',
      'EOS': 'EOS',
      'PBG': 'PBG',
      'Dhpowerball': 'Dhpowerball'
    };
    return gameNames[tab] || tab;
  };

  const getIframeSrc = (tab: string) => {
    const iframeSrcs: {[key: string]: string} = {
      'EOS1': 'https://ntry.com/scores/eos_powerball/1min/main.php',
      'EOS2': 'https://ntry.com/scores/eos_powerball/2min/main.php',
      'EOS3': 'https://ntry.com/scores/eos_powerball/3min/main.php',
      'EOS4': 'https://ntry.com/scores/eos_powerball/4min/main.php',
      'EOS5': 'https://ntry.com/scores/eos_powerball/5min/main.php',
      'Bepick': 'https://ntry.com/scores/bepick/main.php',
      'EOS': 'https://ntry.com/scores/eos/main.php',
      'PBG': 'https://ntry.com/scores/pbg/main.php',
      'Dhpowerball': 'https://ntry.com/scores/dhpowerball/main.php'
    };
    return iframeSrcs[tab] || '';
  };

  return (
    <div className="minigame-app">
      {/* Header tabs */}
      <header>
        <div className="container">
          <div className="tabs-container">
            <div 
              className={`tab-item ${activeTab === 'EOS1' ? 'active' : ''}`} 
              onClick={() => handleTabClick('EOS1')}
            >
              EOS1 Min
            </div>
            <div 
              className={`tab-item ${activeTab === 'EOS2' ? 'active' : ''}`} 
              onClick={() => handleTabClick('EOS2')}
            >
              EOS2 Min
            </div>
            <div 
              className={`tab-item ${activeTab === 'EOS3' ? 'active' : ''}`} 
              onClick={() => handleTabClick('EOS3')}
            >
              EOS3 Min
            </div>
            <div 
              className={`tab-item ${activeTab === 'EOS4' ? 'active' : ''}`} 
              onClick={() => handleTabClick('EOS4')}
            >
              EOS4 Min
            </div>
            <div 
              className={`tab-item ${activeTab === 'EOS5' ? 'active' : ''}`} 
              onClick={() => handleTabClick('EOS5')}
            >
              EOS5 Min
            </div>
            <div 
              className={`tab-item ${activeTab === 'Bepick' ? 'active' : ''}`} 
              onClick={() => handleTabClick('Bepick')}
            >
              Bepick
            </div>
            <div 
              className={`tab-item ${activeTab === 'EOS' ? 'active' : ''}`} 
              onClick={() => handleTabClick('EOS')}
            >
              EOS
            </div>
            <div 
              className={`tab-item ${activeTab === 'PBG' ? 'active' : ''}`} 
              onClick={() => handleTabClick('PBG')}
            >
              PBG
            </div>
            <div 
              className={`tab-item ${activeTab === 'Dhpowerball' ? 'active' : ''}`} 
              onClick={() => handleTabClick('Dhpowerball')}
            >
              Dhpowerball
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main>
        <div className="container">
          <div className="tab-content active">
            <div className="content-wrapper">
              <div className="left-column left-col">
                <div className="game-info-bar info-bar">
                  <div className="time-display">
                    <i className="fa fa-clock-o"></i>
                    <span className="time-display-span">{currentTime}</span>
                  </div>
                  <div className="game-name-display">{getGameName(activeTab)}</div>
                  <button 
                    className="toggle-iframe-btn"
                    onClick={() => setIframeVisible(!iframeVisible)}
                  >
                    {iframeVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {iframeVisible && (
                  <div className="iframe-section iframe-sec">
                    <div className="iframe-wrapper">
                      <iframe
                        src={getIframeSrc(activeTab)}
                        className="game-iframe"
                        scrolling="no"
                      />
                    </div>
                  </div>
                )}

                <div className="betting-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Round</th>
                        <th>Bet/Odds</th>
                        <th>Bet Amount</th>
                        <th>Win Amount</th>
                        <th>Status</th>
                        <th>-</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>E256</td>
                        <td>EOS Powerball Odd/3.1</td>
                        <td>55,000</td>
                        <td>170,500</td>
                        <td><span className="status-badge in-progress">In Progress</span></td>
                        <td><i className="fa fa-times"></i></td>
                      </tr>
                      <tr>
                        <td>E255</td>
                        <td>EOS Powerball Even/1.95</td>
                        <td>88,000</td>
                        <td>171,600</td>
                        <td><span className="status-badge finished">Finished</span></td>
                        <td><i className="fa fa-times"></i></td>
                      </tr>
                      <tr>
                        <td>E254</td>
                        <td>EOS Powerball Under/1.95</td>
                        <td>125,000</td>
                        <td>243,750</td>
                        <td><span className="status-badge finished">Finished</span></td>
                        <td><i className="fa fa-times"></i></td>
                      </tr>
                      <tr>
                        <td>E253</td>
                        <td>EOS Powerball Over/1.95</td>
                        <td>95,000</td>
                        <td>185,250</td>
                        <td><span className="status-badge finished">Finished</span></td>
                        <td><i className="fa fa-times"></i></td>
                      </tr>
                      <tr>
                        <td>E252</td>
                        <td>EOS PaEven-PaOver/4.1</td>
                        <td>75,000</td>
                        <td>307,500</td>
                        <td><span className="status-badge finished">Finished</span></td>
                        <td><i className="fa fa-times"></i></td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="pagination">
                    <button>‹</button>
                    <button>1</button>
                    <button className="active">2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>›</button>
                  </div>
                </div>
              </div>

              <div className="right-column right-col">
                <div className="betting-panel">
                  <div className="pick-section">
                    <div className="pick-header">
                      <span>Powerball Combinations</span>
                      <i className="fa fa-chevron-down"></i>
                    </div>
                    <div className="pick-grid">
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Odd' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Odd', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Odd</div>
                        <span className="pick-name">Powerball Odd</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Even' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Even', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Even</div>
                        <span className="pick-name">Powerball Even</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Under' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Under', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Under</div>
                        <span className="pick-name">Powerball Under</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Over' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Over', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Over</div>
                        <span className="pick-name">Powerball Over</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'PaOdd-PaUnder' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('PaOdd-PaUnder', '4.1')}
                      >
                        <span className="odds">4.1</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball blue">Under</div>
                        </div>
                        <span className="pick-name">PaOdd-PaUnder</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'PaOdd-PaOver' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('PaOdd-PaOver', '3.1')}
                      >
                        <span className="odds">3.1</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball red">Over</div>
                        </div>
                        <span className="pick-name">PaOdd-PaOver</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'PaEven-PaUnder' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('PaEven-PaUnder', '3.1')}
                      >
                        <span className="odds">3.1</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Under</div>
                        </div>
                        <span className="pick-name">PaEven-PaUnder</span>
                      </button>
                      <button 
                        className={`pick-btn ${selectedPick.name === 'PaEven-PaOver' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('PaEven-PaOver', '4.1')}
                      >
                        <span className="odds">4.1</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Over</div>
                        </div>
                        <span className="pick-name">PaEven-PaOver</span>
                      </button>
                    </div>
                  </div>

                  <div className="betinfo-section">
                    <div className="current-round-info">
                      <div className="round-header">
                        <span className="round-title">Current Round [E257]</span>
                        <span className="countdown">03:10</span>
                      </div>
                      <div className="round-details">
                        EOSMin3310226871BE2E (E256) Round
                      </div>
                      <div className="ball-display">
                        <span>Powerball</span>
                        <div className="ball blue">Odd</div>
                        <div className="ball blue">Under</div>
                        <span>Normal Ball</span>
                        <div className="ball blue">Odd</div>
                        <div className="ball blue">Under</div>
                      </div>
                      <div className="betting-stats">
                        <span className="prev-bet">Previous Betting【0】</span>
                        <span className="prev-win">Previous Win【0】</span>
                        <span className="curr-bet">Current Betting【0】</span>
                      </div>
                    </div>

                    <div className="bet-form">
                      <div className="form-row">
                        <span className="label">Pick Selection</span>
                        <span className="value pick-selection">{selectedPick.name || ''}</span>
                      </div>
                      <div className="form-row">
                        <span className="label">Odds</span>
                        <span className="value odds-display">{selectedPick.odds || ''}</span>
                      </div>
                      <div className="form-row">
                        <span className="label">Balance</span>
                        <span className="value myCash">{balance}</span>
                      </div>
                      <div className="form-row">
                        <span className="label">Win Amount</span>
                        <span className="value win-amount">{winAmount}</span>
                      </div>

                      <div className="amount-input-row">
                        <span className="label">Betting Amount</span>
                        <input 
                          type="text" 
                          className="amount-input" 
                          placeholder="Numbers only"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                        />
                      </div>

                      <div className="amount-buttons">
                        <button className="amount-btn" onClick={() => handleAmountClick('10000')}>10K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('20000')}>20K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('30000')}>30K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('50000')}>50K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('100000')}>100K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('300000')}>300K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('500000')}>500K</button>
                        <button className="amount-btn" onClick={() => handleAmountClick('1000000')}>1M</button>
                        <button className="amount-btn clear" onClick={() => handleAmountClick('Reset')}>Reset</button>
                        <button className="amount-btn max" onClick={() => handleAmountClick('Max')}>Max</button>
                        <button className="amount-btn confirm">Betting</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}