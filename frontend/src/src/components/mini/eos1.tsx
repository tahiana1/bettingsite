"use client";

import React, { useState, useEffect } from "react";
import { Button, message, Modal, Form, InputNumber, Collapse } from "antd";
import { useTranslations } from "next-intl";
import api from "@/api";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import { formatNumber } from "@/lib";

interface BettingOption {
  id: string;
  name: string;
  odds: number;
  type: 'powerball' | 'general';
  category: 'single' | 'combination';
}

interface BettingHistory {
  round: number;
  betType: string;
  odds: number;
  betAmount: number;
  winnings: number;
  status: 'ongoing' | 'completed' | 'cancelled';
}

interface SelectedPick {
  type: 'powerball' | 'general';
  option: string;
  odds: number;
}

const EOS1Component: React.FC = () => {
  const t = useTranslations();
  const [user] = useAtom(userState);
  const [balance, setBalance] = useState<number>(150000);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [currentRound, setCurrentRound] = useState<number>(853);
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([]);
  const [bettingAmount, setBettingAmount] = useState<number>(10000);
  const [bettingHistory, setBettingHistory] = useState<BettingHistory[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('EOS1');

  // Game tabs
  const gameTabs = [
    { id: 'EOS1', name: 'EOS 1min', interval: '1min' },
    { id: 'EOS2', name: 'EOS 2min', interval: '2min' },
    { id: 'EOS3', name: 'EOS 3min', interval: '3min' },
    { id: 'EOS4', name: 'EOS 4min', interval: '4min' },
    { id: 'EOS5', name: 'EOS 5min', interval: '5min' },
    { id: 'Bepick', name: 'Bepick', interval: '1min' },
    { id: 'EOS', name: 'EOS', interval: '1min' },
    { id: 'PBG', name: 'PBG', interval: '1min' },
    { id: 'Dhpowerball', name: 'Dhpowerball', interval: '1min' },
  ];

  // Betting options based on the Korean website
  const powerballOptions: BettingOption[] = [
    { id: 'pb_odd', name: 'Odd', odds: 1.95, type: 'powerball', category: 'single' },
    { id: 'pb_even', name: 'Even', odds: 1.95, type: 'powerball', category: 'single' },
    { id: 'pb_under', name: 'Under', odds: 1.95, type: 'powerball', category: 'single' },
    { id: 'pb_over', name: 'Over', odds: 1.95, type: 'powerball', category: 'single' },
    { id: 'pb_odd_under', name: 'Odd+Under', odds: 4.1, type: 'powerball', category: 'combination' },
    { id: 'pb_odd_over', name: 'Odd+Over', odds: 3.1, type: 'powerball', category: 'combination' },
    { id: 'pb_even_under', name: 'Even+Under', odds: 3.1, type: 'powerball', category: 'combination' },
    { id: 'pb_even_over', name: 'Even+Over', odds: 4.1, type: 'powerball', category: 'combination' },
  ];

  const generalBallOptions: BettingOption[] = [
    { id: 'gb_odd', name: 'Odd', odds: 1.95, type: 'general', category: 'single' },
    { id: 'gb_even', name: 'Even', odds: 1.95, type: 'general', category: 'single' },
    { id: 'gb_under', name: 'Under', odds: 1.95, type: 'general', category: 'single' },
    { id: 'gb_over', name: 'Over', odds: 1.95, type: 'general', category: 'single' },
    { id: 'gb_odd_under', name: 'Odd+Under', odds: 3.7, type: 'general', category: 'combination' },
    { id: 'gb_odd_over', name: 'Odd+Over', odds: 3.7, type: 'general', category: 'combination' },
    { id: 'gb_even_under', name: 'Even+Under', odds: 3.7, type: 'general', category: 'combination' },
    { id: 'gb_even_over', name: 'Even+Over', odds: 3.7, type: 'general', category: 'combination' },
  ];

  // Preset betting amounts
  const presetAmounts = [10000, 20000, 30000, 50000, 100000, 300000, 500000, 1000000];

  // Mock betting history data
  useEffect(() => {
    setBettingHistory([
      { round: 256, betType: 'Powerball Odd', odds: 3.1, betAmount: 12000, winnings: 37000, status: 'ongoing' },
      { round: 255, betType: 'Powerball Odd', odds: 3.1, betAmount: 200000, winnings: 600000, status: 'completed' },
      { round: 255, betType: 'Powerball Odd', odds: 3.1, betAmount: 200000, winnings: 1000000, status: 'completed' },
      { round: 255, betType: 'Powerball Odd', odds: 3.1, betAmount: 200000, winnings: 600000, status: 'completed' },
      { round: 255, betType: 'Powerball Odd', odds: 3.1, betAmount: 200000, winnings: 600000, status: 'completed' },
    ]);
  }, []);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate countdown - in real implementation, this would come from API
      const now = new Date();
      const seconds = 60 - now.getSeconds();
      const minutes = 1 - (now.getSeconds() > 0 ? 1 : 0);
      setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch user balance
  useEffect(() => {
    if (user?.userId) {
      api("casino/get-balance", {
        method: "GET",
        params: { username: user.userId }
      }).then((response) => {
        setBalance(response.balance || 150000);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [user]);

  const handlePickSelection = (type: 'powerball' | 'general', option: string, odds: number) => {
    setSelectedPicks(prev => {
      const existingIndex = prev.findIndex(pick => pick.type === type);
      if (existingIndex >= 0) {
        const newPicks = [...prev];
        newPicks[existingIndex] = { type, option, odds };
        return newPicks;
      } else {
        return [...prev, { type, option, odds }];
      }
    });
  };

  const handleBetting = () => {
    if (selectedPicks.length === 0) {
      message.error("Please select at least one betting option");
      return;
    }
    if (bettingAmount <= 0) {
      message.error("Please enter a valid betting amount");
      return;
    }
    if (bettingAmount > balance) {
      message.error("Insufficient balance");
      return;
    }

    setIsModalVisible(true);
  };

  const handleConfirmBet = async () => {
    try {
      // In real implementation, this would call the betting API
      message.success("Bet placed successfully!");
      setIsModalVisible(false);
      setSelectedPicks([]);
      setBettingAmount(10000);
    } catch (error) {
      message.error("Failed to place bet");
    }
  };

  const getTotalOdds = () => {
    if (selectedPicks.length === 0) return 0;
    return selectedPicks.reduce((total, pick) => total + pick.odds, 0) / selectedPicks.length;
  };

  const getExpectedWinnings = () => {
    return Math.round(bettingAmount * getTotalOdds());
  };

  const renderBettingOption = (option: BettingOption) => {
    const isSelected = selectedPicks.some(pick => 
      pick.type === option.type && pick.option === option.name
    );
    
    // Determine circle color based on option type
    const getCircleColor = (optionName: string) => {
      if (optionName.includes('Odd') || optionName.includes('Under')) return 'bg-blue-500';
      if (optionName.includes('Even') || optionName.includes('Over')) return 'bg-red-500';
      return 'bg-gray-500';
    };
    
    return (
      <div
        key={option.id}
        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
          isSelected 
            ? 'bg-blue-600 text-white' 
            : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
        }`}
        onClick={() => handlePickSelection(option.type, option.name, option.odds)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${getCircleColor(option.name)}`}></div>
          <span className="text-sm font-medium">{option.name}</span>
        </div>
        <span className="text-lg font-bold">{option.odds}</span>
      </div>
    );
  };

  return (
    <div className="bg-blue-900 min-h-screen">
      {/* Top Navigation Tabs */}
      <div className="bg-blue-800 p-2">
        <div className="flex gap-1">
          {gameTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-3 py-1 text-sm font-medium rounded ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Main Content Area */}
        <div className="flex-1 bg-blue-800 p-4">
          {/* Header with Time and Game Title */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white text-2xl font-mono">
              {new Date().toLocaleTimeString('en-GB', { hour12: false })}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-white text-xl font-bold">
                {gameTabs.find(tab => tab.id === activeTab)?.name} Powerball
              </h1>
              <button className="text-blue-300 hover:text-white text-sm">
                Hide
              </button>
            </div>
          </div>

          {/* Game Display Area */}
          <div className="bg-blue-900 h-64 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-blue-300 text-lg">Game Display Area</div>
          </div>

          {/* Betting History Table */}
          <div className="bg-blue-800 rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead>
                  <tr className="border-b border-blue-600">
                    <th className="px-3 py-2 text-left">Round</th>
                    <th className="px-3 py-2 text-left">Bet Type/Odds</th>
                    <th className="px-3 py-2 text-left">Bet Amount</th>
                    <th className="px-3 py-2 text-left">Winnings</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bettingHistory.map((bet, index) => (
                    <tr key={index} className="border-b border-blue-700">
                      <td className="px-3 py-2">{bet.round}</td>
                      <td className="px-3 py-2">{bet.betType}/{bet.odds}</td>
                      <td className="px-3 py-2">{bet.betAmount.toLocaleString()}</td>
                      <td className="px-3 py-2">{bet.winnings.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          bet.status === 'ongoing' ? 'bg-yellow-600 text-white' :
                          bet.status === 'completed' ? 'bg-green-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {bet.status === 'ongoing' ? 'Ongoing' : 
                           bet.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-blue-300 text-sm mt-2">Waiting for ntry.com...</div>
          </div>
        </div>

        {/* Right Sidebar - Betting Options */}
        <div className="w-80 bg-blue-800 p-4 space-y-4">
          {/* Powerball Combinations */}
          <div className="bg-blue-900 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">Powerball Combinations</h3>
              <button className="text-blue-300">↑</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {powerballOptions.map(renderBettingOption)}
            </div>
          </div>

          {/* General Ball Combinations */}
          <div className="bg-blue-900 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">General Ball Combinations</h3>
              <button className="text-blue-300">↑</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {generalBallOptions.map(renderBettingOption)}
            </div>
          </div>

          {/* Current Round Info */}
          <div className="bg-blue-900 rounded-lg p-3">
            <div className="text-white text-center mb-2">
              <div className="text-sm">Current Round [{currentRound}] Round 05:00</div>
              <div className="text-lg font-bold">
                {gameTabs.find(tab => tab.id === activeTab)?.name} Powerball3310226871BE2E ({currentRound - 26}) Round
              </div>
            </div>

            {/* Selected Picks Display */}
            <div className="flex justify-center gap-2 mb-4">
              {selectedPicks.find(pick => pick.type === 'powerball') ? (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-white text-sm">
                    {selectedPicks.find(pick => pick.type === 'powerball')?.option}
                  </span>
                </div>
              ) : null}
              {selectedPicks.find(pick => pick.type === 'general') ? (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-white text-sm">
                    {selectedPicks.find(pick => pick.type === 'general')?.option}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Betting Stats */}
            <div className="text-white text-center text-sm mb-4">
              <div>Previous Bets [0] Previous Winnings [0] Current Bets [0]</div>
            </div>

            {/* Pick Selection and Odds */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-blue-300 text-sm">Pick Selection</div>
                <div className="text-white font-bold">Odds</div>
              </div>
              <div>
                <div className="text-blue-300 text-sm">Available Balance</div>
                <div className="text-white font-bold">{balance.toLocaleString()} KRW</div>
              </div>
            </div>

            {/* Expected Winnings */}
            <div className="text-center mb-4">
              <div className="text-blue-300 text-sm">Expected Winnings</div>
              <div className="text-white text-xl font-bold">{getExpectedWinnings().toLocaleString()}</div>
            </div>

            {/* Betting Amount Input */}
            <div className="mb-4">
              <div className="text-blue-300 text-sm mb-2">Betting Amount - Numbers only</div>
              <input
                type="text"
                className="w-full p-2 bg-blue-800 text-white rounded border border-blue-600"
                placeholder="Enter amount"
                value={bettingAmount}
                onChange={(e) => setBettingAmount(Number(e.target.value.replace(/\D/g, '')))}
              />
            </div>

            {/* Preset Amount Buttons */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  className={`p-1 text-xs rounded ${
                    bettingAmount === amount
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
                  }`}
                  onClick={() => setBettingAmount(amount)}
                >
                  {formatNumber(amount / 10000)}만
                </button>
              ))}
            </div>

            {/* Reset and Max Buttons */}
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 bg-blue-700 text-blue-200 rounded hover:bg-blue-600 text-sm">
                Reset
              </button>
              <button className="px-3 py-1 bg-blue-700 text-blue-200 rounded hover:bg-blue-600 text-sm">
                Max
              </button>
            </div>

            {/* Betting Button */}
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
              onClick={handleBetting}
              disabled={selectedPicks.length === 0 || bettingAmount <= 0}
            >
              BETTING
            </button>
          </div>
        </div>
      </div>

      {/* Betting Confirmation Modal */}
      <Modal
        title="Confirm Bet"
        open={isModalVisible}
        onOk={handleConfirmBet}
        onCancel={() => setIsModalVisible(false)}
        okText="Confirm Bet"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <strong>Selected Bets:</strong>
            <ul className="list-disc list-inside mt-2">
              {selectedPicks.map((pick, index) => (
                <li key={index}>{pick.type} - {pick.option} (Odds: {pick.odds})</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Betting Amount:</strong> {bettingAmount.toLocaleString()} KRW
          </div>
          <div>
            <strong>Expected Winnings:</strong> {getExpectedWinnings().toLocaleString()} KRW
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EOS1Component;
