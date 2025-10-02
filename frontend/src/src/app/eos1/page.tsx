'use client';

import React, { useState, useEffect } from 'react';
import '../minigame.css';

/**
 * EOS1Page Component - Powerball Betting Interface
 * 
 * This component provides a comprehensive betting interface for EOS1 Min Powerball game.
 * It includes real-time game display, betting options, bet history, and amount management.
 * 
 * Features:
 * - Multi-game tab navigation (EOS1-5, Bepick, EOS, PBG, Dhpowerball)
 * - Real-time clock display
 * - Embedded iframe for live game visualization
 * - Powerball betting combinations (Odd/Even, Over/Under, Combinations)
 * - Bet amount management with quick selection buttons
 * - Betting history table with pagination
 * - Current round information and statistics
 */
export default function EOS1Page() {
  // State management for component functionality
  const [activeTab, setActiveTab] = useState('EOS1'); // Currently selected game tab
  const [currentTime, setCurrentTime] = useState<string>('00:00:00'); // Real-time clock display
  const [iframeVisible, setIframeVisible] = useState(true); // Controls iframe visibility toggle
  const [selectedPick, setSelectedPick] = useState<{name: string, odds: string}>({name: '', odds: ''}); // Selected betting option
  const [betAmount, setBetAmount] = useState<string>(''); // User's bet amount input
  const [balance] = useState<string>('300,000 Won'); // User's current balance (static for demo)
  const [winAmount] = useState<string>('292,500'); // Potential win amount (static for demo)

  /**
   * Real-time clock effect hook
   * Updates the current time display every second in HH:MM:SS format
   * Cleans up the interval when component unmounts to prevent memory leaks
   */
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
    
    updateTime(); // Initial time update
    const interval = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  /**
   * Handles tab navigation between different game types
   * @param tabName - The name of the tab clicked (EOS1, EOS2, Bepick, etc.)
   * 
   * Behavior:
   * - If clicking a different game tab, navigates to that game's page
   * - If clicking current tab (EOS1), resets the interface state
   */
  const handleTabClick = (tabName: string) => {
    if (tabName !== 'EOS1') {
      // Navigate to the appropriate game page
      window.location.href = `/${tabName.toLowerCase()}`;
      return;
    }
    // Reset interface state for current tab
    setActiveTab(tabName);
    setIframeVisible(true);
    setSelectedPick({name: '', odds: ''});
    setBetAmount('');
  };

  /**
   * Handles selection of betting options (Powerball Odd/Even, Over/Under, etc.)
   * @param pickName - The name of the selected betting option
   * @param odds - The odds for the selected option
   */
  const handlePickSelection = (pickName: string, odds: string) => {
    setSelectedPick({name: pickName, odds: odds});
  };

  /**
   * Handles bet amount input via quick selection buttons
   * @param amount - The amount to add, 'Reset' to clear, or 'Max' for maximum bet
   * 
   * Behavior:
   * - 'Reset': Clears the bet amount
   * - 'Max': Sets bet amount to maximum (300,000)
   * - Numeric values: Adds to current bet amount
   */
  const handleAmountClick = (amount: string) => {
    if (amount === 'Reset') {
      setBetAmount('');
    } else if (amount === 'Max') {
      setBetAmount('300000');
    } else {
      // Parse current amount (remove commas) and add new amount
      const current = parseInt(betAmount.replace(/,/g, '')) || 0;
      const add = parseInt(amount);
      setBetAmount(formatNumber(current + add));
    }
  };

  /**
   * Formats numbers with comma separators for better readability
   * @param num - The number to format
   * @returns Formatted number string with commas (e.g., "1,000,000")
   */
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  /**
   * Maps tab names to their display names
   * @param tab - The tab identifier
   * @returns The formatted game name for display
   */
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

  const [pickSectionPower, setPickSectionPower] = useState(true);
  const [pickSectionNormal, setPickSectionNormal] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Handles the dropdown toggle with smooth animation
   * Manages animation state to prevent rapid clicking during transitions
   */
  const handlePickSectionToggle = () => {
    if (isAnimating) return; // Prevent rapid clicking during animation
    
    setIsAnimating(true);
    setPickSectionPower(!pickSectionPower);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  /**
   * Maps tab names to their corresponding iframe URLs for live game display
   * @param tab - The tab identifier
   * @returns The iframe source URL for the selected game
   */
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
      {/* 
        Header Section - Game Navigation Tabs
        Provides navigation between different Powerball game variants
        Each tab represents a different game type with varying intervals
      */}
      <header className = "fixed-header">
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

      {/* 
        Main Content Area
        Contains the betting interface with two main columns:
        - Left: Game display, betting history, and current round info
        - Right: Betting options and amount selection
      */}
      <main className='mt-[50px]'>
        <div className="container">
          <div className="tab-content active">
            <div className="content-wrapper">
              {/* 
                Left Column - Game Information and History
                Contains real-time game display, betting history table, and current round details
              */}
              <div className="left-column left-col">
                {/* 
                  Game Info Bar - Top section with time, game name, and iframe toggle
                  Displays current time, active game name, and controls iframe visibility
                */}
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
                
                {/* 
                  Live Game Display - Embedded iframe showing real-time game visualization
                  Conditionally rendered based on iframeVisible state
                  Displays live Powerball game results and animations
                */}
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

                {/* 
                  Betting History Table - Shows user's recent betting activity
                  Displays round numbers, bet types, amounts, win amounts, and status
                  Includes pagination for navigating through betting history
                */}
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
                      {/* Sample betting history data - in production this would come from API */}
                      <tr>
                        <td>1256</td>
                        <td>Powerball Odd/3.1</td>
                        <td>15,000</td>
                        <td>46,500</td>
                        <td><span className="status-badge status-active">In Progress</span></td>
                        <td><i className="fa fa-trash text-red"></i></td>
                      </tr>
                      <tr>
                        <td>1255</td>
                        <td>Powerball Even/1.95</td>
                        <td>80,000</td>
                        <td>156,000</td>
                        <td><span className="status-badge status-inactive">Finished</span></td>
                        <td><i className="fa fa-trash text-red"></i></td>
                      </tr>
                      <tr>
                        <td>1254</td>
                        <td>Powerball Under/1.95</td>
                        <td>120,000</td>
                        <td>234,000</td>
                        <td><span className="status-badge status-inactive">Finished</span></td>
                        <td><i className="fa fa-trash text-red"></i></td>
                      </tr>
                      <tr>
                        <td>1253</td>
                        <td>Powerball Over/1.95</td>
                        <td>60,000</td>
                        <td>117,000</td>
                        <td><span className="status-badge status-inactive">Finished</span></td>
                        <td><i className="fa fa-trash text-red"></i></td>
                      </tr>
                      <tr>
                        <td>1252</td>
                        <td>PaOdd-PaUnder/4.1</td>
                        <td>25,000</td>
                        <td>102,500</td>
                        <td><span className="status-badge status-inactive">Finished</span></td>
                        <td><i className="fa fa-trash text-red"></i></td>
                      </tr>
                    </tbody>
                  </table>
                  
                  {/* Pagination controls for navigating betting history */}
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

              {/* 
                Right Column - Betting Interface
                Contains betting options, amount selection, and current round information
              */}
              <div className="right-column right-col">
               <div className="bet-sidebar">
                <div className="pick-wrap">

                <div className="pick-header">
                      <span>Powerball Combinations</span>
                      <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionPower ? 'rotated' : ''}`} onClick={() => setPickSectionPower(!pickSectionPower)}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${pickSectionPower ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* Single Powerball Odd bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Odd' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Odd', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Odd</div>
                        <span className="pick-name">Powerball Odd</span>
                      </button>
                      {/* Single Powerball Even bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Even' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Even', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Even</div>
                        <span className="pick-name">Powerball Even</span>
                      </button>
                      {/* Single Powerball Under bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Under' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Under', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Under</div>
                        <span className="pick-name">Powerball Under</span>
                      </button>
                      {/* Single Powerball Over bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Powerball Over' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Powerball Over', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Over</div>
                        <span className="pick-name">Powerball Over</span>
                      </button>
                      {/* Combination bet: Powerball Odd + Under */}
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
                      {/* Combination bet: Powerball Odd + Over */}
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
                      {/* Combination bet: Powerball Even + Under */}
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
                      {/* Combination bet: Powerball Even + Over */}
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
                <div className="pick-wrap">

                <div className="pick-header">
                      <span>Normalball Combinations</span>
                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionNormal ? 'rotated' : ''}`} onClick={() => setPickSectionNormal(!pickSectionNormal)}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${pickSectionNormal ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* Single Powerball Odd bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Normalball Odd' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Odd', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Odd</div>
                        <span className="pick-name">Normalball Odd</span>
                      </button>
                      {/* Single Powerball Even bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Normalball Even' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Even', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Even</div>
                        <span className="pick-name">Normalball Even</span>
                      </button>
                      {/* Single Powerball Under bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Normalball Under' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Under', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Under</div>
                        <span className="pick-name">Normalball Under</span>
                      </button>
                      {/* Single Powerball Over bet option */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'Normalball Over' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Over', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Over</div>
                        <span className="pick-name">Normalball Over</span>
                      </button>
                      {/* Combination bet: Powerball Odd + Under */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'N-NUnder' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('N-NUnder', '4.1')}
                      >
                        <span className="odds">4.1</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball blue">Under</div>
                        </div>
                        <span className="pick-name">N-NUnder</span>
                      </button>
                      {/* Combination bet: Powerball Odd + Over */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'N-NOver' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('N-NOver', '3.1')}
                      >
                        <span className="odds">3.1</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball red">Over</div>
                        </div>
                        <span className="pick-name">N-NOver</span>
                      </button>
                      {/* Combination bet: Powerball Even + Under */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'NOdd-NUnder' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('NOdd-NUnder', '3.1')}
                      >
                        <span className="odds">3.1</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Under</div>
                        </div>
                          <span className="pick-name">NOdd-NUnder</span>
                      </button>
                      {/* Combination bet: Powerball Even + Over */}
                      <button 
                        className={`pick-btn ${selectedPick.name === 'NEven-NOver' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('NEven-NOver', '4.1')}
                      >
                        <span className="odds">4.1</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Over</div>
                        </div>
                        <span className="pick-name">NEven-NOver</span>
                      </button>
                    </div>
                </div>
               </div>
              <div className="bet-sidebar">
                    <div className="current-round-info">
                      <div className="round-header">
                        <span className="round-title">Current Round [1257]</span>
                        <span className="countdown">03:45</span>
                      </div>
                      <div className="round-details">
                        EOS1Min3310226871BE2E (1256) Round
                      </div>
                      {/* Visual representation of current game results */}
                      <div className="ball-display">
                        <span>Powerball</span>
                        <div className="ball blue">Odd</div>
                        <div className="ball blue">Under</div>
                        <span>Normal Ball</span>
                        <div className="ball blue">Odd</div>
                        <div className="ball blue">Under</div>
                      </div>
                      {/* Betting statistics for current session */}
                      <div className="betting-stats">
                        <span className="prev-bet">Previous Betting【0】</span>
                        <span className="prev-win">Previous Win【0】</span>
                        <span className="curr-bet">Current Betting【0】</span>
                      </div>
                    </div>

                    {/* 
                      Betting Form - User input and confirmation section
                      Displays selected bet details, balance, and amount input controls
                    */}
                    <div className="betinfo-stats">
                      {/* Display selected betting option */}
                      <div className="stat-item">
                        <span className="label">Pick Selection</span>
                        <span className="value pick-selection">{selectedPick.name || ''}</span>
                      </div>
                      {/* Display odds for selected option */}
                      <div className="stat-item">
                        <span className="label">Odds</span>
                        <span className="value odds-display">{selectedPick.odds || ''}</span>
                      </div>
                      {/* Display user's current balance */}
                      <div className="stat-item">
                        <span className="label">Balance</span>
                        <span className="value myCash">{balance}</span>
                      </div>
                      {/* Display potential win amount */}
                      <div className="stat-item">
                        <span className="label">Win Amount</span>
                        <span className="value win-amount">{winAmount}</span>
                      </div>

                      {/* Bet amount input field */}
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
                    </div>
                    {/* Quick amount selection buttons and betting confirmation */}
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
      </main>
      <footer className = "text-center text-white-500 text-md border-t border-gray-800 pt-4 pb-[30px] bg-[#0f172a]">
          © 2025 ToToClub. All rights reserved.
      </footer>
    </div>
  );
}