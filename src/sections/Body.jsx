import GridComponent from "../components/GridComponent"
import Gearmode from "../objects/Gearmode/Gearmode"
import SpeedMeter from "../objects/SpeedMeter/SpeedMeter"
import CarVisualizer from "../objects/CarVisualizer/CarVisualizer"
import { useCAN } from "../context/CANProvider"

const Body = () => {
    const { canSignals } = useCAN();
    return (
        <main>
            <CarVisualizer/>
            <GridComponent w={4} h={1} y={1} aX={-12}>
                <Gearmode level={canSignals.gearMode}/>
                <SpeedMeter/>
            </GridComponent>
        </main>
    )
}

export default Body