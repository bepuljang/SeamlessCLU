import GridComponent from "../../components/GridComponent"
import { colorScheme } from "../../rules/colorScheme";
import { useTheme } from "../../context/ContextProvider";
import { useCAN } from '../../context/CANProvider';
import './style.css'

const Gearmode = ({level}) => {
    const { theme } = useTheme();
    const getGearName = (mode) => {
        const gearNames = ['P', 'R', 'N', 'D'];
        return gearNames[mode] || 'P';
    };

    return (
        <GridComponent w={0.8} h={0.8} xAlign="left" yAlign="center">
            <div id="gear-box" style={{borderColor:colorScheme[theme].fontColor}}>
                {getGearName(level)}
            </div>
        </GridComponent>
    )
}

export default Gearmode