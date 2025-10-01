import GridComponent from "../../components/GridComponent"
import { useCAN } from '../../context/CANProvider';
import shade from "./gauge_shade.png"
import './style.css';

const BatteryGauge = () => {
    const { canSignals } = useCAN();

    return (
        <GridComponent w={2} h={1} xAlign="right">
            <div style={{width:80, height:28, backgroundColor:'#CCC', borderRadius:8, overflow:'hidden', position:'relative'}}>
                <div id="battery-current-gauge" style={{width:canSignals.batteryLevel+"%"}}>
                </div>
                <img src={shade} className="shade"/>
            </div>
        </GridComponent>
    )
}

export default BatteryGauge