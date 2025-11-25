"use client";

import React, { useState, useEffect } from 'react';
import '../../../../../minigame.css';
import {
    Layout,
    Card,
    Button,
    Form,
    Input,
    message,
    Spin,
  } from "antd";
  import { FilterDropdown } from "@refinedev/antd";
import { useTranslations } from 'next-intl';
import { MiniBetOptionsAPI, MiniBetOption, BallOption } from '../../../../../../services/miniBetOptionsAPI';

// Types for betting options (keeping for backward compatibility)
interface BettingOption {
  id: string | number;
  name: string;
  odds: string;
  type: 'single' | 'combination';
  ball?: 'blue' | 'red' | 'green';
  text?: string;
  balls?: BallOption[];
  enabled: boolean;
  category: 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination';
}

/**
 * EOS3MinAdminPage Component - Admin Interface for EOS3 Min Powerball Betting Options
 * 
 * This component provides an administrative interface for managing EOS3 Min Powerball betting options.
 * Administrators can add, edit, delete, and modify betting options, odds, and conditions.
 * 
 * Features:
 * - CRUD operations for betting options
 * - Real-time odds and conditions editing
 * - Enable/disable betting options
 * - Add new betting combinations
 * - Save and load configurations
 * - Support for multiple betting categories (Powerball, Normalball, Normal Ball Section, Odd/Even, 3-Combination)
 */
