import GridComponent from "../../components/GridComponent"
import { useCAN } from '../../context/CANProvider';
import './style.css';

const SpeedMeter = () => {
    const { canSignals } = useCAN();

    return (
        <GridComponent w={3} h={1} xAlign="right">
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'end', gap:8}}>
                <span id="speed-value">{canSignals.speedValue}</span>
                <span id="speed-unit">km/h</span>
            </div>
        </GridComponent>
    )
}

export default SpeedMeter