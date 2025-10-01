import { useState, useEffect } from 'react'
import GridComponent from "../components/GridComponent"
import { useTheme } from "../context/ContextProvider"
import { colorScheme } from "../rules/colorScheme"

const ClockWidget = () => {
    const {theme} = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // 매 초마다 시간 업데이트
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearInterval(timer);
    }, []);

    // 시간 포맷팅 (24시간 형식)
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <GridComponent w={2} h={1} xAlign="center">
            <span style={{color:colorScheme[theme].fontColor}}>
                {formatTime(currentTime)}
            </span>
        </GridComponent>
    )
}

export default ClockWidget