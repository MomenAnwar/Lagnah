import { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom'
import { SetSelected } from '../../../Contexts/SetSelectedContext';
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { GrGroup } from "react-icons/gr";
import { FaUsersRectangle } from "react-icons/fa6";


export default function Dashboard() {

  const {selectedDash, setSelectedNavbar} = useContext(SetSelected)

      useEffect(()=>{
        setSelectedNavbar('dashboard')
      }, [setSelectedNavbar])

  return (
  <div>
    <Container>

      <div className='flex p-3 bg-[#FAF9F6] gap-2 flex-col lg:flex-row'>

      <div className="bg-white rounded-lg col-lg-2 col-12 flex">
            <ul className='flex lg:flex-col lg:p-3 gap-2 w-full justify-around lg:justify-normal' style={{fontFamily: 'Noto Kufi Arabic'}}>
              <div className={`cursor-pointer text-xs sm:text-lg hover:text-[#0c969c] rounded px-2 py-1 ${selectedDash === 'consumers' && 'text-white bg-[#0c969c]'}`}>
                <Link to='consumers'>
                    <GrGroup className='ml-2 hidden md:inline'/>  المستفيديين
                </Link>
              </div>
              <div className={`cursor-pointer text-xs sm:text-lg hover:text-[#0c969c] rounded px-2 py-1 ${selectedDash === 'safe' && 'text-white bg-[#0c969c]'}`}>
                <Link to='safe'>
                    <GrMoney className='ml-2 hidden md:inline'/>  الخزينة
                </Link>
              </div>
              <div className={`cursor-pointer text-xs sm:text-lg hover:text-[#0c969c] rounded px-2 py-1 ${selectedDash === 'transactions' && 'text-white bg-[#0c969c]'}`}>
                <Link to='transactions'>
                    <TbArrowsDoubleNeSw className='ml-2 hidden md:inline'/>  التحويلات
                </Link>
              </div>
              <div className={`cursor-pointer text-xs sm:text-lg hover:text-[#0c969c] rounded px-2 py-1 ${selectedDash === 'users' && 'text-white bg-[#0c969c]'}`}> 
                <Link to='users'>
                    <FaUsersRectangle className='ml-2 hidden md:inline'/>  المستخدمين
                </Link>
              </div>
            </ul>
        </div>

        <div className='col-12 col-lg-10'>
          <Outlet />
        </div>
        
      </div>
    </Container>
    </div>
  );
}
