import ContextProvider, { useTheme } from './context/ContextProvider'
import CANProvider from './context/CANProvider'
import './App.css'
import Header from './sections/Header'
import Body from './sections/Body'
import Footer from './sections/Footer'
import { colorScheme } from './rules/colorScheme'
import FloatingMenu from './components/FloatingMenu'

const HMI = () => {
  const {theme} = useTheme();

  return (
      <div id='clu-layout' style={{backgroundColor:colorScheme[theme].bgColor, color:colorScheme[theme].fontColor}}>
        <Header/>
        <Body/>
        <Footer/>
      </div>
  )
}


function App() {
  return (
    <ContextProvider>
      <CANProvider>
        <HMI/>
        <FloatingMenu/>
      </CANProvider>
    </ContextProvider>
  )
}

export default App
