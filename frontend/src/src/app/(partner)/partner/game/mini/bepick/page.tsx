"use client";

import React, { useState, useEffect } from 'react';
import '../../../../../minigame.css';
import { Layout, Card, Button, Input, message, Spin } from "antd";
import { useTranslations } from 'next-intl';
import { MiniBetOptionsAPI, MiniBetOption, BallOption } from '../../../../../../services/miniBetOptionsAPI';

interface BettingOption {
  id: string | number;
  name: string;
  odds: string;
  type: 'single' | 'combination';
  ball?: 'blue' | 'red' | 'green';
  text?: string;
  balls?: BallOption[];
  enabled: boolean;
  category: 'powerball' | 'normalball';
}

export default function BepickAdminPage() {
    const t = useTranslations();
    const [pickSectionPower, setPickSectionPower] = useState(true);
    const [pickSectionNormal, setPickSectionNormal] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingOption, setEditingOption] = useState<BettingOption | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [maxBettingValue, setMaxBettingValue] = useState<string>('1000');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [powerballOptions, setPowerballOptions] = useState<BettingOption[]>([]);
    const [normalballOptions, setNormalballOptions] = useState<BettingOption[]>([]);
    const [formData, setFormData] = useState({
        name: '', odds: '', type: 'single' as 'single' | 'combination',
        ball: 'blue' as 'blue' | 'red' | 'green', text: '',
        balls: [{ color: 'blue' as 'blue' | 'red' | 'green', text: '' }, { color: 'blue' as 'blue' | 'red' | 'green', text: '' }],
        enabled: true, category: 'powerball' as 'powerball' | 'normalball'
    });

    useEffect(() => { loadBettingOptions(); loadGameConfig(); }, [selectedLevel]);

    const loadBettingOptions = async () => {
        setLoading(true);
        try {
            const options = await MiniBetOptionsAPI.getOptions({ gameType: 'bepick', level: selectedLevel });
            const powerball = (options as any[]).filter(opt => opt.category === 'powerball').map(convertToBettingOption);
            const normalball = (options as any[]).filter(opt => opt.category === 'normalball').map(convertToBettingOption);
            setPowerballOptions(powerball);
            setNormalballOptions(normalball);
        } catch (error) { console.error('Error loading betting options:', error); message.error('Failed to load betting options'); } finally { setLoading(false); }
    };

    const loadGameConfig = async () => {
        try {
            const configs = await MiniBetOptionsAPI.getConfigs({ gameType: 'bepick', level: selectedLevel });
            if (configs.length > 0) { setMaxBettingValue(configs[0].maxBettingValue.toString()); } else {
                const defaultMaxBetting = selectedLevel <= 12 ? selectedLevel * 1000 : selectedLevel === 13 ? 50000 : selectedLevel === 14 ? 100000 : 200000;
                setMaxBettingValue(defaultMaxBetting.toString());
            }
        } catch (error) { console.error('Error loading game config:', error); }
    };

    const convertToBettingOption = (apiOption: any): BettingOption => ({
        id: apiOption.id || 0, name: apiOption.name, odds: apiOption.odds, type: apiOption.type,
        ball: apiOption.ball, text: apiOption.text, balls: apiOption.balls, enabled: apiOption.enabled,
        category: apiOption.category as 'powerball' | 'normalball'
    });

    const convertToMiniBetOption = (localOption: Partial<BettingOption>): any => ({
        name: localOption.name, odds: localOption.odds, type: localOption.type, ball: localOption.ball,
        text: localOption.text, balls: localOption.balls, gameType: 'bepick', category: localOption.category,
        level: selectedLevel, enabled: localOption.enabled
    });

    const handleEditOption = (option: BettingOption) => {
        setEditingOption(option); setFormData({ name: option.name, odds: option.odds, type: option.type,
            ball: option.ball || 'blue', text: option.text || '', balls: option.balls || [{ color: 'blue', text: '' }, { color: 'blue', text: '' }],
            enabled: option.enabled, category: option.category }); setShowEditModal(true);
    };

    const handleAddOption = (category: 'powerball' | 'normalball') => {
        setEditingOption(null); setFormData({ name: '', odds: '1.95', type: 'single', ball: 'blue', text: 'Odd',
            balls: [{ color: 'blue', text: '' }, { color: 'blue', text: '' }], enabled: true, category });
        setShowAddModal(true);
    };

    const handleSaveOption = async () => {
        if (!formData.name || !formData.odds) return;
        setSaving(true);
        try {
            const optionData = convertToMiniBetOption({ name: formData.name, odds: formData.odds, type: formData.type,
                ball: formData.type === 'single' ? formData.ball : undefined, text: formData.type === 'single' ? formData.text : undefined,
                balls: formData.type === 'combination' ? formData.balls : undefined, enabled: formData.enabled, category: formData.category });
            if (editingOption) { await MiniBetOptionsAPI.updateOption(Number(editingOption.id), optionData); message.success('Option updated successfully'); }
            else { await MiniBetOptionsAPI.createOption(optionData as Omit<MiniBetOption, 'id'>); message.success('Option created successfully'); }
            await loadBettingOptions(); setShowEditModal(false); setShowAddModal(false); setEditingOption(null);
        } catch (error) { console.error('Error saving option:', error); message.error('Failed to save option'); }
        finally { setSaving(false); }
    };

    const handleDeleteOption = async (optionId: string | number, category: 'powerball' | 'normalball') => {
        if (!confirm(t('bepickadmin/confirmDelete'))) return;
        try { await MiniBetOptionsAPI.deleteOption(Number(optionId)); message.success('Option deleted successfully'); await loadBettingOptions(); }
        catch (error) { console.error('Error deleting option:', error); message.error('Failed to delete option'); }
    };

    const handleToggleOption = async (optionId: string | number, category: 'powerball' | 'normalball') => {
        try { await MiniBetOptionsAPI.toggleOption(Number(optionId)); message.success('Option status updated successfully'); await loadBettingOptions(); }
        catch (error) { console.error('Error toggling option:', error); message.error('Failed to update option status'); }
    };

    const handleMaxBettingChange = async () => {
        setSaving(true);
        try {
            await MiniBetOptionsAPI.updateConfig({ gameType: 'bepick', level: selectedLevel, maxBettingValue: parseFloat(maxBettingValue), minBettingValue: 1, isActive: true });
            message.success('Max betting value updated successfully');
        } catch (error) { console.error('Error updating max betting value:', error); message.error('Failed to update max betting value'); }
        finally { setSaving(false); }
    };

    return (
        <Layout><Card title={t("bepickPowerballAdminManagement")}>
            {loading && <div style={{ textAlign: 'center', padding: '20px' }}><Spin size="large" /><p>Loading betting options...</p></div>}
            {!loading && (<>
                <div className="level-buttons-container">
                    {Array.from({ length: 15 }, (_, i) => {
                        const level = i + 1; let levelName = level <= 12 ? `${t('bepickadmin/level')} ${level}` : level === 13 ? 'VIP 1' : level === 14 ? 'VIP 2' : 'Premium';
                        return <Button key={level} type={selectedLevel === level ? 'primary' : 'default'} size="small" onClick={() => setSelectedLevel(level)} style={{ marginRight: 4, marginBottom: 4 }}>{levelName}</Button>;
                    })}
                </div>
                <div className="max-betting-container" style={{ marginTop: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ color: '#f3f4f6', fontWeight: 500 }}>{t('bepickadmin/maxBettingValue')}:</label>
                        <Input type="number" value={maxBettingValue} onChange={(e) => setMaxBettingValue(e.target.value)} placeholder={t('bepickadmin/placeholderMaxBetting')} style={{ width: 120 }} size="small" />
                        <Button type="primary" size="small" onClick={handleMaxBettingChange} loading={saving}>{t('bepickadmin/change')}</Button>
                    </div>
                </div>
                <div className="minigame-app !min-h-auto !bg-transparent !p-0">
                    <div className="container"><div className="content-wrapper"><div className="right-column right-col">
                        <div className="bet-sidebar">
                            <div className="pick-wrap">
                                <div className="pick-header"><span>{t('bepickadmin/powerballCombinations')}</span>
                                    <div className="flex items-center gap-2">
                                        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700" onClick={() => handleAddOption('powerball')}>+ {t('bepickadmin/add')}</button>
                                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionPower ? 'rotated' : ''}`} onClick={() => setPickSectionPower(!pickSectionPower)}></i>
                                    </div>
                                </div>
                                <div className={`pick-grid-4 ${pickSectionPower ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                    {powerballOptions.map((option) => (
                                        <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? <div className={`ball ${option.ball}`}>{option.text}</div> : (
                                                <div className="ball-group">{option.balls?.map((ball, ballIndex) => (<div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>))}</div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            <div className="admin-controls">
                                                <button className="admin-btn edit-btn" onClick={() => handleEditOption(option)}>{t('bepickadmin/edit')}</button>
                                                <button className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`} onClick={() => handleToggleOption(option.id, 'powerball')}>{option.enabled ? t('bepickadmin/disable') : t('bepickadmin/enable')}</button>
                                                <button className="admin-btn delete-btn" onClick={() => handleDeleteOption(option.id, 'powerball')}>{t('bepickadmin/delete')}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pick-wrap">
                                <div className="pick-header"><span>{t('bepickadmin/normalballCombinations')}</span>
                                    <div className="flex items-center gap-2">
                                        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700" onClick={() => handleAddOption('normalball')}>+ {t('bepickadmin/add')}</button>
                                        <i className={`fa fa-chevron-down cursor-pointer w-5 h-5 chevron-icon ${pickSectionNormal ? 'rotated' : ''}`} onClick={() => setPickSectionNormal(!pickSectionNormal)}></i>
                                    </div>
                                </div>
                                <div className={`pick-grid-4 ${pickSectionNormal ? 'dropdown-enter-active' : 'dropdown-exit-active'}`}>
                                    {normalballOptions.map((option) => (
                                        <div key={option.id} className={`pick-btn admin-pick-btn ${!option.enabled ? 'disabled' : ''}`}>
                                            <span className="odds">{option.odds}</span>
                                            {option.type === 'single' ? <div className={`ball ${option.ball}`}>{option.text}</div> : (
                                                <div className="ball-group">{option.balls?.map((ball, ballIndex) => (<div key={ballIndex} className={`ball ${ball.color}`}>{ball.text}</div>))}</div>
                                            )}
                                            <span className="pick-name">{option.name}</span>
                                            <div className="admin-controls">
                                                <button className="admin-btn edit-btn" onClick={() => handleEditOption(option)}>{t('bepickadmin/edit')}</button>
                                                <button className={`admin-btn ${option.enabled ? 'toggle-btn' : 'toggle-btn disabled'}`} onClick={() => handleToggleOption(option.id, 'normalball')}>{option.enabled ? t('bepickadmin/disable') : t('bepickadmin/enable')}</button>
                                                <button className="admin-btn delete-btn" onClick={() => handleDeleteOption(option.id, 'normalball')}>{t('bepickadmin/delete')}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div></div></div>
                </div>
                {(showEditModal || showAddModal) && (<div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header"><h3>{editingOption ? t('bepickadmin/editBettingOption') : t('bepickadmin/addNewBettingOption')}</h3>
                            <button className="modal-close" onClick={() => { setShowEditModal(false); setShowAddModal(false); setEditingOption(null); }}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label>{t('bepickadmin/optionName')}</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder={t('bepickadmin/placeholderOptionName')} />
                            </div>
                            <div className="form-group"><label>{t('bepickadmin/odds')}</label>
                                <input type="number" step="0.01" value={formData.odds} onChange={(e) => setFormData({...formData, odds: e.target.value})} placeholder={t('bepickadmin/placeholderOdds')} />
                            </div>
                            <div className="form-group"><label>{t('bepickadmin/type')}</label>
                                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as 'single' | 'combination'})}>
                                    <option value="single">{t('bepickadmin/singleBall')}</option><option value="combination">{t('bepickadmin/combination')}</option>
                                </select>
                            </div>
                            {formData.type === 'single' ? (<>
                                <div className="form-group"><label>{t('bepickadmin/ballColor')}</label>
                                    <select value={formData.ball} onChange={(e) => setFormData({...formData, ball: e.target.value as 'blue' | 'red' | 'green'})}>
                                        <option value="blue">{t("blue")}</option><option value="red">{t("red")}</option><option value="green">{t("green")}</option>
                                    </select>
                                </div>
                                <div className="form-group"><label>{t('bepickadmin/ballText')}</label>
                                    <select value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})}>
                                        <option value="Odd">{t('bepickadmin/ballTextOdd')}</option><option value="Even">{t('bepickadmin/ballTextEven')}</option>
                                        <option value="Under">{t('bepickadmin/ballTextUnder')}</option><option value="Over">{t('bepickadmin/ballTextOver')}</option>
                                    </select>
                                </div>
                            </>) : (
                                <div className="form-group"><label>{t('bepickadmin/combinationBalls')}</label>
                                    {formData.balls.map((ball, index) => (
                                        <div key={index} className="ball-input-group">
                                             <select value={ball.color} onChange={(e) => { const newBalls = [...formData.balls]; newBalls[index].color = e.target.value as 'blue' | 'red' | 'green'; setFormData({...formData, balls: newBalls}); }}>
                                                <option value="blue">{t("blue")}</option><option value="red">{t("red")}</option><option value="green">{t("green")}</option>
                                            </select>
                                             <select value={ball.text} onChange={(e) => { const newBalls = [...formData.balls]; newBalls[index].text = e.target.value; setFormData({...formData, balls: newBalls}); }}>
                                                <option value="">{t('bepickadmin/placeholderBallText')}</option><option value="Odd">{t('bepickadmin/ballTextOdd')}</option>
                                                <option value="Even">{t('bepickadmin/ballTextEven')}</option><option value="Under">{t('bepickadmin/ballTextUnder')}</option><option value="Over">{t('bepickadmin/ballTextOver')}</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="form-group"><label><input type="checkbox" checked={formData.enabled} onChange={(e) => setFormData({...formData, enabled: e.target.checked})} />{t('bepickadmin/enabled')}</label></div>
                        </div>
                        <div className="modal-footer">
                             <button className="btn btn-secondary" onClick={() => { setShowEditModal(false); setShowAddModal(false); setEditingOption(null); }}>{t('bepickadmin/cancel')}</button>
                             <button className="btn btn-primary" onClick={handleSaveOption} disabled={!formData.name || !formData.odds || saving} style={{ opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : (editingOption ? t('bepickadmin/update') : t('bepickadmin/addOption'))}</button>
                        </div>
                    </div>
                </div>)}
            </>)}
        </Card></Layout>
    );
}
