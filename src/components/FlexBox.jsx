import { gx } from "../rules/gridSizing"

const FlexBox = ({children, w, h}) => {
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:gx(w), height:gx(h)}}>
            {children}
        </div>
    )
}

export default FlexBox