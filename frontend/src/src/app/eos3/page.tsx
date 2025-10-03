'use client';

import React, { useState, useEffect } from 'react';
import '../minigame.css';

/**
 * EOS3Page Component - Powerball Betting Interface
 * 
 * This component provides a comprehensive betting interface for EOS3 Min Powerball game.
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
export default function EOS3Page() {
  // State management for component functionality
  const [activeTab, setActiveTab] = useState('EOS3'); // Currently selected game tab
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
   * @param tabName - The name of the tab clicked (EOS1, EOS2, EOS3, etc.)
   * 
   * Behavior:
   * - If clicking a different game tab, navigates to that game's page
   * - If clicking current tab (EOS3), resets the interface state
   */
  const handleTabClick = (tabName: string) => {
    if (tabName !== 'EOS3') {
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
    // Clear other combination selections
    setSelectedPowerballPick({name: '', odds: ''});
    setSelectedOddEvenPick({powerball: '', normalball: '', odds: ''});
    setSelectedNormalballPick({name: '', odds: ''});
    setSelectedThreeCombinationPick({combination: '', odds: ''});
  };

  /**
   * Handles selection of Powerball Combinations betting options
   * @param pickName - The name of the selected betting option
   * @param odds - The odds for the selected option
   */
  const handlePowerballPickSelection = (pickName: string, odds: string) => {
    setSelectedPowerballPick({name: pickName, odds: odds});
    // Clear other combination selections
    setSelectedPick({name: '', odds: ''});
    setSelectedOddEvenPick({powerball: '', normalball: '', odds: ''});
    setSelectedNormalballPick({name: '', odds: ''});
    setSelectedThreeCombinationPick({combination: '', odds: ''});
  };

  /**
   * Handles selection of Powerball + Normal Ball Odd/Even Combinations
   * @param powerball - The powerball value (Odd/Even)
   * @param normalball - The normalball value (Odd/Even)
   * @param odds - The odds for the selected combination
   */
  const handleOddEvenPickSelection = (powerball: string, normalball: string, odds: string) => {
    setSelectedOddEvenPick({powerball: powerball, normalball: normalball, odds: odds});
    // Clear other combination selections
    setSelectedPick({name: '', odds: ''});
    setSelectedPowerballPick({name: '', odds: ''});
    setSelectedNormalballPick({name: '', odds: ''});
    setSelectedThreeCombinationPick({combination: '', odds: ''});
  };

  /**
   * Handles selection of Normalball Combinations
   * @param name - The name of the selected combination
   * @param odds - The odds for the selected combination
   */
  const handleNormalballPickSelection = (name: string, odds: string) => {
    setSelectedNormalballPick({name: name, odds: odds});
    // Clear other combination selections
    setSelectedPick({name: '', odds: ''});
    setSelectedPowerballPick({name: '', odds: ''});
    setSelectedOddEvenPick({powerball: '', normalball: '', odds: ''});
    setSelectedThreeCombinationPick({combination: '', odds: ''});
  };

  /**
   * Handles selection of 3-Combination
   * @param combination - The combination identifier
   * @param odds - The odds for the selected combination
   */
  const handleThreeCombinationPickSelection = (combination: string, odds: string) => {
    setSelectedThreeCombinationPick({combination: combination, odds: odds});
    // Clear other combination selections
    setSelectedPick({name: '', odds: ''});
    setSelectedPowerballPick({name: '', odds: ''});
    setSelectedOddEvenPick({powerball: '', normalball: '', odds: ''});
    setSelectedNormalballPick({name: '', odds: ''});
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
      setBetAmount('0');
    } else if (amount === 'Max') {
      setBetAmount('300000');
    } else {
      // Parse current amount (remove commas) and add new amount
      const current = parseInt(betAmount.replace(/,/g, '')) || 0;
      const add = parseInt(amount);
      setBetAmount((current + add).toString());
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

  // Individual state variables for each dropdown section
  const [powerballCombinationsOpen, setPowerballCombinationsOpen] = useState(true);
  const [normalBallSectionOpen, setNormalBallSectionOpen] = useState(true);
  const [oddEvenCombinationsOpen, setOddEvenCombinationsOpen] = useState(true);
  const [normalballCombinationsOpen, setNormalballCombinationsOpen] = useState(true);
  const [threeCombinationOpen, setThreeCombinationOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPowerballPick, setSelectedPowerballPick] = useState<{name: string, odds: string}>({name: '', odds: ''});

  // Separate state for Powerball + Normal Ball Odd/Even Combinations section
  const [selectedOddEvenPick, setSelectedOddEvenPick] = useState<{powerball: string, normalball: string, odds: string}>({powerball: '', normalball: '', odds: ''});

  // Separate state for Normalball Combinations section
  const [selectedNormalballPick, setSelectedNormalballPick] = useState<{name: string, odds: string}>({name: '', odds: ''});

  // Separate state for 3-Combination section
  const [selectedThreeCombinationPick, setSelectedThreeCombinationPick] = useState<{combination: string, odds: string}>({combination: '', odds: ''});

  /**
   * Handles the dropdown toggle with smooth animation
   * Manages animation state to prevent rapid clicking during transitions
   */
  const handleDropdownToggle = (dropdownType: string) => {
    if (isAnimating) return; // Prevent rapid clicking during animation
    
    setIsAnimating(true);
    
    switch (dropdownType) {
      case 'powerball':
        setPowerballCombinationsOpen(!powerballCombinationsOpen);
        break;
      case 'normalBallSection':
        setNormalBallSectionOpen(!normalBallSectionOpen);
        break;
      case 'oddEven':
        setOddEvenCombinationsOpen(!oddEvenCombinationsOpen);
        break;
      case 'normalball':
        setNormalballCombinationsOpen(!normalballCombinationsOpen);
        break;
      case 'threeCombination':
        setThreeCombinationOpen(!threeCombinationOpen);
        break;
    }
    
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
    <div className="minigame-app relative">
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
                      <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${powerballCombinationsOpen ? 'rotated' : ''}`} onClick={() => handleDropdownToggle('powerball')}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${powerballCombinationsOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* Single Powerball Odd bet option */}
                      <button 
                        className={`pick-btn ${selectedPowerballPick.name === 'Powerball Odd' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('Powerball Odd', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Odd</div>
                        <span className="pick-name">Powerball Odd</span>
                      </button>
                      {/* Single Powerball Even bet option */}
                      <button 
                        className={`pick-btn ${selectedPowerballPick.name === 'Powerball Even' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('Powerball Even', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Even</div>
                        <span className="pick-name">Powerball Even</span>
                      </button>
                      {/* Single Powerball Under bet option */}
                      <button 
                        className={`pick-btn ${selectedPowerballPick.name === 'Powerball Under' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('Powerball Under', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Under</div>
                        <span className="pick-name">Powerball Under</span>
                      </button>
                      {/* Single Powerball Over bet option */}
                      <button 
                        className={`pick-btn ${selectedPowerballPick.name === 'Powerball Over' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('Powerball Over', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Over</div>
                        <span className="pick-name">Powerball Over</span>
                      </button>
                      {/* Combination bet: Powerball Odd + Under */}
                      <button 
                        className={`pick-btn ${selectedPowerballPick.name === 'PaOdd-PaUnder' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('PaOdd-PaUnder', '4.1')}
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
                        className={`pick-btn ${selectedPowerballPick.name === 'PaOdd-PaOver' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('PaOdd-PaOver', '3.1')}
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
                        className={`pick-btn ${selectedPowerballPick.name === 'PaEven-PaUnder' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('PaEven-PaUnder', '3.1')}
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
                        className={`pick-btn ${selectedPowerballPick.name === 'PaEven-PaOver' ? 'selected' : ''}`}
                        onClick={() => handlePowerballPickSelection('PaEven-PaOver', '4.1')}
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
                      <span>Normal Ball Section Combinations</span>
                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${normalBallSectionOpen ? 'rotated' : ''}`} onClick={() => handleDropdownToggle('normalBallSection')}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${normalBallSectionOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* Single Powerball Odd bet option */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'Normalball Odd' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Odd', '2.7')}
                      >
                        <span className="odds">2.7</span>
                        <div className="ball blue">Small</div>
                        <span className="pick-name">Normal Ball Section 15-64</span>
                      </button>
                      {/* Single Powerball Even bet option */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'Normalball Even' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Even', '2.6')}
                      >
                        <span className="odds">2.6</span>
                        <div className="ball red">Medium</div>
                        <span className="pick-name">Normal Ball Section 65-80</span>
                      </button>
                      {/* Single Powerball Under bet option */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'Normalball Under' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Under', '2.7')}
                      >
                        <span className="odds">2.7</span>
                        <div className="ball blue">Large</div>
                        <span className="pick-name">Normal Ball Section 81-130</span>
                      </button>
                      {/* Single Powerball Over bet option */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'Normalball Over' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('Normalball Over', '4.4')}
                      >
                        <span className="odds">4.4</span>
                        <div className="ball-group">
                        <div className="ball blue">Over</div>
                        <div className="ball blue">Small</div>
                        </div>
                        <span className="pick-name">NormalBall Section Combination</span>
                      </button>
                      {/* Combination bet: Powerball Odd + Under */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'N-NUnder' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('N-NUnder', '4.2')}
                      >
                        <span className="odds">4.2</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball green">Medium</div>
                        </div>
                        <span className="pick-name">NormalBall Section Combination</span>
                      </button>
                      {/* Combination bet: Powerball Odd + Over */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'N-NOver' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('N-NOver', '4.4')}
                      >
                        <span className="odds">4.4</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball red">Large</div>
                        </div>
                        <span className="pick-name">Normal Ball Section Combination</span>
                      </button>
                      {/* Combination bet: Powerball Even + Under */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'NOdd-NUnder' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('NOdd-NUnder', '4.4')}
                      >
                        <span className="odds">4.4</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Small</div>
                        </div>
                          <span className="pick-name">Normal Ball Section Combination</span>
                      </button>
                      {/* Combination bet: Powerball Even + Over */}
                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'NEven-NOver' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('NEven-NOver', '4.2')}
                      >
                        <span className="odds">4.2</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball green">Medium</div>
                        </div>
                        <span className="pick-name">Normal Ball Section Combination</span>
                      </button>

                      <button 
                        className={`pick-btn-lg ${selectedPick.name === 'NEven-NLarge' ? 'selected' : ''}`}
                        onClick={() => handlePickSelection('NEven-NLarge', '4.4')}
                      >
                        <span className="odds">4.4</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Large</div>
                        </div>
                        <span className="pick-name">Normal Ball Section Combination</span>
                      </button>
                    </div>
                </div>

                <div className="pick-wrap">
                  <div className="pick-header">
                      <span>Powerball + Normal Ball Odd/Even Combinations</span>
                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${oddEvenCombinationsOpen ? 'rotated' : ''}`} onClick={() => handleDropdownToggle('oddEven')}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${oddEvenCombinationsOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* Powerball Odd + Normalball Odd combination */}
                      <button 
                        className={`pick-btn ${selectedOddEvenPick.powerball === 'Odd' && selectedOddEvenPick.normalball === 'Odd' ? 'selected' : ''}`}
                        onClick={() => handleOddEvenPickSelection('Odd', 'Odd', '3.3')}
                      >
                        <span className="odds">3.3</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball blue">Odd</div>
                        </div>
                        <span className="pick-name">Odd/Even Combination</span>
                      </button>
                      {/* Powerball Odd + Normalball Even combination */}
                      <button 
                        className={`pick-btn ${selectedOddEvenPick.powerball === 'Odd' && selectedOddEvenPick.normalball === 'Even' ? 'selected' : ''}`}
                        onClick={() => handleOddEvenPickSelection('Odd', 'Even', '3.3')}
                      >
                        <span className="odds">3.3</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball red">Even</div>
                        </div>
                        <span className="pick-name">Odd/Even Combination</span>
                      </button>
                      {/* Powerball Even + Normalball Odd combination */}
                      <button 
                        className={`pick-btn ${selectedOddEvenPick.powerball === 'Even' && selectedOddEvenPick.normalball === 'Odd' ? 'selected' : ''}`}
                        onClick={() => handleOddEvenPickSelection('Even', 'Odd', '3.3')}
                      >
                        <span className="odds">3.3</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Odd</div>
                        </div>
                        <span className="pick-name">Odd/Even Combination</span>
                      </button>
                      {/* Powerball Even + Normalball Even combination */}
                      <button 
                        className={`pick-btn ${selectedOddEvenPick.powerball === 'Even' && selectedOddEvenPick.normalball === 'Even' ? 'selected' : ''}`}
                        onClick={() => handleOddEvenPickSelection('Even', 'Even', '3.3')}
                      >
                        <span className="odds">3.3</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Even</div>
                        </div>
                        <span className="pick-name">Odd/Even Combination</span>
                      </button>
                    </div>
                </div>
                {/* Normalball Combinations */}
                <div className="pick-wrap">

                <div className="pick-header">
                      <span>Normalball Combinations</span>
                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${normalballCombinationsOpen ? 'rotated' : ''}`} onClick={() => handleDropdownToggle('normalball')}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${normalballCombinationsOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* Normalball Odd */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Odd' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Odd', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Odd</div>
                        <span className="pick-name">Normalball</span>
                      </button>
                      {/* Normalball Even */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Even' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Even', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Even</div>
                        <span className="pick-name">Normalball</span>
                      </button>
                      {/* Normalball Under */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Under' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Under', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball blue">Under</div>
                        <span className="pick-name">Normalball</span>
                      </button>
                      {/* Normalball Over */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Over' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Over', '1.95')}
                      >
                        <span className="odds">1.95</span>
                        <div className="ball red">Over</div>
                        <span className="pick-name">Normalball</span>
                      </button>
                      {/* Normalball Odd + Under combination */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Odd Under' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Odd Under', '3.7')}
                      >
                        <span className="odds">3.7</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball blue">Under</div>
                        </div>
                        <span className="pick-name">Normalball Combination</span>
                      </button>
                      {/* Normalball Odd + Over combination */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Odd Over' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Odd Over', '3.7')}
                      >
                        <span className="odds">3.7</span>
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball red">Over</div>
                        </div>
                        <span className="pick-name">Normalball Combination</span>
                      </button>
                      {/* Normalball Even + Under combination */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Even Under' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Even Under', '3.7')}
                      >
                        <span className="odds">3.7</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Under</div>
                        </div>
                          <span className="pick-name">Normalball Combination</span>
                      </button>
                      {/* Normalball Even + Over combination */}
                      <button 
                        className={`pick-btn ${selectedNormalballPick.name === 'Normalball Even Over' ? 'selected' : ''}`}
                        onClick={() => handleNormalballPickSelection('Normalball Even Over', '3.7')}
                      >
                        <span className="odds">3.7</span>
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Over</div>
                        </div>
                        <span className="pick-name">Normalball Combination</span>
                      </button>
                    </div>
                </div>

                <div className="pick-wrap">

                <div className="pick-header">
                      <span>Normalball Ball Combination + Powerball 3-Combination</span>
                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${threeCombinationOpen ? 'rotated' : ''}`} onClick={() => handleDropdownToggle('threeCombination')}></i>
                    </div>
                
                    <div className={`pick-grid-4 ${threeCombinationOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                      {/* 3-Combination: Odd-Under-Odd */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Odd-Under-Odd' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Odd-Under-Odd', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball blue">under</div>
                          <div className="ball blue">Odd</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Odd-Under-Even */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Odd-Under-Even' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Odd-Under-Even', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball blue">under</div>
                          <div className="ball red">Odd</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Odd-Over-Even */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Odd-Over-Even' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Odd-Over-Even', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball blue">Odd</div>
                          <div className="ball red">Over</div>
                          <div className="ball blue">Even</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Even-Under-Even */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Even-Under-Even' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Even-Under-Even', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball blue">Even</div>
                          <div className="ball red">under</div>
                          <div className="ball red">Even</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Even-Under-Odd */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Even-Under-Odd' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Even-Under-Odd', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Under</div>
                          <div className="ball blue">Odd</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Even-Under-Even */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Even-Under-Even2' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Even-Under-Even2', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball blue">Under</div>
                          <div className="ball red">Even</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Even-Over-Odd */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Even-Over-Odd' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Even-Over-Odd', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Over</div>
                          <div className="ball blue">Odd</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
                      </button>
                      {/* 3-Combination: Even-Over-Even */}
                      <button 
                        className={`pick-btn ${selectedThreeCombinationPick.combination === 'Even-Over-Even' ? 'selected' : ''}`}
                        onClick={() => handleThreeCombinationPickSelection('Even-Over-Even', '7.1')}
                      >
                        <span className="odds">7.1</span>
                        
                        <div className="ball-group">
                          <div className="ball red">Even</div>
                          <div className="ball red">Over</div>
                          <div className="ball red">Even</div>
                        </div>
                        <span className="pick-name">3-Combination</span>
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
                        EOS3Min3310226871BE2E (1256) Round
                      </div>
                      {/* Visual representation of current game results */}
                      <div className="ball-display">
                        <span>Powerball</span>
                        <div className="ball blue">Odd</div>
                        <div className="ball blue">Under</div>
                        <span>Normal Ball</span>
                        <div className="ball red">Even</div>
                        <div className="ball red">Over</div>
                        <div className="ball red">Even</div>
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
                        <span className="value pick-selection">
                          {selectedPick.name || 
                           selectedPowerballPick.name || 
                           (selectedOddEvenPick.powerball && selectedOddEvenPick.normalball ? `${selectedOddEvenPick.powerball} + ${selectedOddEvenPick.normalball}` : '') ||
                           selectedNormalballPick.name ||
                           selectedThreeCombinationPick.combination || ''}
                        </span>
                      </div>
                      {/* Display odds for selected option */}
                      <div className="stat-item">
                        <span className="label">Odds</span>
                        <span className="value odds-display">
                          {selectedPick.odds || 
                           selectedPowerballPick.odds || 
                           selectedOddEvenPick.odds ||
                           selectedNormalballPick.odds ||
                           selectedThreeCombinationPick.odds || ''}
                        </span>
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
                          type="number"
                          min="0"
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