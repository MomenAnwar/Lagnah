import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { SetSelected } from '../../../../Contexts/SetSelectedContext';
import { CONSUMER_API } from '../../../../APIS';
import { Form, Button, InputGroup, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaTrash } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { IoSearch } from 'react-icons/io5';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import Spinner from 'react-bootstrap/Spinner';



const Consumers = () => {
  const [ loading, setLoading ] = useState(true)
  const [ disableSubmit, setDisableSubmit] = useState(true)
  const [ adding, setAdding] = useState(false)
  const [ editing, setEditing] = useState(false)
  const [ id, setId] = useState('')
  const [consumers, setConsumers] = useState([])
  const [tableData, setTableData] = useState([])
  
  

  const validationSchema = yup.object({
        name: yup
        .string('')
        .required('اسم المستفيد مطلوب')
        .trim(), 
        IDNumber: yup
        .string('')
        .required("الرقم القومى مطلوب")
        .matches(`^\\d{14}$`, 'الرقم القومى يجب أن يكون 14 رقم'),
        partenerName: yup
        .string('')
        .required('اسم الزوج/ة مطلوب')
        .trim(),
        phoneNumber: yup
        .string('')
        .required('رقم الهاتف مطلوب')
        .matches('^\\d{11}$', 'برجاء إدخال رقم هاتف صحيح'),
        income: yup
        .string('')
        .required('برجاء إدخال دخل المستفيد الحالى')
        .trim(),
        age: yup
        .string('')
        .required('برجاء إدخال عمر المستخدم')
        .matches('^\\d{2}$', 'برجاء إدخال العمر بشكل صحيح'),
        childrenCount: yup
        .string()
        .required('عدد الأبناء مطلوب')
        .matches('^\\d$', 'برجاء إدخال عدد صحيح')
      });
      
      const formik = useFormik({
        initialValues: {},
        validationSchema: validationSchema,
        onSubmit: (values) => {
          setLoading(true)
          if(editing){
            fetch(CONSUMER_API + '/' + id, {method: "PUT", 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({name: values.name,
                                    IDNumber: values.IDNumber,
                                    phoneNumber: values.phoneNumber,
                                    age: values.age,
                                    income: values.income,
                                    childrenCount: values.childrenCount,
                                    partenername: values.partenername
              }),
              credentials: 'include'})
          .then( res => res.json())
          .then( data => {
            if(data.success){
              setTableData(consumers.map(consumer => consumer._id === id ? values : consumer))
              setEditing(false)
              Swal.fire({
                icon: "success",
                title: data.data
                        });
            } else {
              Swal.fire({
                icon: "error",
                title: data.data,
                        });
                }
              })
          } else {
            fetch(CONSUMER_API, {method: "POST", 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(values),
              credentials: 'include'})
          .then( res => res.json())
          .then( data => {
            if(data.success){
              setTableData([...consumers, values])
              setAdding(false)
              Swal.fire({
                icon: "success",
                title: data.data
                        });
            } else {
              Swal.fire({
                icon: "error",
                title: data.data,
                        });
                }
              })
          }
            setLoading(false)
    }});
    
          useEffect(()=> {
            if(formik.values.name && formik.values.IDNumber && formik.values.phoneNumber && formik.values.partenerName && formik.values.childrenCount && formik.values.income && formik.values.age && 
              !formik.errors.name && !formik.errors.IDNumber && !formik.errors.phoneNumber && !formik.errors.partenerName && !formik.errors.childrenCount && !formik.errors.income && !formik.errors.age){
              setDisableSubmit(false)      
            }
          }, [formik.values, formik.errors])



  const navigate = useNavigate()

  const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

  const deleteConsumer = (consumer1) => {
    swalWithBootstrapButtons.fire({
      title: `هل أنت متأكد من حذف "${consumer1.name}" ؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم, احذف!",
      cancelButtonText: "لا, إلغاء!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        fetch(CONSUMER_API + '/' + consumer1._id, {
          method: 'DELETE',
          credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
          if(data.success){
            setConsumers(consumers.filter(user => user._id !== consumer1._id))
            setTableData(consumers.filter(user => user._id !== consumer1._id))
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

  const editConsumer = (consumer) => {
    setEditing(true)
    setId(consumer._id)
    formik.setValues(consumer)
  }



  const {setSelectedDashboard} = useContext(SetSelected)
  useEffect(()=>{
    setSelectedDashboard('consumers')

    fetch(CONSUMER_API, {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
        if(data.success){
          setConsumers(data.data)
          setTableData(data.data)
          setLoading(false)
        } else if(data.data.name === 'JsonWebTokenError'){
                  Swal.fire({
                    icon: 'error',
                    title: 'يجب تسجيل الدخول أولا',
                  })
                  navigate('/login')
                }
    })

  }, [setSelectedDashboard])


  if(loading){
    return <div className='flex justify-center items-center h-96'>
      <Spinner animation="border" variant="primary" />
    </div>
  }


  return (
    <div>
        <div>
        <div className={`p-2 ${adding || editing ? 'block' : 'hidden'}`}>
        <form onSubmit={formik.handleSubmit} className='flex flex-wrap gap-y-3 bg-white rounded-lg mb-2 p-2' dir='rtl'>

            
 <div className='col-12 col-md-6 col-lg-4 px-2'>
   <TextField
     id="name"
     name="name"
     label="اسم المستفيد"
     value={formik.values.name}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.name && Boolean(formik.errors.name)}
     helperText={formik.touched.name && formik.errors.name}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         // right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>
 <div className='col-12 col-md-6 col-lg-4 px-2'>
   <TextField
     id="IDNumber"
     name="IDNumber"
     label="الرقم القومى"
     value={formik.values.IDNumber}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.IDNumber && Boolean(formik.errors.IDNumber)}
     helperText={formik.touched.IDNumber && formik.errors.IDNumber}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         // right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>
 <div className='col-12 col-md-6 col-lg-4 px-2'>
   <TextField
     id="partenerName"
     name="partenerName"
     label="اسم الزوج/ة"
     value={formik.values.partenerName}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.partenerName && Boolean(formik.errors.partenerName)}
     helperText={formik.touched.partenerName && formik.errors.partenerName}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         // right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>
 <div className='col-8 col-md-6 col-lg-3 px-2'>
   <TextField
     id="phoneNumber"
     name="phoneNumber"
     label="رقم الهاتف"
     value={formik.values.phoneNumber}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
     helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         // right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>
 <div className='col-4 col-md-6 col-lg-3 px-2'>
   <TextField
     id="income"
     name="income"
     label="الدخل"
     value={formik.values.income}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.income && Boolean(formik.errors.income)}
     helperText={formik.touched.income && formik.errors.income}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         // right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>
 <div className='col-6 col-md-6 col-lg-3 px-2'>
   <TextField
     id="age"
     name="age"
     label="العمر"
     value={formik.values.age}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.age && Boolean(formik.errors.age)}
     helperText={formik.touched.age && formik.errors.age}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         // right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>
 <div className='col-6 col-md-6 col-lg-3 px-2'>
   <TextField
     id="childrenCount"
     name="childrenCount"
     label="عدد الأبناء"
     value={formik.values?.childrenCount}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     error={formik.touched.childrenCount && Boolean(formik.errors.childrenCount)}
     helperText={formik.touched.childrenCount && formik.errors.childrenCount}
     variant="standard"
     fullWidth
     InputLabelProps={{
       style: {
         right: 0,  
         left: 'auto'
       },
     }}
   />
 </div>

   <div className='col-12 flex justify-between align-items-center'>
      {editing ? 
      <Button 
      color="primary" 
      variant="contained"
      type='submit'
      className={`${loading && 'opacity-50'} mx-auto col-md-6 mt-3`}
      disabled = { disableSubmit }
      >
      {!loading?'تعديل المستفيد' : 'جارى التحميل...'}
    </Button> :
    <Button 
    color="primary" 
    variant="contained" 
    type="submit" 
    className={`${loading && 'opacity-50'} mx-auto col-md-6 mt-3`}
    disabled = { disableSubmit }
    >
    {!loading?'إضافة المستفيد' : 'جارى التحميل...'}
    </Button>}
   </div>
   
 </form>
    </div>
        </div>

        <div className='p-2 flex bg-white mb-3'>
          <div className="hover:text-[#0c969c] text-2xl cursor-pointer" onClick={()=> setAdding(!adding)}> <FiUserPlus className="inline ml-3" /></div>
          <div>
            <InputGroup dir="ltr">
              <Button variant="outline-secondary" id="button-addon2">
                <IoSearch />
              </Button>
              <Form.Control
                onChange={(e)=> {
                  setTableData(consumers?.filter(consumer => consumer.name.toLowerCase().includes(e.target.value.toLowerCase()) 
                                                    || consumer.IDNumber.toLowerCase().includes(e.target.value.toLowerCase())
                                                    || consumer.partenerName.toLowerCase().includes(e.target.value.toLowerCase())))
                }}
              />
            </InputGroup>
        </div>
        <Button onClick={()=> setTableData(consumers)} variant='success' className='mx-3'>الكل</Button>
      </div>

        <div className="col-12">
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>رقم</th>
          <th> الاسم </th>
          <th> الرقم القومى </th>
          <th> اسم الزوج/ة </th>
          <th className='flex justify-between'> عدد الأبناء <DropdownButton
          id={`dropdown-button-drop`}
          size="sm"
          variant="s"
        >
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.childrenCount) === 1))}} className="text-end">1</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.childrenCount) === 2))}} className="text-end">2</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.childrenCount) === 3))}} className="text-end">3</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.childrenCount) > 3))}} className="text-end"> أكثر من 3</Dropdown.Item>
        </DropdownButton> </th>


          <th> رقم الهاتف </th>

          <th><div className='flex justify-between'> العمر <DropdownButton
          id={`dropdown-button-drop`}
          size="sm"
          variant="s"
        >
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.age) <= 20))}} className="text-end">أصغر من 20</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.age) > 20 && parseInt(consumer.age) <= 30))}} className="text-end">20 - 30</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.age) > 30 && parseInt(consumer.age) <= 40))}} className="text-end">30 - 40</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.age) > 40))}} className="text-end"> أكبر من 40</Dropdown.Item>
        </DropdownButton> </div></th>


          <th className='flex justify-between'> الدخل <DropdownButton
          id={`dropdown-button-drop`}
          size="sm"
          variant="s"
        >
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.income) <= 1000))}} className="text-end">أقل من 1000</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.income) <= 2000 && parseInt(consumer.income) > 1000))}} className="text-end">1000 - 2000</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.income) <= 3000 && parseInt(consumer.income) > 2000))}} className="text-end">2000 - 3000</Dropdown.Item>
          <Dropdown.Item eventKey="1" onClick={()=>{setTableData(tableData.filter(consumer => parseInt(consumer.income) > 3000))}} className="text-end">أكثر من 3000 </Dropdown.Item>
        </DropdownButton> </th>

          <th> استهلاك نقدى </th>
          <th> استهلاك زروع </th>
          <th> إجراءات </th>
        </tr>
      </thead>
      <tbody>
        {tableData?.map((consumer, i) => {
          return (
            <tr key={consumer._id}>
              <td>{i + 1}</td>
              <td className="text-ellipsis">{consumer.name}</td>
              <td className="text-ellipsis">{consumer.IDNumber}</td>
              <td className="text-ellipsis">{consumer.partenerName}</td>
              <td className="text-ellipsis">{consumer.childrenCount}</td>
              <td className="text-ellipsis">{consumer.phoneNumber}</td>
              <td className="text-ellipsis">{consumer.age}</td>
              <td className="text-ellipsis">{consumer.income}</td>
              <td className="text-ellipsis">{consumer.financeConsumed}</td>
              <td className="text-ellipsis">{consumer.seedsConsumed}</td>
            
              <td className="flex gap-x-2"> 
                {<button className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                                              onClick={()=> deleteConsumer(consumer)}> <FaTrash /> </button> }
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg"
                                                              onClick={()=> editConsumer(consumer)}> <FaUserEdit /></button> 
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

export default Consumers