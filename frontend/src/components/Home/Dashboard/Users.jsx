import { useContext, useEffect, useRef, useState } from "react"
import { SetSelected } from "../../../Contexts/SetSelectedContext"
import { Button, Dropdown, DropdownButton, Form, InputGroup, Table } from "react-bootstrap";
import { IoStar } from "react-icons/io5";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { LuMailPlus } from "react-icons/lu";
import { USER_API } from "../../../APIS";
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { IoSearch } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";





const Users = () => {


    const {setSelectedDashboard} = useContext(SetSelected)

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  ////////////////
  const [show2, setShow2] = useState(false);
  const [target2, setTarget2] = useState(null);
  const ref2 = useRef(null);

  const handleClick2 = (event) => {
    setShow2(!show2);
    setTarget2(event.target);
  };
  

  const navigate = useNavigate()

  const [tableData, setTableData] = useState([])
  const [users, setUsers] = useState([])
  const [label, setLabel] = useState('الكل')

  const deleteUser = (user1) => {
    swalWithBootstrapButtons.fire({
      title: `هل أنت متأكد من حذف "${user1.name}" ؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم, احذف!",
      cancelButtonText: "لا, إلغاء!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        fetch(USER_API + '/' + user1._id, {
          method: 'DELETE',
          credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
          if(data.success){
            setUsers(users.filter(user => user._id !== user1._id))
            setTableData(users.filter(user => user._id !== user1._id))
            Swal.fire({
              icon: 'success',
              title: 'تم الحذف بنجاح',
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: data.data,
            })
          }
        })

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "تم الإلغاء",
          icon: "error"
        });
      }
    })}


    const setAsAdmin = (user1) => {
      swalWithBootstrapButtons.fire({
        title: `هل أنت متأكد من تعيين "${user1.name}" كمسئول ؟`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم, تعيين!",
        cancelButtonText: "لا, إلغاء!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
  
          fetch(USER_API + '/admin/' + user1._id, {
            method: 'PUT',
            credentials: 'include',
          })
          .then(response => response.json())
          .then(data => {
            if(data.success){
              Swal.fire({
                icon: 'success',
                title: 'تم التعيين بنجاح',
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: data.data,
              })
            }
          })
  
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "تم الإلغاء",
            icon: "error"
          });
        }
      })}


    const toggleManager = (user1) => {
      swalWithBootstrapButtons.fire({
        title: !user1.isManager ? `هل أنت متأكد من تعيين "${user1.name}" كمشرف ؟` : `هل أنت متأكد من إلغاء إشراف "${user1.name}" ؟`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: user1.isManager ? "نعم, إلغاء!" : "نعم, تعيين!",
        cancelButtonText: " لا، إلغاء الطلب!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
  
          fetch(USER_API + '/manager/' + user1._id, {
            method: 'PUT',
            credentials: 'include',
          })
          .then(response => response.json())
          .then(data => {
            if(data.success){
              Swal.fire({
                icon: 'success',
                title: 'تمت العملية بنجاح',
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: data.data,
              })
            }
          })
  
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "تم الإلغاء",
            icon: "error"
          });
        }
      })}

  
    useEffect(()=>{
      setSelectedDashboard('users')
      fetch(USER_API, {
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        if(data.success){
          setUsers(data.data)
          setTableData(data.data)
        } else if(data.data.name === 'JsonWebTokenError'){
          Swal.fire({
            icon: 'error',
            title: 'يجب تسجيل الدخول أولا',
          })
          navigate('/login')
        }
        else {
          Swal.fire({
            icon: 'error',
            title: data.data,
          })
        }
      })
    }, [])


  return (
    <div className="flex flex-wrap" style={{maxHeight: '100vh'}}>
      
    <div className="col-12 flex gap-3 align-items-center">
    <div className="flex align-items-center">
        <h1 className="text-center p-4 text-xl">  {label}: {tableData.length}</h1>
        <DropdownButton id="dropdown-basic-button" variant="success">
          <Dropdown.Item className="text-end"
          onClick={()=> {
            setTableData(users)
            setLabel('الكل')
          }} >الكل</Dropdown.Item>
          <Dropdown.Item className="text-end"
          onClick={()=> {
            setTableData(users?.filter(user => user.isAdmin))
            setLabel('المسئولين')
            }} >المسئولين</Dropdown.Item>
          <Dropdown.Item className="text-end"
          onClick={()=> {
            setTableData(users?.filter(user => user.isManager))
            setLabel('المشرفين')
          }} >المشرفين</Dropdown.Item>
          <Dropdown.Item className="text-end"
          onClick={()=> {
            setTableData(users?.filter(user => !user.isAdmin && !user.isManager))
            setLabel('المستخدمين')
          }} >المستخدمين</Dropdown.Item>
        </DropdownButton>
        
      </div>

      <div>
      <InputGroup dir="ltr">
        <Button variant="outline-secondary" id="button-addon1">
          <IoSearch />
        </Button>
        <Form.Control
          onChange={(e)=> {
            setTableData(users?.filter(user => user.name.toLowerCase().includes(e.target.value.toLowerCase()) 
                                            || user.email.toLowerCase().includes(e.target.value.toLowerCase())))
          }}
        />
      </InputGroup>
      </div>
    </div>

      <div className="col-12 overflow-auto">
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>رقم</th>
          <th> الاسم </th>
          <th> البريد الإلكترونى </th>
          <th> الرتبة </th>
          <th> إجراءات </th>
        </tr>
      </thead>
      <tbody>
        {tableData?.map((user, i) => {
          return (
            <tr key={user._id}>
              <td>{i + 1}</td>
              <td className="text-ellipsis">{user.name}</td>
              <td className="text-ellipsis">{user.email}</td>
              <td>
                {user.isAdmin ? <div>
                  <IoStar className="text-yellow-400"/>
                  
                  </div>
                :
                user.isManager ?<div ref={ref}>  
                  <IoStar className="text-gray-400 cursor-pointer" onClick={handleClick}/>
                  <Overlay
                    show={show}
                    target={target}
                    placement="bottom"
                    container={ref}
                    containerPadding={20}
                  >
                    <Popover id="popover-contained">
                      <Popover.Header as="h3"> تغيير الرتبة إلى: </Popover.Header>
                      <Popover.Body>
                        <button onClick={()=> setAsAdmin(user)} className="p-2 text-center hover:text-green-500"> مسئول </button> <br />
                        <button onClick={()=> toggleManager(user)} className="p-2 text-center hover:text-green-500"> مستخدم </button>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </div> 
                : 
                <div ref={ref2}> 
                  <FaRegStar className="cursor-pointer" onClick={handleClick2}/>
                  <Overlay
                    show={show2}
                    target={target2}
                    placement="bottom"
                    container={ref2}
                    containerPadding={20}
                  >
                    <Popover id="popover-contained">
                      <Popover.Header as="h3"> تغيير الرتبة إلى: </Popover.Header>
                      <Popover.Body>
                        <button onClick={()=> setAsAdmin(user)} className="p-2 text-center hover:text-green-500"> مسئول </button> <br />
                        <button onClick={()=> toggleManager(user)} className="p-2 text-center hover:text-green-500"> مشرف </button>
                      </Popover.Body>
                    </Popover>
                  </Overlay>
                </div>
                }
              </td>
              <td className="flex gap-x-2"> 
                {!user.isAdmin && !user.isManager && <button className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                                              onClick={()=> deleteUser(user)}> <FaTrash /> </button> }
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg"> <LuMailPlus /></button> 
              </td>
            </tr>
          )
        })}      
      </tbody>
    </Table>
      </div>
    </div>
  )
}

export default Users