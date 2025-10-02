import { useState, useEffect } from 'react';
import { useCAN } from '../context/CANProvider';
import { useTheme } from '../context/ContextProvider';
import { colorScheme } from '../rules/colorScheme';

function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const { canSignals, setSimulationMode, simulationMode, updateSignal, updateSignals } = useCAN();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        // Auto-hide address bar on load
        window.scrollTo(0, 1);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                const elem = document.documentElement;

                if (elem.requestFullscreen) {
                    await elem.requestFullscreen({ navigationUI: "hide" });
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else {
                    toggleUIHide();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else {
                    toggleUIHide();
                }
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
            toggleUIHide();
        }
    };

    const toggleUIHide = () => {
        setIsHidden(!isHidden);
        if (!isHidden) {
            window.scrollTo(0, 1);
            document.body.classList.add('pseudo-fullscreen');
        } else {
            document.body.classList.remove('pseudo-fullscreen');
        }
    };

    const menuStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        
    };

    const toggleButtonStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        color: isOpen ? '#000' : '#fff',
        opacity:'0',
    };

    const menuPanelStyle = {
        backgroundColor: colorScheme[theme].bgColor,
        border: `1px solid ${colorScheme[theme].fontColor}33`,
        borderRadius: '12px',
        padding: '15px',
        display: isOpen ? 'block' : 'none',
        width: '450px',
        maxHeight: '90vh',
        overflowY: 'hidden',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    };

    const buttonStyle = {
        width: '100%',
        padding: '8px',
        margin: '3px 0',
        backgroundColor: theme === 'dark' ? '#1e40af' : '#3b82f6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'all 0.2s ease'
    };

    const signalStyle = {
        padding: '6px 8px',
        margin: '3px 0',
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderRadius: '4px',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: colorScheme[theme].fontColor
    };

    const sectionTitleStyle = {
        fontSize: '13px',
        fontWeight: 'bold',
        marginTop: '10px',
        marginBottom: '8px',
        color: colorScheme[theme].fontColor,
        borderBottom: `1px solid ${colorScheme[theme].fontColor}33`,
        paddingBottom: '3px'
    };

    const sliderStyle = {
        width: '100%',
        height: '4px',
        borderRadius: '2px',
        outline: 'none',
        marginTop: '5px'
    };

    const controlRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 8px',
        margin: '3px 0',
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderRadius: '4px',
        fontSize: '11px'
    };

    const miniButtonStyle = {
        width: '24px',
        height: '24px',
        borderRadius: '3px',
        border: 'none',
        backgroundColor: theme === 'dark' ? '#1e40af' : '#3b82f6',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    };

    const gearButtonStyle = {
        ...miniButtonStyle,
        width: '35px',
        fontSize: '11px',
        fontWeight: 'bold'
    };

    return (
        <div style={menuStyle}>
            {/* Menu Panel */}
            <div style={menuPanelStyle}>
                {/* Two Column Layout */}
                <div style={{display: 'flex', gap: '15px'}}>
                    {/* Left Column */}
                    <div style={{flex: 1}}>
                        {/* System Controls */}
                        <div style={sectionTitleStyle}>System</div>

                <button
                    style={{...buttonStyle, backgroundColor: isFullscreen || isHidden ? '#ff4444' : buttonStyle.backgroundColor}}
                    onClick={toggleFullscreen}
                >
                    {(isFullscreen || isHidden) ? '🗙 Exit Fullscreen' : '⛶ Enter Fullscreen'}
                </button>

                <button
                    style={buttonStyle}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>

                <button
                    style={{...buttonStyle, backgroundColor: simulationMode ? '#44ff44' : '#ff4444'}}
                    onClick={() => setSimulationMode(!simulationMode)}
                >
                    {simulationMode ? '▶️ Simulation ON' : '⏸️ Simulation OFF'}
                </button>

                {/* Signal Controller */}
                <div style={sectionTitleStyle}>CAN Signal Control</div>

                {/* Speed Control */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Speed</span>
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('speedValue', Math.max(0, canSignals.speedValue - 10))}
                    >-</button>
                    <input
                        type="range"
                        min="0"
                        max="260"
                        value={canSignals.speedValue}
                        onChange={(e) => updateSignal('speedValue', Number(e.target.value))}
                        style={{...sliderStyle, flex: 1}}
                    />
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('speedValue', Math.min(260, canSignals.speedValue + 10))}
                    >+</button>
                    <span style={{minWidth: '45px', textAlign: 'right', fontSize: '10px'}}>{canSignals.speedValue}km/h</span>
                </div>

                {/* Gear Control */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Gear</span>
                    <div style={{display: 'flex', gap: '5px', flex: 1, justifyContent: 'center'}}>
                        {['P', 'R', 'N', 'D'].map((gear, index) => (
                            <button
                                key={gear}
                                style={{
                                    ...gearButtonStyle,
                                    backgroundColor: canSignals.gearMode === index
                                        ? '#10b981'
                                        : (theme === 'dark' ? '#374151' : '#9ca3af')
                                }}
                                onClick={() => updateSignal('gearMode', index)}
                            >
                                {gear}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Battery Control */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Battery</span>
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('batteryLevel', Math.max(0, canSignals.batteryLevel - 5))}
                    >-</button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={canSignals.batteryLevel}
                        onChange={(e) => updateSignal('batteryLevel', Number(e.target.value))}
                        style={{...sliderStyle, flex: 1}}
                    />
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('batteryLevel', Math.min(100, canSignals.batteryLevel + 5))}
                    >+</button>
                    <span style={{minWidth: '35px', textAlign: 'right', fontSize: '10px'}}>{canSignals.batteryLevel.toFixed(0)}%</span>
                </div>

                {/* Motor Temperature Control */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Motor T°</span>
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('motorTemperature', Math.max(20, canSignals.motorTemperature - 5))}
                    >-</button>
                    <input
                        type="range"
                        min="20"
                        max="120"
                        value={canSignals.motorTemperature}
                        onChange={(e) => updateSignal('motorTemperature', Number(e.target.value))}
                        style={{...sliderStyle, flex: 1}}
                    />
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('motorTemperature', Math.min(120, canSignals.motorTemperature + 5))}
                    >+</button>
                    <span style={{minWidth: '35px', textAlign: 'right', fontSize: '10px'}}>{canSignals.motorTemperature.toFixed(0)}°C</span>
                </div>

                {/* Battery Temperature Control */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Batt T°</span>
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('batteryTemperature', Math.max(10, canSignals.batteryTemperature - 5))}
                    >-</button>
                    <input
                        type="range"
                        min="10"
                        max="60"
                        value={canSignals.batteryTemperature}
                        onChange={(e) => updateSignal('batteryTemperature', Number(e.target.value))}
                        style={{...sliderStyle, flex: 1}}
                    />
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('batteryTemperature', Math.min(60, canSignals.batteryTemperature + 5))}
                    >+</button>
                    <span style={{minWidth: '35px', textAlign: 'right', fontSize: '10px'}}>{canSignals.batteryTemperature.toFixed(0)}°C</span>
                </div>

                {/* Power Consumption Control */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Power</span>
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('powerConsumption', Math.max(-30, canSignals.powerConsumption - 10))}
                    >-</button>
                    <input
                        type="range"
                        min="-30"
                        max="150"
                        value={canSignals.powerConsumption}
                        onChange={(e) => updateSignal('powerConsumption', Number(e.target.value))}
                        style={{...sliderStyle, flex: 1}}
                    />
                    <button
                        style={miniButtonStyle}
                        onClick={() => updateSignal('powerConsumption', Math.min(150, canSignals.powerConsumption + 10))}
                    >+</button>
                    <span style={{minWidth: '35px', textAlign: 'right', fontSize: '10px'}}>{canSignals.powerConsumption.toFixed(0)}kW</span>
                </div>

                {/* Autonomous Mode Toggle */}
                <div style={controlRowStyle}>
                    <span style={{minWidth: '50px', fontSize: '10px'}}>Auto</span>
                    <button
                        style={{
                            ...buttonStyle,
                            width: 'auto',
                            flex: 1,
                            margin: 0,
                            backgroundColor: canSignals.autonomousStatus === 1 ? '#10b981' : '#ef4444'
                        }}
                        onClick={() => updateSignal('autonomousStatus', canSignals.autonomousStatus === 1 ? 0 : 1)}
                    >
                        {canSignals.autonomousStatus === 1 ? '🤖 ACTIVE' : '👤 MANUAL'}
                    </button>
                </div>

                {/* Reset Buttons */}
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button
                        style={{...buttonStyle, flex: 1, backgroundColor: '#ef4444'}}
                        onClick={() => updateSignal('tripMeter', 0)}
                    >
                        Reset Trip
                    </button>
                    <button
                        style={{...buttonStyle, flex: 1, backgroundColor: '#f59e0b'}}
                        onClick={() => updateSignals({
                            speedValue: 0,
                            gearMode: 0,
                            batteryLevel: 85,
                            motorTemperature: 45,
                            batteryTemperature: 22,
                            powerConsumption: 0,
                            autonomousStatus: 0
                        })}
                    >
                        Reset All
                    </button>
                </div>

                {/* Debug Info */}
                <div style={sectionTitleStyle}>Debug Info</div>

                <div style={signalStyle}>
                    <span>Theme</span>
                    <span>{theme}</span>
                </div>

                <div style={signalStyle}>
                    <span>Viewport</span>
                    <span>{window.innerWidth}×{window.innerHeight}</span>
                </div>

                <div style={signalStyle}>
                    <span>Time</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                </div>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                style={toggleButtonStyle}
                onClick={() => setIsOpen(!isOpen)}
                title="Toggle Menu"
            >
                {isOpen ? '✕' : '☰'}
            </button>
        </div>
    );
}

export default FloatingMenu;