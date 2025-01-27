import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField} from '@mui/material';
import { Container } from 'react-bootstrap'
import { USER_API } from '../../APIS'
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import Swal from 'sweetalert2'
import { AuthContext } from '../../Contexts/AuthContext';


const UserSignUp = () => {


  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  
  const [ loading, setLoading ] = useState(false)
  const [ disableSubmit, setDisableSubmit] = useState(true)  
  
  
  const validationSchema = yup.object({
    email: yup
    .string('Enter your email')
    .email('برجاء إدخال بريد إلكترونى صحيح')
    .required('البريد الالكترونى مطلوب'),
    password: yup
    .string('Enter your password')
    .min(8, 'كلمة المرور يجب أن تكون اكثر من 8 أحرف')
    .required('كلمة المرور مطلوبة'),
    name: yup
    .string('Enter your password')
    .min(8, 'اسم المستخد يجب أن لا يقل عن 8 أحرف')
    .required('اسم المستخدم مطلوب'),
    confirmPassword: yup
    .string()
    .required("برجاء تأكيد كلمة المرور")
    .oneOf([yup.ref('password'), null], 'لا يوجد تطابق')
  });
  
  const formik = useFormik({
    initialValues: {},
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      
      setLoading(true)

      const res = await fetch(USER_API + '/verify', {
        method: "POST", 
        body: JSON.stringify({email: values.email}), 
        headers: { 'Content-Type': 'application/json' }})

      setLoading(false)

      const data = await res.json()
      
      Swal.fire({
        title: "برجاء إدخال الكود الذى تم إرساله على البريد الالكترونى",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "تحقق",
        showLoaderOnConfirm: true,
        preConfirm: async (code) => {
            
          if(data.success){            
            if(!loading && parseInt(data.data) === parseInt(code)){
              fetch(USER_API + '/register', {method: "POST", 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({name: values.name, email: values.email, password: values.password}),
                credentials: 'include'})
                .then( res => res.json())
                .then( data => {
                  if(data.success){
                    login(data.body)
                    Swal.fire({
                    icon: "success",
                    title: data.data,
                  });
                  navigate('/')
                } else {
                  Swal.fire({
                    icon: "error",
                    title: data.data,
                  });
            }})} else {
              Swal.fire({
                icon: "error",
                title: "الكود غير صحيح",
              });
            }
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })

      setLoading(false)
        }
      })


  useEffect(()=> {
    if(formik.values.name && formik.values.email && formik.values.password && formik.values.confirmPassword && !loading
      && !formik.errors.email && !formik.errors.password && !formik.errors.name && !formik.errors.confirmPassword
    ){
      setDisableSubmit(false)      
    }
  }, [formik.values, formik.errors, loading])
  
  return (
    <>
<div style={{ backgroundImage: `url('http://localhost:5173/wallpaper/wallpaper.jpg')`, backgroundSize: 'cover', width: '100%', height: '100vh'}}
      className='flex align-items-center'>
    <Container className='p-3'>
      <form onSubmit={formik.handleSubmit} className='col-12 col-md-5 mx-auto flex gap-4 flex-col rounded-lg p-5 bg-white' dir='rtl'>

      <div style={{ display: 'flex', alignItems: `${formik.errors.name? 'center' : 'end'}` }}>
        <AccountCircle className='ml-2'/>
        <TextField
          id="name"
          name="name"
          label="اسم المستخدم"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          variant='standard'
          fullWidth
          InputLabelProps={{
            style: {
              right: 0,  
              left: 'auto'
            },
          }}
        />
      </div>


      <div style={{ display: 'flex', alignItems: `${formik.errors.email? 'center' : 'end'}` }}>
        <EmailIcon className='ml-2'/>
        <TextField
          id="email"
          name="email"
          label="البريد الالكترونى"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
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

          <div className='flex justify-between flex-wrap gap-4'>
      <div style={{ display: 'flex', alignItems: `${formik.errors.password? 'center' : 'end'}` }}
            className='col-md-5 col-12'>
        <PasswordIcon className='ml-2'/>
        <TextField
          id="password"
          name="password"
          type="Password"
          label="كلمة المرور"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
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

      <div style={{ display: 'flex', alignItems: `${formik.errors.confirmPassword? 'center' : 'end'}` }}
          className='col-md-5 col-12'>
      <PasswordIcon className='ml-2'/>
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="تأكيد كلمة المرور"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
        </div>


        <Button 
          color="primary" 
          variant="contained" 
          type="submit" 
          className={`${loading && 'opacity-50'} mx-auto col-md-6`}
          disabled = { disableSubmit }
          >
          {!loading?' إنشاء حساب' : 'جارى التحميل...'}
        </Button>
        <hr className='w-2/3 mx-auto bg-black' />
        <div className='mx-auto'> لديك حساب بالفعل؟  <Link to="/login" className='text-green-600 underline'> تسجيل الدخول </Link> </div>
        
      </form>
    </Container>
</div>
</>
  )
}

export default UserSignUp

