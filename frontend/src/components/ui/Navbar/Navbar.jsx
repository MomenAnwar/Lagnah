import { Button, Navbar } from "flowbite-react";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../../../Contexts/AuthContext";
import { useContext } from "react";
import { SetSelected } from "../../../Contexts/SetSelectedContext";
import { Avatar } from "antd";
import Swal from "sweetalert2";
import { FaRegBell } from "react-icons/fa";



const Header = () => {

  const {selectedNav} = useContext(SetSelected)
  
  const { userData, logout } = useContext(AuthContext);
  
  const navigate = useNavigate()

  const fLetter = userData.user?.name.charAt(0).toUpperCase()
  let sLetter = ''
  if(name.includes(' ')){
    sLetter = userData.user?.name.split(' ')[1].charAt(0).toUpperCase() || ''
  }

  const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });


  return (
  <div style={{position: 'sticky', top: '0', boxShadow: '0px 1px 10px 0px #999', backgroundColor: "white", zIndex: '10'}}>  
  <Container>
    <Navbar rounded className="flex align-middle">
      <Navbar.Brand className="w-14 h-14">
        <img src="https://lagnah.vercel.app/assets/logo.webp" className="" alt="Logo" />
      </Navbar.Brand>
      <div className="flex md:order-2 gap-3">
      {userData.user?  
      <div className="flex align-items-center gap-2 p-1 rounded-full border-[#031716] border-2">
        <Avatar size={40} className="bg-[#0c969c]">
          {fLetter+sLetter}
          </Avatar>
        {userData.user?.isAdmin && <Link to="/messages" className={`${selectedNav === 'messages' && 'bg-[#031716] text-white'} rounded-circle p-1 text-[#0c969c] hover:text-[#031716]`}><FaRegBell size={25} /></Link>}
        <DropdownButton
          id={`dropdown-button-drop`}
          size="sm"
          variant="s"
        >
          <Dropdown.Item eventKey="1" onClick={()=>{
            swalWithBootstrapButtons.fire({
              title: `سوف تقوم بتسجيل الخروج!`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "نعم!",
              cancelButtonText: "لا, إلغاء!",
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                  logout()
                  navigate('/')
                } else if (
                        result.dismiss === Swal.DismissReason.cancel
                      ) {
                        swalWithBootstrapButtons.fire({
                          title: "تم الإلغاء",
                          icon: "error"
                        });
                      }
                    })
            
            }} className="text-end">تسجيل خروج</Dropdown.Item>
        </DropdownButton>
      </div>
      :
      <>
        <Button onClick={() => navigate('/login')} color="success">تسجيل دخول</Button>
        <Button onClick={() => navigate('/register')} className="hidden sm:block">حساب جديد</Button>
      </>
      }</div>
      <Navbar.Toggle style={{border: 'none'}} />
      <Navbar.Collapse>
        <ul className="mb-4 flex-row mx-auto gap-1 flex text-[#031716]" style={{fontFamily: 'Cairo', fontSize: '18px'}}>
          <Link to="/" className={`${selectedNav === 'main' && 'bg-[#0c969c] text-white'} p-1 text-xs sm:text-lg rounded-lg text-nowrap sm:px-3 hover:text-[#0c969c]`}> الرئيسية </Link>
          <Link to="/posts" className={`${selectedNav === 'posts' && 'bg-[#0c969c] text-white'} p-1 text-xs sm:text-lg rounded-lg text-nowrap sm:px-3 hover:text-[#0c969c]`}> المنشورات </Link>
          {userData.user?.isAdmin && <Link to="/dashboard/consumers" className={`${selectedNav === 'dashboard' && 'bg-[#0c969c] text-white'} p-1 text-xs sm:text-lg rounded-lg text-nowrap sm:px-3 hover:text-[#0c969c]`}> لوحة التحكم </Link>}
          <Link to="/contact" className={`${selectedNav === 'contact' && 'bg-[#0c969c] text-white'} p-1 text-xs sm:text-lg rounded-lg text-nowrap sm:px-3 hover:text-[#0c969c]`}> تواصل معنا </Link>
        </ul>
      </Navbar.Collapse>
    </Navbar>
  </Container>
  </div>
  )
}

export default Header