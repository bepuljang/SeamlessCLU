import GridComponent from "../components/GridComponent";
import { useCAN } from "../context/CANProvider"

const OdoMeter = () => {
    const {canSignals} = useCAN ();

    return (
        <GridComponent w={2} h={1} xAlign="right">
            <span style={{display:'flex', alignItems:'baseline', gap:4}}>
                <strong>
                    {canSignals.odometer}
                </strong> 
                <span style={{fontSize:'0.8em'}}>
                    km
                </span>
            </span>
        </GridComponent>
    )
}

export default OdoMeter