export default function EOS3MinAdminPage() {
    const t = useTranslations();
    const [powerballCombinationsOpen, setPowerballCombinationsOpen] = useState(true);
    const [normalBallSectionOpen, setNormalBallSectionOpen] = useState(true);
    const [oddEvenCombinationsOpen, setOddEvenCombinationsOpen] = useState(true);
    const [normalballCombinationsOpen, setNormalballCombinationsOpen] = useState(true);
    const [threeCombinationOpen, setThreeCombinationOpen] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingOption, setEditingOption] = useState<BettingOption | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [maxBettingValue, setMaxBettingValue] = useState<string>('1000');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // State for betting options with full CRUD capabilities
    const [powerballOptions, setPowerballOptions] = useState<BettingOption[]>([]);
    const [normalballOptions, setNormalballOptions] = useState<BettingOption[]>([]);
    const [normalballSectionOptions, setNormalballSectionOptions] = useState<BettingOption[]>([]);
    const [oddEvenOptions, setOddEvenOptions] = useState<BettingOption[]>([]);
    const [threeCombinationOptions, setThreeCombinationOptions] = useState<BettingOption[]>([]);

    // Form state for editing/adding options
    const [formData, setFormData] = useState({
        name: '',
        odds: '',
        type: 'single' as 'single' | 'combination',
        ball: 'blue' as 'blue' | 'red' | 'green',
        text: '',
        balls: [{ color: 'blue' as 'blue' | 'red' | 'green', text: '' }, { color: 'blue' as 'blue' | 'red' | 'green', text: '' }],
        enabled: true,
        category: 'powerball' as 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination'
    });

    // Load data from API on component mount and level change
    useEffect(() => {
        loadBettingOptions();
        loadGameConfig();
    }, [selectedLevel]);

    // Load betting options from API
    const loadBettingOptions = async () => {
        setLoading(true);
        try {
            const options = await MiniBetOptionsAPI.getOptions({
                gameType: 'eos3min',
                level: selectedLevel
            });

            // Convert API data to local format and categorize
            const powerball = (options as any[])
                .filter(opt => opt.category === 'powerball')
                .map(convertToBettingOption);
            
            const normalball = (options as any[])
                .filter(opt => opt.category === 'normalball')
                .map(convertToBettingOption);

            const normalballSection = (options as any[])
                .filter(opt => opt.category === 'normalballsection')
                .map(convertToBettingOption);

            const oddEven = (options as any[])
                .filter(opt => opt.category === 'oddeven')
                .map(convertToBettingOption);

            const threeCombination = (options as any[])
                .filter(opt => opt.category === 'threecombination')
                .map(convertToBettingOption);

            setPowerballOptions(powerball);
            setNormalballOptions(normalball);
            setNormalballSectionOptions(normalballSection);
            setOddEvenOptions(oddEven);
            setThreeCombinationOptions(threeCombination);
        } catch (error) {
            console.error('Error loading betting options:', error);
            message.error('Failed to load betting options');
        } finally {
            setLoading(false);
        }
    };

    // Load game configuration
    const loadGameConfig = async () => {
        try {
            const configs = await MiniBetOptionsAPI.getConfigs({
                gameType: 'eos3min',
                level: selectedLevel
            });

            if (configs.length > 0) {
                setMaxBettingValue(configs[0].maxBettingValue.toString());
            } else {
                // Set default max betting value based on level if no config found
                let defaultMaxBetting = 0;
                
                if (selectedLevel <= 12) {
                    // Regular levels (1-12)
                    defaultMaxBetting = selectedLevel * 1000;
                } else if (selectedLevel === 13) {
                    // VIP 1
                    defaultMaxBetting = 50000;
                } else if (selectedLevel === 14) {
                    // VIP 2
                    defaultMaxBetting = 100000;
                } else if (selectedLevel === 15) {
                    // Premium
                    defaultMaxBetting = 200000;
                }
                
                setMaxBettingValue(defaultMaxBetting.toString());
            }
        } catch (error) {
            console.error('Error loading game config:', error);
        }
    };

    // Convert API MiniBetOption to local BettingOption format
    const convertToBettingOption = (apiOption: any): BettingOption => ({
        id: apiOption.id || 0,
        name: apiOption.name,
        odds: apiOption.odds,
        type: apiOption.type,
        ball: apiOption.ball,
        text: apiOption.text,
        balls: apiOption.balls,
        enabled: apiOption.enabled,
        category: apiOption.category as 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination'
    });

    // Convert local BettingOption to API MiniBetOption format
    const convertToMiniBetOption = (localOption: Partial<BettingOption>): any => ({
        name: localOption.name,
        odds: localOption.odds,
        type: localOption.type,
        ball: localOption.ball,
        text: localOption.text,
        balls: localOption.balls,
        gameType: 'eos3min',
        category: localOption.category,
        level: selectedLevel,
        enabled: localOption.enabled
    });

    // CRUD Functions
    const handleEditOption = (option: BettingOption) => {
        setEditingOption(option);
        setFormData({
        name: option.name,
        odds: option.odds,
        type: option.type,
        ball: option.ball || 'blue',
        text: option.text || '',
        balls: option.balls || [{ color: 'blue', text: '' }, { color: 'blue', text: '' }],
        enabled: option.enabled,
        category: option.category
        });
        setShowEditModal(true);
    };

    const handleAddOption = (category: 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination') => {
        setEditingOption(null);
        setFormData({
        name: '',
        odds: '1.95',
        type: 'single',
        ball: 'blue',
        text: 'Odd',
        balls: [{ color: 'blue', text: '' }, { color: 'blue', text: '' }],
        enabled: true,
        category: category
        });
        setShowAddModal(true);
    };

    const handleSaveOption = async () => {
        if (!formData.name || !formData.odds) return;

        setSaving(true);
        try {
            const optionData = convertToMiniBetOption({
                name: formData.name,
                odds: formData.odds,
                type: formData.type,
                ball: formData.type === 'single' ? formData.ball : undefined,
                text: formData.type === 'single' ? formData.text : undefined,
                balls: formData.type === 'combination' ? formData.balls : undefined,
                enabled: formData.enabled,
                category: formData.category
            });

            if (editingOption) {
                // Update existing option
                await MiniBetOptionsAPI.updateOption(Number(editingOption.id), optionData);
                message.success('Option updated successfully');
            } else {
                // Create new option
                await MiniBetOptionsAPI.createOption(optionData as Omit<MiniBetOption, 'id'>);
                message.success('Option created successfully');
            }

            // Reload data from API
            await loadBettingOptions();
            
            setShowEditModal(false);
            setShowAddModal(false);
            setEditingOption(null);
        } catch (error) {
            console.error('Error saving option:', error);
            message.error('Failed to save option');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteOption = async (optionId: string | number, category: 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination') => {
        if (!confirm(t('eos3admin/confirmDelete'))) return;

        try {
            await MiniBetOptionsAPI.deleteOption(Number(optionId));
            message.success('Option deleted successfully');
            
            // Reload data from API
            await loadBettingOptions();
        } catch (error) {
            console.error('Error deleting option:', error);
            message.error('Failed to delete option');
        }
    };

    const handleToggleOption = async (optionId: string | number, category: 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination') => {
        try {
            await MiniBetOptionsAPI.toggleOption(Number(optionId));
            message.success('Option status updated successfully');
            
            // Reload data from API
            await loadBettingOptions();
        } catch (error) {
            console.error('Error toggling option:', error);
            message.error('Failed to update option status');
        }
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Update game configuration
            await MiniBetOptionsAPI.updateConfig({
                gameType: 'eos3min',
                level: selectedLevel,
                maxBettingValue: parseFloat(maxBettingValue),
                minBettingValue: 1,
                isActive: true
            });

            message.success('Changes saved successfully');
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving changes:', error);
            message.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleResetChanges = () => {
        if (confirm(t('eos3admin/confirmReset'))) {
            // Reload from API
            loadBettingOptions();
            loadGameConfig();
        }
    };

    const handleLevelChange = (level: number) => {
        setSelectedLevel(level);
        setHasChanges(false);
    };

    const handleMaxBettingChange = async () => {
        setSaving(true);
        try {
            await MiniBetOptionsAPI.updateConfig({
                gameType: 'eos3min',
                level: selectedLevel,
                maxBettingValue: parseFloat(maxBettingValue),
                minBettingValue: 1,
                isActive: true
            });

            message.success('Max betting value updated successfully');
        } catch (error) {
            console.error('Error updating max betting value:', error);
            message.error('Failed to update max betting value');
        } finally {
            setSaving(false);
        }
    };

    const handleDropdownToggle = (dropdownType: string) => {
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
    };

    return (
        <Layout>
            <Card title={t("eos3minPowerballAdminManagement")}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                        <p>Loading betting options...</p>
                    </div>
                )}
                
                {!loading && (
                    <>
                        {/* level option buttons with level 1 to 15 */}
                        <div className="level-buttons-container">
                            {Array.from({ length: 15 }, (_, index) => {
                                const level = index + 1;
                                let levelName = '';
                                
                                if (level <= 12) {
                                    levelName = `${t('eos3admin/level')} ${level}`;
                                } else if (level === 13) {
                                    levelName = 'VIP 1';
                                } else if (level === 14) {
                                    levelName = 'VIP 2';
                                } else if (level === 15) {
                                    levelName = 'Premium';
                                }
                                
                                return (
                                    <Button
                                        key={level}
                                        type={selectedLevel === level ? 'primary' : 'default'}
                                        size="small"
                                        onClick={() => handleLevelChange(level)}
                                        style={{ marginRight: 4, marginBottom: 4 }}
                                    >
                                        {levelName}
                                    </Button>
                                );
                            })}
                        </div>
                        
                        {/* Max Betting Value Input */}
                        <div className="max-betting-container" style={{ marginTop: 16, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <label style={{ color: '#f3f4f6', fontWeight: 500 }}>
                                    {t('eos3admin/maxBettingValue')}:
                                </label>
                                <Input
                                    type="number"
                                    value={maxBettingValue}
                                    onChange={(e) => setMaxBettingValue(e.target.value)}
                                    placeholder={t('eos3admin/placeholderMaxBetting')}
                                    style={{ width: 120 }}
                                    size="small"
                                />
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={handleMaxBettingChange}
                                    loading={saving}
                                >
                                    {t('eos3admin/change')}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="minigame-app !min-h-auto !bg-transparent !p-0">
                            <div className="container">
                                <div className="content-wrapper">

                                {/* Betting Options Display */}
                                <div className="right-column right-col">
                                    <div className="bet-sidebar">
                                    
                                    {/* Powerball Combinations Section */}
                                    <div className="pick-wrap">
                                        <div className="pick-header">
                                        <span>{t('eos3admin/powerballCombinations')}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            onClick={() => handleAddOption('powerball')}
                                            >
                                            + {t('eos3admin/add')}
                                            </button>
                                            <i 
                                            className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${powerballCombinationsOpen ? 'rotated' : ''}`} 
                                            onClick={() => handleDropdownToggle('powerball')}
                                            ></i>
                                        </div>
                                        </div>
                                        
                                        <div className={`pick-grid-4 ${powerballCombinationsOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                        {powerballOptions.map((option, index) => (
                                            <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? (
                                                <div className={`ball ${option.ball}`}>{option.text}</div>
                                            ) : (
                                                <div className="ball-group">
                                                {option.balls?.map((ball, ballIndex) => (
                                                    <div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>
                                                ))}
                                                </div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            {/* Admin Controls */}
                                            <div className="admin-controls">
                                                <button 
                                                className="admin-btn edit-btn"
                                                onClick={() => handleEditOption(option)}
                                                >
                                                {t('eos3admin/edit')}
                                                </button>
                                                <button 
                                                className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                                onClick={() => handleToggleOption(option.id, 'powerball')}
                                                >
                                                {option.enabled ? t('eos3admin/disable') : t('eos3admin/enable')}
                                                </button>
                                                <button 
                                                className="admin-btn delete-btn"
                                                onClick={() => handleDeleteOption(option.id, 'powerball')}
                                                >
                                                {t('eos3admin/delete')}
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>

                                    {/* Normal Ball Section Combinations */}
                                    <div className="pick-wrap">
                                        <div className="pick-header">
                                        <span>{t('eos3admin/normalBallSectionCombinations')}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            onClick={() => handleAddOption('normalballsection')}
                                            >
                                            + {t('eos3admin/add')}
                                            </button>
                                            <i 
                                            className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${normalBallSectionOpen ? 'rotated' : ''}`} 
                                            onClick={() => handleDropdownToggle('normalBallSection')}
                                            ></i>
                                        </div>
                                        </div>
                                        
                                        <div className={`pick-grid-4 ${normalBallSectionOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                        {normalballSectionOptions.map((option, index) => (
                                            <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? (
                                                <div className={`ball ${option.ball}`}>{option.text}</div>
                                            ) : (
                                                <div className="ball-group">
                                                {option.balls?.map((ball, ballIndex) => (
                                                    <div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>
                                                ))}
                                                </div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            {/* Admin Controls */}
                                            <div className="admin-controls">
                                                <button 
                                                className="admin-btn edit-btn"
                                                onClick={() => handleEditOption(option)}
                                                >
                                                {t('eos3admin/edit')}
                                                </button>
                                                <button 
                                                className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                                onClick={() => handleToggleOption(option.id, 'normalballsection')}
                                                >
                                                {option.enabled ? t('eos3admin/disable') : t('eos3admin/enable')}
                                                </button>
                                                <button 
                                                className="admin-btn delete-btn"
                                                onClick={() => handleDeleteOption(option.id, 'normalballsection')}
                                                >
                                                {t('eos3admin/delete')}
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>

                                    {/* Powerball + Normal Ball Odd/Even Combinations */}
                                    <div className="pick-wrap">
                                        <div className="pick-header">
                                        <span>{t('eos3admin/powerballNormalBallOddEvenCombinations')}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            onClick={() => handleAddOption('oddeven')}
                                            >
                                            + {t('eos3admin/add')}
                                            </button>
                                            <i 
                                            className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${oddEvenCombinationsOpen ? 'rotated' : ''}`} 
                                            onClick={() => handleDropdownToggle('oddEven')}
                                            ></i>
                                        </div>
                                        </div>
                                        
                                        <div className={`pick-grid-4 ${oddEvenCombinationsOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                        {oddEvenOptions.map((option, index) => (
                                            <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? (
                                                <div className={`ball ${option.ball}`}>{option.text}</div>
                                            ) : (
                                                <div className="ball-group">
                                                {option.balls?.map((ball, ballIndex) => (
                                                    <div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>
                                                ))}
                                                </div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            {/* Admin Controls */}
                                            <div className="admin-controls">
                                                <button 
                                                className="admin-btn edit-btn"
                                                onClick={() => handleEditOption(option)}
                                                >
                                                {t('eos3admin/edit')}
                                                </button>
                                                <button 
                                                className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                                onClick={() => handleToggleOption(option.id, 'oddeven')}
                                                >
                                                {option.enabled ? t('eos3admin/disable') : t('eos3admin/enable')}
                                                </button>
                                                <button 
                                                className="admin-btn delete-btn"
                                                onClick={() => handleDeleteOption(option.id, 'oddeven')}
                                                >
                                                {t('eos3admin/delete')}
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>

                                    {/* Normalball Combinations Section */}
                                    <div className="pick-wrap">
                                        <div className="pick-header">
                                        <span>{t('eos3admin/normalballCombinations')}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            onClick={() => handleAddOption('normalball')}
                                            >
                                            + {t('eos3admin/add')}
                                            </button>
                                            <i 
                                            className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${normalballCombinationsOpen ? 'rotated' : ''}`} 
                                            onClick={() => handleDropdownToggle('normalball')}
                                            ></i>
                                        </div>
                                        </div>
                                        
                                        <div className={`pick-grid-4 ${normalballCombinationsOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                        {normalballOptions.map((option, index) => (
                                            <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? (
                                                <div className={`ball ${option.ball}`}>{option.text}</div>
                                            ) : (
                                                <div className="ball-group">
                                                {option.balls?.map((ball, ballIndex) => (
                                                    <div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>
                                                ))}
                                                </div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            {/* Admin Controls */}
                                            <div className="admin-controls">
                                                <button 
                                                className="admin-btn edit-btn"
                                                onClick={() => handleEditOption(option)}
                                                >
                                                {t('eos3admin/edit')}
                                                </button>
                                                <button 
                                                className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                                onClick={() => handleToggleOption(option.id, 'normalball')}
                                                >
                                                {option.enabled ? t('eos3admin/disable') : t('eos3admin/enable')}
                                                </button>
                                                <button 
                                                className="admin-btn delete-btn"
                                                onClick={() => handleDeleteOption(option.id, 'normalball')}
                                                >
                                                {t('eos3admin/delete')}
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>

                                    {/* Normalball Ball Combination + Powerball 3-Combination */}
                                    <div className="pick-wrap">
                                        <div className="pick-header">
                                        <span>{t('eos3admin/normalballBallCombinationPowerball3Combination')}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            onClick={() => handleAddOption('threecombination')}
                                            >
                                            + {t('eos3admin/add')}
                                            </button>
                                            <i 
                                            className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${threeCombinationOpen ? 'rotated' : ''}`} 
                                            onClick={() => handleDropdownToggle('threeCombination')}
                                            ></i>
                                        </div>
                                        </div>
                                        
                                        <div className={`pick-grid-4 ${threeCombinationOpen ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                        {threeCombinationOptions.map((option, index) => (
                                            <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? (
                                                <div className={`ball ${option.ball}`}>{option.text}</div>
                                            ) : (
                                                <div className="ball-group">
                                                {option.balls?.map((ball, ballIndex) => (
                                                    <div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>
                                                ))}
                                                </div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            {/* Admin Controls */}
                                            <div className="admin-controls">
                                                <button 
                                                className="admin-btn edit-btn"
                                                onClick={() => handleEditOption(option)}
                                                >
                                                {t('eos3admin/edit')}
                                                </button>
                                                <button 
                                                className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                                onClick={() => handleToggleOption(option.id, 'threecombination')}
                                                >
                                                {option.enabled ? t('eos3admin/disable') : t('eos3admin/enable')}
                                                </button>
                                                <button 
                                                className="admin-btn delete-btn"
                                                onClick={() => handleDeleteOption(option.id, 'threecombination')}
                                                >
                                                {t('eos3admin/delete')}
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Edit/Add Modal */}
                            {(showEditModal || showAddModal) && (
                                <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="modal-header">
                                    <h3>{editingOption ? t('eos3admin/editBettingOption') : t('eos3admin/addNewBettingOption')}</h3>
                                    <button 
                                        className="modal-close"
                                        onClick={() => {
                                        setShowEditModal(false);
                                        setShowAddModal(false);
                                        setEditingOption(null);
                                        }}
                                    >
                                        ×
                                    </button>
                                    </div>
                                    
                                    <div className="modal-body">
                                    <div className="form-group">
                                        <label>{t('eos3admin/optionName')}</label>
                                        <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder={t('eos3admin/placeholderOptionName')}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>{t('eos3admin/odds')}</label>
                                        <input 
                                        type="number"
                                        step="0.01"
                                        value={formData.odds}
                                        onChange={(e) => setFormData({...formData, odds: e.target.value})}
                                        placeholder={t('eos3admin/placeholderOdds')}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>{t('eos3admin/type')}</label>
                                        <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as 'single' | 'combination'})}
                                        >
                                        <option value="single">{t('eos3admin/singleBall')}</option>
                                        <option value="combination">{t('eos3admin/combination')}</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>{t('eos3admin/category')}</label>
                                        <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value as 'powerball' | 'normalball' | 'normalballsection' | 'oddeven' | 'threecombination'})}
                                        >
                                        <option value="powerball">{t('eos3admin/powerball')}</option>
                                        <option value="normalball">{t('eos3admin/normalball')}</option>
                                        <option value="normalballsection">{t('eos3admin/normalballsection')}</option>
                                        <option value="oddeven">{t('eos3admin/oddeven')}</option>
                                        <option value="threecombination">{t('eos3admin/threecombination')}</option>
                                        </select>
                                    </div>
                                    
                                    {formData.type === 'single' ? (
                                        <>
                                        <div className="form-group">
                                            <label>{t('eos3admin/ballColor')}</label>
                                            <select 
                                            value={formData.ball}
                                            onChange={(e) => setFormData({...formData, ball: e.target.value as 'blue' | 'red' | 'green'})}
                                            >
                                            <option value="blue">{t("blue")}</option>
                                            <option value="red">{t("red")}</option>
                                            <option value="green">{t("green")}</option>
                                            </select>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>{t('eos3admin/ballText')}</label>
                                            <select 
                                            value={formData.text}
                                            onChange={(e) => setFormData({...formData, text: e.target.value})}
                                            >
                                            <option value="Odd">{t('eos3admin/ballTextOdd')}</option>
                                            <option value="Even">{t('eos3admin/ballTextEven')}</option>
                                            <option value="Under">{t('eos3admin/ballTextUnder')}</option>
                                            <option value="Over">{t('eos3admin/ballTextOver')}</option>
                                            <option value="Small">{t('eos3admin/ballTextSmall')}</option>
                                            <option value="Medium">{t('eos3admin/ballTextMedium')}</option>
                                            <option value="Large">{t('eos3admin/ballTextLarge')}</option>
                                            </select>
                                        </div>
                                        </>
                                    ) : (
                                        <div className="form-group">
                                        <label>{t('eos3admin/combinationBalls')}</label>
                                        {formData.balls.map((ball, index) => (
                                            <div key={index} className="ball-input-group">
                                            <select 
                                                value={ball.color}
                                                onChange={(e) => {
                                                const newBalls = [...formData.balls];
                                                newBalls[index].color = e.target.value as 'blue' | 'red' | 'green';
                                                setFormData({...formData, balls: newBalls});
                                                }}
                                            >
                                                <option value="blue">{t("blue")}</option>
                                                <option value="red">{t("red")}</option>
                                                <option value="green">{t("green")}</option>
                                            </select>
                                            <select 
                                                value={ball.text}
                                                onChange={(e) => {
                                                const newBalls = [...formData.balls];
                                                newBalls[index].text = e.target.value;
                                                setFormData({...formData, balls: newBalls});
                                                }}
                                            >
                                            <option value="">{t('eos3admin/placeholderBallText')}</option>
                                            <option value="Odd">{t('eos3admin/ballTextOdd')}</option>
                                            <option value="Even">{t('eos3admin/ballTextEven')}</option>
                                            <option value="Under">{t('eos3admin/ballTextUnder')}</option>
                                            <option value="Over">{t('eos3admin/ballTextOver')}</option>
                                            <option value="Small">{t('eos3admin/ballTextSmall')}</option>
                                            <option value="Medium">{t('eos3admin/ballTextMedium')}</option>
                                            <option value="Large">{t('eos3admin/ballTextLarge')}</option>
                                            </select>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    
                                    
                                    <div className="form-group">
                                        <label>
                                        <input 
                                            type="checkbox"
                                            checked={formData.enabled}
                                            onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                                        />
                                        {t('eos3admin/enabled')}
                                        </label>
                                    </div>
                                    </div>
                                    
                                    <div className="modal-footer">
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => {
                                        setShowEditModal(false);
                                        setShowAddModal(false);
                                        setEditingOption(null);
                                        }}
                                    >
                                        {t('eos3admin/cancel')}
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={handleSaveOption}
                                        disabled={!formData.name || !formData.odds || saving}
                                        style={{ opacity: saving ? 0.6 : 1 }}
                                    >
                                        {saving ? 'Saving...' : (editingOption ? t('eos3admin/update') : t('eos3admin/addOption'))}
                                    </button>
                                    </div>
                                </div>
                                </div>
                            )}
                            <Form>
                            </Form>
                        </div>
                    </>
                )}
            </Card>
        </Layout>
    );
}
