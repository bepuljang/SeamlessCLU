import React from 'react';
import { useCAN } from '../context/CANProvider';
import GridComponent from '../components/GridComponent';

const DrivingAssistant = () => {
    const { canSignals, getAutonomousStatusName } = useCAN();
    const { autonomousStatus } = canSignals;

    const isAutonomous = autonomousStatus === 1;

    return (
        <GridComponent w={3} h={1} xAlign="center" yAlign="center">
            <div style={{
                width: '100%',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
            }}>
                <div style={{
                    fontSize: '14px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Driving Mode
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: isAutonomous ? '#4CAF50' : '#FFC107',
                        animation: isAutonomous ? 'pulse 2s infinite' : 'none',
                        boxShadow: isAutonomous ? '0 0 10px #4CAF50' : 'none'
                    }} />
                    <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: isAutonomous ? '#4CAF50' : '#FFC107'
                    }}>
                        {getAutonomousStatusName(autonomousStatus)}
                    </div>
                </div>
                {isAutonomous && (
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        Vehicle is in control
                    </div>
                )}
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </GridComponent>
    );
};

export default DrivingAssistant;