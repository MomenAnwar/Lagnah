import { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom'
import { SetSelected } from '../../../Contexts/SetSelectedContext';
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { GrGroup } from "react-icons/gr";
import { FaUsersRectangle } from "react-icons/fa6";


export default function Dashboard() {

  const {selectedDash, setSelectedNavbar} = useContext(SetSelected)

  const navClassName = 'cursor-pointer hover:text-[#0c969c] rounded px-2 py-1'

  const navigate = useNavigate()

      useEffect(()=>{
        setSelectedNavbar('dashboard')
      }, [setSelectedNavbar])

  return (
  <div>
    <Container>

      <div className='flex p-3 bg-[#FAF9F6] gap-2 flex-col lg:flex-row'>

      <div className="bg-white rounded-lg col-lg-2 col-12 flex">
            <ul className='flex lg:flex-col sm:text-lg text-sm lg:p-3 gap-2 w-full justify-around lg:justify-normal p-2' style={{fontFamily: 'Noto Kufi Arabic'}}>
              <div className={`${navClassName} ${selectedDash === 'consumers' && 'text-white bg-[#0c969c]'}`}
                    onClick={()=>navigate('consumers')}>
                    <GrGroup className='ml-2 hidden md:inline'/>  المستفيدين
              </div>
              <div className={`${navClassName} ${selectedDash === 'safe' && 'text-white bg-[#0c969c]'}`}
                    onClick={()=>navigate('safe')}>
                    <GrMoney className='ml-2 hidden md:inline'/>  الخزينة
              </div>
              <div className={`${navClassName} ${selectedDash === 'transactions' && 'text-white bg-[#0c969c]'}`}
                    onClick={()=>navigate('transactions')}>
                    <TbArrowsDoubleNeSw className='ml-2 hidden md:inline'/>  التحويلات
              </div>
              <div className={`${navClassName} ${selectedDash === 'users' && 'text-white bg-[#0c969c]'}`}
                    onClick={()=>navigate('users')}> 
                    <FaUsersRectangle className='ml-2 hidden md:inline'/>  المستخدمين
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
