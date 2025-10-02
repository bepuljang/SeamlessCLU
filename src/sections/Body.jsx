import GridComponent from "../components/GridComponent"
import Gearmode from "../objects/Gearmode/Gearmode"
import SpeedMeter from "../objects/SpeedMeter/SpeedMeter"
import CarVisualizer from "../objects/CarVisualizer/CarVisualizer"
import { useCAN } from "../context/CANProvider"
import AiObject from "../objects/AiObject"

const Body = () => {
    const { canSignals } = useCAN();
    return (
        <main>
            <CarVisualizer/>
            <GridComponent w={4} h={1} y={1} aX={-12} style={{position:'relative'}}>
                <Gearmode level={canSignals.gearMode}/>
                <SpeedMeter/>
            </GridComponent>
            <AiObject/>
        </main>
    )
}

export default Body