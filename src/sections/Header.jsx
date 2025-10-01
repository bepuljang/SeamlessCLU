import BatteryGauge from "../objects/BatteryGauge/BatteryGauge"
import ClockWidget from "../objects/ClockWidget"

const Header = () =>{
    return (
        <header id="clu-header">
            <ClockWidget/>
            <BatteryGauge/>
        </header>
    )
}

export default Header