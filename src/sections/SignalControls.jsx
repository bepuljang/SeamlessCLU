import { useCAN } from '../context/CANProvider';

const SignalControls = () => {
    const { canSignals, updateSignal, updateSignals, simulationMode, setSimulationMode } = useCAN();

    const controlStyle = {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif"
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontSize: '12px',
        fontWeight: '500',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif"
    };

    const inputStyle = {
        width: '100%',
        padding: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '400',
        fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif"
    };

    const rangeStyle = {
        width: '100%',
        marginTop: '5px'
    };

    const selectStyle = {
        ...inputStyle,
        cursor: 'pointer'
    };

    const buttonStyle = {
        padding: '8px 16px',
        backgroundColor: simulationMode ? '#f44336' : '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif",
        width: '100%',
        marginTop: '10px',
        transition: 'background-color 0.3s'
    };

    return (
        <div>
            <div style={{
                width: '100%',
                height: '100%',
                padding: '20px',
                overflowY: 'auto'
            }}>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px'
                }}>
                    {/* Autonomous Status */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Autonomous Status
                        </label>
                        <select
                            style={selectStyle}
                            value={canSignals.autonomousStatus}
                            onChange={(e) => updateSignal('autonomousStatus', parseInt(e.target.value))}
                            disabled={simulationMode}
                        >
                            <option value="0">Manual</option>
                            <option value="1">Autonomous</option>
                        </select>
                    </div>

                    {/* Gear Mode */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Gear Mode
                        </label>
                        <select
                            style={selectStyle}
                            value={canSignals.gearMode}
                            onChange={(e) => {
                                const newGearMode = parseInt(e.target.value);
                                // P 모드로 전환 시 속도를 먼저 0으로 설정
                                if (newGearMode === 0) {
                                    updateSignals({
                                        speedValue: 0,
                                        gearMode: newGearMode
                                    });
                                } else {
                                    updateSignal('gearMode', newGearMode);
                                }
                            }}
                            disabled={simulationMode}
                        >
                            <option value="0">P (Park)</option>
                            <option value="1">R (Reverse)</option>
                            <option value="2">N (Neutral)</option>
                            <option value="3">D (Drive)</option>
                        </select>
                    </div>

                    {/* Speed Value */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Speed: {canSignals.speedValue} km/h
                            {canSignals.gearMode === 0 && ' (P gear - disabled)'}
                        </label>
                        <input
                            type="range"
                            style={{
                                ...rangeStyle,
                                opacity: canSignals.gearMode === 0 ? 0.5 : 1,
                                cursor: canSignals.gearMode === 0 ? 'not-allowed' : 'pointer'
                            }}
                            min="0"
                            max="260"
                            value={canSignals.speedValue}
                            onChange={(e) => {
                                // P기어가 아닐 때만 속도 변경 가능
                                if (canSignals.gearMode !== 0) {
                                    updateSignal('speedValue', parseInt(e.target.value));
                                }
                            }}
                            disabled={simulationMode || canSignals.gearMode === 0}
                        />
                        <input
                            type="number"
                            style={{
                                ...inputStyle,
                                marginTop: '5px',
                                opacity: canSignals.gearMode === 0 ? 0.5 : 1,
                                cursor: canSignals.gearMode === 0 ? 'not-allowed' : 'text'
                            }}
                            min="0"
                            max="260"
                            value={canSignals.speedValue}
                            onChange={(e) => {
                                // P기어가 아닐 때만 속도 변경 가능
                                if (canSignals.gearMode !== 0) {
                                    updateSignal('speedValue', parseInt(e.target.value) || 0);
                                }
                            }}
                            disabled={simulationMode || canSignals.gearMode === 0}
                        />
                    </div>

                    {/* Driver Readiness */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Driver Readiness: {canSignals.driverReadiness}/10
                        </label>
                        <input
                            type="range"
                            style={rangeStyle}
                            min="0"
                            max="10"
                            value={canSignals.driverReadiness}
                            onChange={(e) => updateSignal('driverReadiness', parseInt(e.target.value))}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Battery Level */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Battery Level: {canSignals.batteryLevel}%
                        </label>
                        <input
                            type="range"
                            style={rangeStyle}
                            min="0"
                            max="100"
                            step="0.1"
                            value={canSignals.batteryLevel}
                            onChange={(e) => updateSignal('batteryLevel', parseFloat(e.target.value))}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Range */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Range: {canSignals.range} km
                        </label>
                        <input
                            type="number"
                            style={inputStyle}
                            min="0"
                            max="500"
                            value={canSignals.range}
                            onChange={(e) => updateSignal('range', parseInt(e.target.value) || 0)}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Power Consumption */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Power: {canSignals.powerConsumption} kW
                            {canSignals.powerConsumption < 0 && ' (Regenerating)'}
                        </label>
                        <input
                            type="range"
                            style={rangeStyle}
                            min="-30"
                            max="150"
                            step="0.1"
                            value={canSignals.powerConsumption}
                            onChange={(e) => updateSignal('powerConsumption', parseFloat(e.target.value))}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Battery Temperature */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Battery Temp: {canSignals.batteryTemperature}°C
                        </label>
                        <input
                            type="range"
                            style={rangeStyle}
                            min="10"
                            max="50"
                            step="0.1"
                            value={canSignals.batteryTemperature}
                            onChange={(e) => updateSignal('batteryTemperature', parseFloat(e.target.value))}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Motor Temperature */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Motor Temp: {canSignals.motorTemperature}°C
                        </label>
                        <input
                            type="range"
                            style={rangeStyle}
                            min="20"
                            max="100"
                            step="0.1"
                            value={canSignals.motorTemperature}
                            onChange={(e) => updateSignal('motorTemperature', parseFloat(e.target.value))}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Odometer */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Odometer: {canSignals.odometer.toFixed(1)} km
                        </label>
                        <input
                            type="number"
                            style={inputStyle}
                            min="0"
                            step="0.1"
                            value={canSignals.odometer}
                            onChange={(e) => updateSignal('odometer', parseFloat(e.target.value) || 0)}
                            disabled={simulationMode}
                        />
                    </div>

                    {/* Trip Meter */}
                    <div style={controlStyle}>
                        <label style={labelStyle}>
                            Trip: {canSignals.tripMeter.toFixed(2)} km
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                style={{ ...inputStyle, flex: 1 }}
                                min="0"
                                step="0.01"
                                value={canSignals.tripMeter}
                                onChange={(e) => updateSignal('tripMeter', parseFloat(e.target.value) || 0)}
                                disabled={simulationMode}
                            />
                            <button
                                style={{
                                    ...buttonStyle,
                                    width: 'auto',
                                    marginTop: 0,
                                    backgroundColor: '#ff9800'
                                }}
                                onClick={() => updateSignal('tripMeter', 0)}
                                disabled={simulationMode}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Simulation Mode Toggle */}
                <button
                    style={buttonStyle}
                    onClick={() => setSimulationMode(!simulationMode)}
                >
                    {simulationMode ? '⏹ Stop Simulation' : '▶ Start Simulation'}
                </button>

                {simulationMode && (
                    <p style={{
                        color: '#4CAF50',
                        textAlign: 'center',
                        marginTop: '10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif",
                        animation: 'pulse 2s infinite'
                    }}>
                        🔄 Simulation Running - Controls Disabled
                    </p>
                )}

                {/* Preset Scenarios */}
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{
                        color: '#999',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif",
                        marginBottom: '10px'
                    }}>
                        Quick Scenarios
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                        <button
                            style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: 0 }}
                            onClick={() => updateSignals({
                                autonomousStatus: 0,
                                gearMode: 0,
                                speedValue: 0,
                                driverReadiness: 10,
                                batteryLevel: 100,
                                range: 450,
                                powerConsumption: 0
                            })}
                            disabled={simulationMode}
                        >
                            🅿️ Parked
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: 0 }}
                            onClick={() => updateSignals({
                                autonomousStatus: 0,
                                gearMode: 3,
                                speedValue: 50,
                                driverReadiness: 10,
                                powerConsumption: 15
                            })}
                            disabled={simulationMode}
                        >
                            🏙️ City Driving
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: 0 }}
                            onClick={() => updateSignals({
                                autonomousStatus: 1,
                                gearMode: 3,
                                speedValue: 120,
                                driverReadiness: 5,
                                powerConsumption: 45
                            })}
                            disabled={simulationMode}
                        >
                            🛣️ Highway Auto
                        </button>
                        <button
                            style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: 0 }}
                            onClick={() => updateSignals({
                                batteryLevel: 15,
                                range: 50,
                                speedValue: 80,
                                powerConsumption: 25
                            })}
                            disabled={simulationMode}
                        >
                            🔋 Low Battery
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default SignalControls;