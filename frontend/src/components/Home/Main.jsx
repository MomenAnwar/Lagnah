import { SetSelected } from '../../Contexts/SetSelectedContext'
import { useContext, useEffect } from 'react'



const Main = () => {

    const {setSelectedNavbar} = useContext(SetSelected)
    
    useEffect(()=>{
      setSelectedNavbar('main')
    }, [setSelectedNavbar])
  return (
    <div>Main</div>
  )
}

export default Main