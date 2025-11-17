'use client';

import React, { useState, useEffect } from 'react';
import '../minigame.css';
import { MiniBetOptionsAPI, MiniBetOption } from '../../services/miniBetOptionsAPI';
import { useTranslations } from 'next-intl';
import api from '@/api';
import { message, Spin } from 'antd';
import dayjs from 'dayjs';
import { formatNumber } from '@/lib';

export default function EOS4Page() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState('EOS4'); // Currently selected game tab
    const [currentTime, setCurrentTime] = useState<string>('00:00:00'); // Real-time clock display
    const [iframeVisible, setIframeVisible] = useState(true); // Controls iframe visibility toggle
    const [selectedPick, setSelectedPick] = useState<{name: string, odds: string, category?: string, id?: number}>({name: '', odds: ''}); // Selected betting option
    const [betAmount, setBetAmount] = useState<string>(''); // User's bet amount input
    // Calculate win amount as selected odds * betting amount
    const winAmount = React.useMemo(() => {
        const odds = parseFloat(selectedPick.odds) || 0;
        const amount = parseFloat(betAmount) || 0;
        return odds * amount;
    }, [selectedPick.odds, betAmount]);
    const [userBalance, setUserBalance] = useState<number>(0);
    const [bettingHistory, setBettingHistory] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageSize = 5;
    // const [currentRound, setCurrentRound] = useState<string>('');

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

    const handleBettingClick = () => {
        if (selectedPick.name === '' || selectedPick.odds === '' || betAmount === '') {
            message.error(t('pleaseSelectOption'));
            return;
        }
        if (Number(betAmount) > userBalance) {
            message.error(t('balanceNotEnough'));
            return;
        }
        setBettingLoading(true);
        api("mini/bet", {
            method: "POST",
            data: {
                gameType : "eos4min",
                category: selectedPick.category,
                pick: selectedPick.name,
                odds: selectedPick.odds,
                amount: betAmount,
                betOptionId: selectedPick.id || 0
            }
        }).then((res: any) => {
            console.log(res.data);
            message.success('Bet placed successfully!');
            setSelectedPick({name: '', odds: ''});
            setBetAmount('');
            // Reset to page 1 and refresh betting history and balance
            setCurrentPage(1);
            loadBettingHistory(1);
            loadUserBalance();
        }).catch((err: any) => {
            message.error(err.response?.data?.error || 'Failed to place bet');
        }).finally(() => {
            setBettingLoading(false);
        });
    }

    const loadBettingHistory = async (page: number = 1) => {
        try {
            const response = await api(`mini/history?gameType=eos4min&page=${page}&limit=${pageSize}`);
            console.log('Full API response:', response);
            console.log('Response data:', response.data);
            console.log('Response data.data:', response.data?.data);
            setBettingHistory(response.data || []);
            setTotalCount(response.count || 0);
        } catch (error) {
            console.error('Error loading betting history:', error);
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadBettingHistory(page);
    }

    const loadUserBalance = async () => {
        try {
            const res = await api("user/me");
            setUserBalance(res.data.profile.balance);
        } catch (error) {
            console.error('Error loading balance:', error);
        }
    }

    // Load betting options from API
    useEffect(() => {
        const loadBettingOptions = async () => {
        setLoading(true);
        try {
            const options = await MiniBetOptionsAPI.getOptions({
            gameType: 'eos4min',
            level: 1,
            enabled: true
            });

            const powerball = options.filter(opt => opt.category === 'powerball');
            const normalball = options.filter(opt => opt.category === 'normalball');

            setPowerballOptions(powerball);
            setNormalballOptions(normalball);
        } catch (error) {
            console.error('Error loading betting options:', error);
        } finally {
            setLoading(false);
        }
        };

        loadBettingOptions();
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
        if (tabName !== 'EOS4') {
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
     * @param category - The category of the bet
     * @param id - The ID of the bet option
     */
    const handlePickSelection = (pickName: string, odds: string, category: string, id?: number) => {
        setSelectedPick({name: pickName, odds: odds, category: category, id: id});
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
    const [loading, setLoading] = useState(false);
    const [bettingLoading, setBettingLoading] = useState(false);
    const [powerballOptions, setPowerballOptions] = useState<MiniBetOption[]>([]);
    const [normalballOptions, setNormalballOptions] = useState<MiniBetOption[]>([]);

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

    // GET the user detail info and betting history
    useEffect(() => {
        loadUserBalance();
        loadBettingHistory();
    }, []);

    // Auto-refresh betting history every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadBettingHistory(currentPage);
        }, 10000); // 10 seconds
        loadUserBalance();
        return () => clearInterval(interval); // Cleanup on unmount
    }, [currentPage]); // Re-run when currentPage changes

    /**
     * Maps tab names to their corresponding iframe URLs for live game display
     * @param tab - The tab identifier
     * @returns The iframe sourcel URL for the selected game
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

    /**
     * Renders a betting option button
     * @param option - The betting option to render
     */
    const renderBettingOption = (option: MiniBetOption, category: string) => {
        const isSelected = selectedPick.name === option.name && selectedPick.category === category;
        
        return (
        <button 
            key={option.id}
            className={`pick-btn ${isSelected ? 'selected' : ''}`}
            onClick={() => handlePickSelection(option.name, option.odds, category, option.id)}
        >
            <span className="odds">{option.odds}</span>
            {option.type === 'single' ? (
            <div className={`ball ${option.ball}`}>{option.text}</div>
            ) : (
            <div className="ball-group">
                {option.balls?.map((ball, index) => (
                <div key={index} className={`ball ${ball.color}`}>{ball.text}</div>
                ))}
            </div>
            )}
            <span className="pick-name">{option.name}</span>
        </button>
        );
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
                {/* <div 
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
                </div> */}
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
                    {iframeVisible && (
                    <div className="iframe-section iframe-sec">
                        <div className="iframe-wrapper flex items-center justify-center"> 
                        <iframe
                            src={getIframeSrc(activeTab)}
                            className="game-iframe !z-10 !opacity-100 m-auto"
                            scrolling="no"
                        />
                        </div>
                    </div>
                    )}
                    <div className="betting-table">
                    <table>
                        <thead>
                        <tr>
                            <th>{t("round")}</th>
                            <th>{t("betTypeOdds")}</th>
                            <th>{t("betAmount")}</th>
                            <th>{t("winAmount")}</th>
                            <th>{t("status")}</th>
                            <th>{t("createdAt")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bettingHistory.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                    No betting history yet
                                </td>
                            </tr>
                        ) : (
                            bettingHistory.map((bet: any, index: number) => (
                                <tr key={bet.id || index}>
                                    <td>{bet.round}</td>
                                    <td>{bet.pickSelection}/{bet.odds}</td>
                                    <td>{bet.amount.toLocaleString()}</td>
                                    {
                                        bet.result === "lose"
                                        ? <td>0</td>
                                        : <td>{(bet.amount * bet.odds).toLocaleString()}</td>
                                    }
                                    <td>
                                        {/* pending, won, lost */}
                                        <span className={
                                            `status-badge ` +
                                            (bet.result === 'pending'
                                                ? 'badge-blue'
                                                : bet.result === 'win'
                                                ? 'badge-green'
                                                : bet.result === 'lose'
                                                ? 'badge-danger'
                                                : 'badge-default')
                                        }>
                                            {bet.result === 'pending'
                                                ? t('pending')
                                                : bet.result === 'win'
                                                ? t('won')
                                                : bet.result === "lose"
                                                ? t('lost')
                                                : bet.result}
                                        </span>
                                    </td>
                                    <td>{dayjs(bet.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                    
                    {/* Pagination controls for navigating betting history */}
                    <div className="pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        >‹</button>
                        {(() => {
                            const totalPages = Math.ceil(totalCount / pageSize);
                            const pages: (number | string)[] = [];
                            
                            if (totalPages <= 7) {
                                // Show all pages if 7 or less
                                for (let i = 1; i <= totalPages; i++) {
                                    pages.push(i);
                                }
                            } else {
                                // More than 7 pages - show ellipsis
                                if (currentPage <= 4) {
                                    // Near the beginning
                                    for (let i = 1; i <= 5; i++) {
                                        pages.push(i);
                                    }
                                    pages.push('...');
                                    pages.push(totalPages);
                                } else if (currentPage >= totalPages - 3) {
                                    // Near the end
                                    pages.push(1);
                                    pages.push('...');
                                    for (let i = totalPages - 4; i <= totalPages; i++) {
                                        pages.push(i);
                                    }
                                } else {
                                    // In the middle
                                    pages.push(1);
                                    pages.push('...');
                                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                        pages.push(i);
                                    }
                                    pages.push('...');
                                    pages.push(totalPages);
                                }
                            }
                            
                            return pages.map((page, index) => {
                                if (page === '...') {
                                    return <span key={`ellipsis-${index}`} className="ellipsis">...</span>;
                                }
                                return (
                                    <button 
                                        key={page}
                                        className={currentPage === page ? 'active' : ''}
                                        onClick={() => handlePageChange(page as number)}
                                    >
                                        {page}
                                    </button>
                                );
                            });
                        })()}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === Math.ceil(totalCount / pageSize) || totalCount === 0}
                        >›</button>
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
                        <span>{t('powerballCombinations')}</span>
                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionPower ? 'rotated' : ''}`} onClick={() => setPickSectionPower(!pickSectionPower)}></i>
                        </div>
                    
                        <div className={`pick-grid-4 ${pickSectionPower ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#fff' }}>
                            {t('loadingBettingOptions')}
                            </div>
                        ) : (
                            powerballOptions.map(option => renderBettingOption(option, 'powerball'))
                        )}
                        </div>
                    </div>
                    <div className="pick-wrap">

                    <div className="pick-header">
                        <span>{t('normalballCombinations')}</span>
                            <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionNormal ? 'rotated' : ''}`} onClick={() => setPickSectionNormal(!pickSectionNormal)}></i>
                        </div>
                    
                        <div className={`pick-grid-4 ${pickSectionNormal ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#fff' }}>
                            {t('loadingBettingOptions')}
                            </div>
                        ) : (
                            normalballOptions.map(option => renderBettingOption(option, 'normalball'))
                        )}
                        </div>
                    </div>
                    </div>
                    <div className="bet-sidebar">
                    {/* <div className="current-round-info"> */}
                        {/* <div className="round-header">
                        <span className="round-title">{t('currentRound')} [{currentRound || 'Loading...'}]</span>
                        </div> */}
                        {/* Betting statistics for current session */}
                        {/* <div className="betting-stats">
                        <span className="prev-bet">Previous Betting【0】</span>
                        <span className="prev-win">Previous Win【0】</span>
                        <span className="curr-bet">Current Betting【0】</span>
                        </div> */}
                    {/* </div> */}

                    {/* 
                        Betting Form - User input and confirmation section
                        Displays selected bet details, balance, and amount input controls
                    */}
                    <div className="betinfo-stats">
                        {/* Display selected betting option */}
                        <div className="stat-item">
                        <span className="label">{t('pickSelection')}</span>
                        <span className="value pick-selection">{selectedPick.name || ''}</span>
                        </div>
                        {/* Display odds for selected option */}
                        <div className="stat-item">
                        <span className="label">{t('odds')}</span>
                        <span className="value odds-display">{selectedPick.odds || ''}</span>
                        </div>
                        {/* Display user's current balance */}
                        <div className="stat-item">
                        <span className="label">{t('balance')}</span>
                        <span className="value myCash">{formatNumber(userBalance)}</span>
                        </div>
                        {/* Display potential win amount */}
                        <div className="stat-item">
                        <span className="label">{t('winAmount')}</span>
                        <span className="value win-amount">{formatNumber(winAmount)}</span>
                        </div>

                        {/* Bet amount input field */}
                        <div className="amount-input-row">
                        <span className="label">{t('bettingAmount')}</span>
                        <input 
                            type="number"
                            min="0"
                            className="amount-input" 
                            placeholder={t('numbersOnly')}
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
                        <button className="amount-btn clear" onClick={() => handleAmountClick('Reset')}>{t('reset')}</button>
                        <button className="amount-btn max" onClick={() => handleAmountClick('Max')}>{t('max')}</button>
                        <button 
                            className="amount-btn confirm" 
                            onClick={() => handleBettingClick()}
                            disabled={bettingLoading}
                        >
                            {bettingLoading ? <Spin size="small" /> : t('betting')}
                        </button>
                    </div>
                    </div>   
                </div>
                </div>
            </div>
            </div>
        </main>
        <footer className = "text-center text-white-500 text-md border-t border-gray-800 pt-4 pb-[30px] bg-[#0f172a]">
            © 2025 {t('copyRight')}
        </footer>
        </div>
    );
}