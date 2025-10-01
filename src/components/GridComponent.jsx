import { useState, useEffect, useRef } from 'react';
import { gx } from "../rules/gridSizing";
import { useCAN } from '../context/CANProvider';

const GridComponent = ({children,w=1,h=1, aW, aH, x=0,y=0, aX,aY, xAlign='center', yAlign='top', style}) => {
    const { canSignals } = useCAN();
    const [currentWidth, setCurrentWidth] = useState(w);
    const [currentHeight, setCurrentHeight] = useState(h);
    const [currentX, setCurrentX] = useState(gx(x));
    const [currentY, setCurrentY] = useState(gx(y));
    const animationRef = useRef();

    // 목표 사이즈 계산 - 자율주행 모드일 때 aW/aH 사용
    const targetWidth = canSignals?.autonomousStatus === 1 && aW ? aW : w;
    const targetHeight = canSignals?.autonomousStatus === 1 && aH ? aH : h;

    // 목표 위치 계산 - 자율주행 모드일 때 aX/aY 사용 (gx 적용)
    const targetX = canSignals?.autonomousStatus === 1 && aX !== undefined ? gx(aX) : gx(x);
    const targetY = canSignals?.autonomousStatus === 1 && aY !== undefined ? gx(aY) : gx(y);

    // 부드러운 사이즈 및 위치 전환 애니메이션
    useEffect(() => {
        const animate = () => {
            setCurrentWidth(prev => {
                const diff = targetWidth - prev;
                if (Math.abs(diff) < 0.05) return targetWidth;
                return prev + diff * 0.12; // 전환 속도
            });

            setCurrentHeight(prev => {
                const diff = targetHeight - prev;
                if (Math.abs(diff) < 0.05) return targetHeight;
                return prev + diff * 0.12; // 전환 속도
            });

            setCurrentX(prev => {
                const diff = targetX - prev;
                if (Math.abs(diff) < 0.05) return targetX;
                return prev + diff * 0.12; // 전환 속도
            });

            setCurrentY(prev => {
                const diff = targetY - prev;
                if (Math.abs(diff) < 0.05) return targetY;
                return prev + diff * 0.12; // 전환 속도
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [targetWidth, targetHeight, targetX, targetY]);

    // Calculate horizontal position based on xAlign (currentX 사용)
    const getHorizontalPosition = () => {
        switch(xAlign) {
            case 'left':
                return { left: currentX };
            case 'right':
                return { right: currentX };
            case 'center':
                return {
                    left: '50%',
                    transform: `translateX(calc(-50% + ${currentX}px))`
                };
            default:
                return { left: currentX };
        }
    };

    // Calculate vertical position based on yAlign (currentY 사용)
    const getVerticalPosition = () => {
        switch(yAlign) {
            case 'top':
                return { top: currentY };
            case 'bottom':
                return { bottom: currentY };
            case 'center':
                return {
                    top: '50%',
                    transform: `translateY(calc(-50% + ${currentY}px))`
                };
            default:
                return { top: currentY };
        }
    };

    // Combine transforms if both are centered (currentX, currentY 사용)
    const getTransform = () => {
        if (xAlign === 'center' && yAlign === 'center') {
            return `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        } else if (xAlign === 'center') {
            return `translateX(calc(-50% + ${currentX}px))`;
        } else if (yAlign === 'center') {
            return `translateY(calc(-50% + ${currentY}px))`;
        }
        return undefined;
    };

    // Build position styles
    const positionStyles = {
        ...getHorizontalPosition(),
        ...getVerticalPosition()
    };

    // Override transform if both alignments are centered
    if (xAlign === 'center' && yAlign === 'center') {
        positionStyles.transform = getTransform();
    }

    return (
        <div className="grid-component" style={{
            position: 'absolute',
            width: gx(currentWidth),
            height: gx(currentHeight),
            ...positionStyles,
            transition: 'all 0.3s linear',
            ...style
        }}>
            {children}
        </div>
    )
}

export default GridComponent