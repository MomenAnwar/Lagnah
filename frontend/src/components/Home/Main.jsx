import { SetSelected } from '../../Contexts/SetSelectedContext'
import { useContext, useEffect } from 'react'



const Main = () => {

    const {setSelectedNavbar} = useContext(SetSelected)
    
    useEffect(()=>{
      setSelectedNavbar('main')
    }, [setSelectedNavbar])
  return (
    <div className='flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-3xl font-bold text-center mt-10 mb-5'>
        مرحبا بكم فى موقع لجنة الزكاة والصدقات ببهنيا
      </h1>
    </div>
  )
}

export default Main