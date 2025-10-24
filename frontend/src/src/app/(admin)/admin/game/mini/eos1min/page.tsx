"use client";

import React, { useState, useEffect } from 'react';
import '../../../../../minigame.css';
import {
    Layout,
    Card,
    Button,
    Form,
    Input,
  } from "antd";
  import { FilterDropdown } from "@refinedev/antd";
import { useTranslations } from 'next-intl';

// Types for betting options
interface BallOption {
  color: 'blue' | 'red' | 'green';
  text: string;
}

interface BettingOption {
  id: string;
  name: string;
  odds: string;
  type: 'single' | 'combination';
  ball?: 'blue' | 'red' | 'green';
  text?: string;
  balls?: BallOption[];
  enabled: boolean;
  category: 'powerball' | 'normalball';
}

/**
 * EOS1MinAdminPage Component - Admin Interface for EOS1 Min Powerball Betting Options
 * 
 * This component provides an administrative interface for managing EOS1 Min Powerball betting options.
 * Administrators can add, edit, delete, and modify betting options, odds, and conditions.
 * 
 * Features:
 * - CRUD operations for betting options
 * - Real-time odds and conditions editing
 * - Enable/disable betting options
 * - Add new betting combinations
 * - Save and load configurations
 */
export default function EOS1MinAdminPage() {
    const t = useTranslations();
    const [pickSectionPower, setPickSectionPower] = useState(true);
    const [pickSectionNormal, setPickSectionNormal] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingOption, setEditingOption] = useState<BettingOption | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [maxBettingValue, setMaxBettingValue] = useState<string>('1000');

    // State for betting options with full CRUD capabilities
    const [powerballOptions, setPowerballOptions] = useState<BettingOption[]>([
        { id: 'pb-odd', name: 'Powerball Odd', odds: '1.95', type: 'single', ball: 'blue', text: 'Odd', enabled: true, category: 'powerball' },
        { id: 'pb-even', name: 'Powerball Even', odds: '1.95', type: 'single', ball: 'red', text: 'Even', enabled: true, category: 'powerball' },
        { id: 'pb-under', name: 'Powerball Under', odds: '1.95', type: 'single', ball: 'blue', text: 'Under', enabled: true, category: 'powerball' },
        { id: 'pb-over', name: 'Powerball Over', odds: '1.95', type: 'single', ball: 'red', text: 'Over', enabled: true, category: 'powerball' },
        { id: 'pb-odd-under', name: 'PaOdd-PaUnder', odds: '4.1', type: 'combination', balls: [{ color: 'blue', text: 'Odd' }, { color: 'blue', text: 'Under' }], enabled: true, category: 'powerball' },
        { id: 'pb-odd-over', name: 'PaOdd-PaOver', odds: '3.1', type: 'combination', balls: [{ color: 'blue', text: 'Odd' }, { color: 'red', text: 'Over' }], enabled: true, category: 'powerball' },
        { id: 'pb-even-under', name: 'PaEven-PaUnder', odds: '3.1', type: 'combination', balls: [{ color: 'red', text: 'Even' }, { color: 'blue', text: 'Under' }], enabled: true, category: 'powerball' },
        { id: 'pb-even-over', name: 'PaEven-PaOver', odds: '4.1', type: 'combination', balls: [{ color: 'red', text: 'Even' }, { color: 'red', text: 'Over' }], enabled: true, category: 'powerball' },
    ]);

    const [normalballOptions, setNormalballOptions] = useState<BettingOption[]>([
        { id: 'nb-odd', name: 'Normalball Odd', odds: '1.95', type: 'single', ball: 'blue', text: 'Odd', enabled: true, category: 'normalball' },
        { id: 'nb-even', name: 'Normalball Even', odds: '1.95', type: 'single', ball: 'red', text: 'Even', enabled: true, category: 'normalball' },
        { id: 'nb-under', name: 'Normalball Under', odds: '1.95', type: 'single', ball: 'blue', text: 'Under', enabled: true, category: 'normalball' },
        { id: 'nb-over', name: 'Normalball Over', odds: '1.95', type: 'single', ball: 'red', text: 'Over', enabled: true, category: 'normalball' },
        { id: 'nb-odd-under', name: 'N-NUnder', odds: '4.1', type: 'combination', balls: [{ color: 'blue', text: 'Odd' }, { color: 'blue', text: 'Under' }], enabled: true, category: 'normalball' },
        { id: 'nb-odd-over', name: 'N-NOver', odds: '3.1', type: 'combination', balls: [{ color: 'blue', text: 'Odd' }, { color: 'red', text: 'Over' }], enabled: true, category: 'normalball' },
        { id: 'nb-even-under', name: 'NOdd-NUnder', odds: '3.1', type: 'combination', balls: [{ color: 'red', text: 'Even' }, { color: 'blue', text: 'Under' }], enabled: true, category: 'normalball' },
        { id: 'nb-even-over', name: 'NEven-NOver', odds: '4.1', type: 'combination', balls: [{ color: 'red', text: 'Even' }, { color: 'red', text: 'Over' }], enabled: true, category: 'normalball' },
    ]);

    // Form state for editing/adding options
    const [formData, setFormData] = useState({
        name: '',
        odds: '',
        type: 'single' as 'single' | 'combination',
        ball: 'blue' as 'blue' | 'red' | 'green',
        text: '',
        balls: [{ color: 'blue' as 'blue' | 'red' | 'green', text: '' }, { color: 'blue' as 'blue' | 'red' | 'green', text: '' }],
        enabled: true,
        category: 'powerball' as 'powerball' | 'normalball'
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

    const handleAddOption = (category: 'powerball' | 'normalball') => {
        setEditingOption(null);
        setFormData({
        name: '',
        odds: '1.95',
        type: 'single',
        ball: 'blue',
        text: '',
        balls: [{ color: 'blue', text: '' }, { color: 'blue', text: '' }],
        enabled: true,
        category: category
        });
        setShowAddModal(true);
    };

    const handleSaveOption = () => {
        if (!formData.name || !formData.odds) return;

        const newOption: BettingOption = {
            id: editingOption?.id || `${formData.category}-${Date.now()}`,
            name: formData.name,
            odds: formData.odds,
            type: formData.type,
            ball: formData.type === 'single' ? formData.ball : undefined,
            text: formData.type === 'single' ? formData.text : undefined,
            balls: formData.type === 'combination' ? formData.balls : undefined,
            enabled: formData.enabled,
            category: formData.category
        };

        if (editingOption) {
            // Update existing option
            if (formData.category === 'powerball') {
                setPowerballOptions(prev => prev.map(opt => opt.id === editingOption.id ? newOption : opt));
            } else {
                setNormalballOptions(prev => prev.map(opt => opt.id === editingOption.id ? newOption : opt));
            }
        } else {
            // Add new option
            if (formData.category === 'powerball') {
                setPowerballOptions(prev => [...prev, newOption]);
            } else {
                setNormalballOptions(prev => [...prev, newOption]);
            }
        }

        setHasChanges(true);
        setShowEditModal(false);
        setShowAddModal(false);
        setEditingOption(null);
    };

    const handleDeleteOption = (optionId: string, category: 'powerball' | 'normalball') => {
        if (confirm(t('eos1admin/confirmDelete'))) {
            if (category === 'powerball') {
                setPowerballOptions(prev => prev.filter(opt => opt.id !== optionId));
            } else {
                setNormalballOptions(prev => prev.filter(opt => opt.id !== optionId));
            }
            setHasChanges(true);
        }
    };

    const handleToggleOption = (optionId: string, category: 'powerball' | 'normalball') => {
        if (category === 'powerball') {
        setPowerballOptions(prev => prev.map(opt => 
            opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
        ));
        } else {
        setNormalballOptions(prev => prev.map(opt => 
            opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
        ));
        }
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        // Here you would typically save to backend
        console.log('Saving changes:', { powerballOptions, normalballOptions });
        setHasChanges(false);
        alert(t('eos1admin/changesSaved'));
    };

    const handleResetChanges = () => {
        if (confirm(t('eos1admin/confirmReset'))) {
            // Reload from initial state
            window.location.reload();
        }
    };

    const handleLevelChange = (level: number) => {
        setSelectedLevel(level);
        setHasChanges(true);
        console.log(`Level ${level} selected`);
    };

    const handleMaxBettingChange = () => {
        setHasChanges(true);
        console.log(`Max betting value changed to: ${maxBettingValue}`);
        alert(t('eos1admin/maxBettingValueChanged'));
    };

    return (
        <Layout>
            <Card title={t("eos1minPowerballAdminManagement")}>
                {/* level option buttons with level 1 to 10 */}
                <div className="level-buttons-container">
                    {Array.from({ length: 15 }, (_, index) => {
                        const level = index + 1;
                        return (
                            <Button
                                key={level}
                                type={selectedLevel === level ? 'primary' : 'default'}
                                size="small"
                                onClick={() => handleLevelChange(level)}
                                style={{ marginRight: 4, marginBottom: 4 }}
                            >
                                {t('eos1admin/level')} {level}
                            </Button>
                        );
                    })}
                </div>
                
                {/* Max Betting Value Input */}
                <div className="max-betting-container" style={{ marginTop: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ color: '#f3f4f6', fontWeight: 500 }}>
                            {t('eos1admin/maxBettingValue')}:
                        </label>
                        <Input
                            type="number"
                            value={maxBettingValue}
                            onChange={(e) => setMaxBettingValue(e.target.value)}
                            placeholder={t('eos1admin/placeholderMaxBetting')}
                            style={{ width: 120 }}
                            size="small"
                        />
                        <Button
                            type="primary"
                            size="small"
                            onClick={handleMaxBettingChange}
                        >
                            {t('eos1admin/change')}
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
                                <span>{t('eos1admin/powerballCombinations')}</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                    onClick={() => handleAddOption('powerball')}
                                    >
                                    + {t('eos1admin/add')}
                                    </button>
                                    <i 
                                    className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionPower ? 'rotated' : ''}`} 
                                    onClick={() => setPickSectionPower(!pickSectionPower)}
                                    ></i>
                                </div>
                                </div>
                                
                                <div className={`pick-grid-4 ${pickSectionPower ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
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
                                        {t('eos1admin/edit')}
                                        </button>
                                        <button 
                                        className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                        onClick={() => handleToggleOption(option.id, 'powerball')}
                                        >
                                        {option.enabled ? t('eos1admin/disable') : t('eos1admin/enable')}
                                        </button>
                                        <button 
                                        className="admin-btn delete-btn"
                                        onClick={() => handleDeleteOption(option.id, 'powerball')}
                                        >
                                        {t('eos1admin/delete')}
                                        </button>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            {/* Normalball Combinations Section */}
                            <div className="pick-wrap">
                                <div className="pick-header">
                                <span>{t('eos1admin/normalballCombinations')}</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                    onClick={() => handleAddOption('normalball')}
                                    >
                                    + {t('eos1admin/add')}
                                    </button>
                                    <i 
                                    className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionNormal ? 'rotated' : ''}`} 
                                    onClick={() => setPickSectionNormal(!pickSectionNormal)}
                                    ></i>
                                </div>
                                </div>
                                
                                <div className={`pick-grid-4 ${pickSectionNormal ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
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
                                        {t('eos1admin/edit')}
                                        </button>
                                        <button 
                                        className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`}
                                        onClick={() => handleToggleOption(option.id, 'normalball')}
                                        >
                                        {option.enabled ? t('eos1admin/disable') : t('eos1admin/enable')}
                                        </button>
                                        <button 
                                        className="admin-btn delete-btn"
                                        onClick={() => handleDeleteOption(option.id, 'normalball')}
                                        >
                                        {t('eos1admin/delete')}
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
                            <h3>{editingOption ? t('eos1admin/editBettingOption') : t('eos1admin/addNewBettingOption')}</h3>
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
                                <label>{t('eos1admin/optionName')}</label>
                                <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder={t('eos1admin/placeholderOptionName')}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>{t('eos1admin/odds')}</label>
                                <input 
                                type="number"
                                step="0.01"
                                value={formData.odds}
                                onChange={(e) => setFormData({...formData, odds: e.target.value})}
                                placeholder={t('eos1admin/placeholderOdds')}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>{t('eos1admin/type')}</label>
                                <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value as 'single' | 'combination'})}
                                >
                                <option value="single">{t('eos1admin/singleBall')}</option>
                                <option value="combination">{t('eos1admin/combination')}</option>
                                </select>
                            </div>
                            
                            {formData.type === 'single' ? (
                                <>
                                <div className="form-group">
                                    <label>{t('eos1admin/ballColor')}</label>
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
                                    <label>{t('eos1admin/ballText')}</label>
                                    <select 
                                    value={formData.text}
                                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                                    >
                                    <option value="Odd">{t('eos1admin/ballTextOdd')}</option>
                                    <option value="Even">{t('eos1admin/ballTextEven')}</option>
                                    <option value="Under">{t('eos1admin/ballTextUnder')}</option>
                                    <option value="Over">{t('eos1admin/ballTextOver')}</option>
                                    </select>
                                </div>
                                </>
                            ) : (
                                <div className="form-group">
                                <label>{t('eos1admin/combinationBalls')}</label>
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
                                    <option value="">{t('eos1admin/placeholderBallText')}</option>
                                    <option value="Odd">{t('eos1admin/ballTextOdd')}</option>
                                    <option value="Even">{t('eos1admin/ballTextEven')}</option>
                                    <option value="Under">{t('eos1admin/ballTextUnder')}</option>
                                    <option value="Over">{t('eos1admin/ballTextOver')}</option>
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
                                {t('eos1admin/enabled')}
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
                                {t('eos1admin/cancel')}
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleSaveOption}
                                disabled={!formData.name || !formData.odds}
                            >
                                {editingOption ? t('eos1admin/update') : t('eos1admin/addOption')}
                            </button>
                            </div>
                        </div>
                        </div>
                    )}
                    <Form>
                    </Form>
                </div>
            </Card>
        </Layout>
    );
}