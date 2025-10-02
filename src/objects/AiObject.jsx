import GridComponent from "../components/GridComponent"
import { useTheme } from '../context/ContextProvider'
import { colorScheme } from '../rules/colorScheme'
import './AiObject.css'

const AiObject = ({text = '현재 이상이 없습니다.', thinking = false , message = '전방에 터널이 있습니다. 주의하세요.'}) => {
    const { theme } = useTheme();
    const themeColor = colorScheme[theme].bgColor;

    return (
        <div style={{position:'absolute', bottom:0,}}>
            <div
                id="ai-object"
                className={message ? 'with-message' : ''}
                data-theme={theme}
                data-thinking={thinking}
                style={{'--theme-color': themeColor}}
            >
                {message ?                
                <div>
                    <p>{message}</p>
                </div> :
                <div>
                    <span></span>
                    <span></span>
                </div>
                }
            </div>
            <p>
                {
                    text            
                }
            </p>
        </div>
    )
}

export default AiObject