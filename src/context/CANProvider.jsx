import React, { createContext, useContext, useState, useEffect } from 'react';

// CAN 신호 컨텍스트 생성
const CANContext = createContext();

// CAN Provider 컴포넌트
export const CANProvider = ({ children }) => {
    // CAN 신호 상태 정의
    const [canSignals, setCanSignals] = useState({
        autonomousStatus: 0,    // 0: Manual, 1: Autonomous
        gearMode: 0,           // 0: P, 1: R, 2: N, 3: D
        speedValue: 0,         // 0-260 km/h
        driverReadiness: 10,   // 0-10 (10 = fully ready)
        batteryLevel: 85,      // 0-100 %
        batteryTemperature: 22, // Battery temperature in Celsius
        motorTemperature: 45,  // Motor temperature in Celsius
        odometer: 12543,       // km
        tripMeter: 0,          // km
        range: 380,            // Remaining range in km
        powerConsumption: 0,   // kW (negative for regeneration),
        brainStatus:0,
        signalTimestamp: Date.now()
    });

    // 개별 신호 업데이트 함수
    const updateSignal = (signalName, value) => {
        setCanSignals(prev => ({
            ...prev,
            [signalName]: value,
            signalTimestamp: Date.now()
        }));
    };

    // 여러 신호 동시 업데이트 함수
    const updateSignals = (updates) => {
        setCanSignals(prev => ({
            ...prev,
            ...updates,
            signalTimestamp: Date.now()
        }));
    };

    // 시뮬레이션 모드 (개발용)
    const [simulationMode, setSimulationMode] = useState(false);

    // 시뮬레이션 효과 (개발 환경에서 테스트용)
    useEffect(() => {
        if (simulationMode) {
            const interval = setInterval(() => {
                setCanSignals(prev => {
                    // 속도 시뮬레이션
                    let newSpeed = prev.speedValue;
                    if (prev.gearMode === 3) { // D 모드
                        newSpeed = Math.min(260, prev.speedValue + Math.random() * 5);
                    } else if (prev.gearMode === 1) { // R 모드
                        newSpeed = Math.max(0, Math.min(30, prev.speedValue + Math.random() * 2));
                    } else {
                        newSpeed = Math.max(0, prev.speedValue - 2);
                    }

                    // 전력 소비 시뮬레이션 (속도에 따라 증가, 감속 시 회생)
                    const acceleration = newSpeed - prev.speedValue;
                    const newPowerConsumption = acceleration > 0
                        ? Math.min(150, newSpeed * 0.5 + Math.random() * 10)  // 가속 시 소비
                        : acceleration < 0
                        ? Math.max(-30, acceleration * 2)  // 감속 시 회생
                        : Math.max(5, newSpeed * 0.1);  // 정속 주행

                    // 배터리 소모 시뮬레이션
                    const batteryDrain = newPowerConsumption > 0 ? newPowerConsumption / 10000 : -newPowerConsumption / 20000;
                    const newBattery = Math.max(0, Math.min(100, prev.batteryLevel - batteryDrain));

                    // 주행 가능 거리 계산
                    const newRange = Math.round((newBattery / 100) * 450);  // 최대 450km 기준

                    // 배터리 온도 시뮬레이션 (전력 소비에 따라 변화)
                    const newBatteryTemp = Math.min(45, Math.max(15,
                        prev.batteryTemperature + (newPowerConsumption > 50 ? 0.1 : -0.05)
                    ));

                    // 모터 온도 시뮬레이션
                    const newMotorTemp = Math.min(80, Math.max(30,
                        prev.motorTemperature + (newSpeed > 100 ? 0.2 : -0.1)
                    ));

                    // 주행거리 증가
                    const distance = (newSpeed / 3600); // km per second
                    const newOdometer = prev.odometer + distance;
                    const newTripMeter = prev.tripMeter + distance;

                    return {
                        ...prev,
                        speedValue: Math.round(newSpeed),
                        powerConsumption: Math.round(newPowerConsumption * 10) / 10,
                        batteryLevel: Math.round(newBattery * 10) / 10,
                        range: newRange,
                        batteryTemperature: Math.round(newBatteryTemp * 10) / 10,
                        motorTemperature: Math.round(newMotorTemp * 10) / 10,
                        odometer: Math.round(newOdometer * 10) / 10,
                        tripMeter: Math.round(newTripMeter * 100) / 100,
                        signalTimestamp: Date.now()
                    };
                });
            }, 100); // 100ms 주기로 업데이트

            return () => clearInterval(interval);
        }
    }, [simulationMode]);



    // 자율주행 상태 이름 변환 헬퍼
    const getAutonomousStatusName = (status) => {
        return status === 1 ? 'Autonomous' : 'Manual';
    };

    // Context value
    const value = {
        canSignals,
        updateSignal,
        updateSignals,
        simulationMode,
        setSimulationMode,
        getAutonomousStatusName,
    };

    return (
        <CANContext.Provider value={value}>
            {children}
        </CANContext.Provider>
    );
};

// Custom hook to use CAN context
export const useCAN = () => {
    const context = useContext(CANContext);
    if (!context) {
        throw new Error('useCAN must be used within a CANProvider');
    }
    return context;
};

export default CANProvider;