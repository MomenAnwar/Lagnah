import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField} from '@mui/material';
import { Container } from 'react-bootstrap'
import {  useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import Swal from 'sweetalert2'
import { AuthContext } from '../../Contexts/AuthContext';


const UserLogin = () => {
  
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
        .required('كلمة المرور مطلوبة')
    });
  
    const formik = useFormik({
        initialValues: {},
        validationSchema: validationSchema,
        onSubmit: (values) => {
      
            setLoading(true)
      
            fetch(import.meta.env.VITE_USER_API + '/login', {method: "POST", 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({email: values.email, password: values.password}),
                credentials: 'include'})
                .then( res => res.json())
                .then( data => {
                    if(data.success){
                        login(data.body)                        
                        Swal.fire({
                          icon: "success",
                          title: data.data
                        });
                        navigate('/')
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: data.data,
                        });
                      }
                      
            setLoading(false)
            })
    },
  });

  useEffect(()=> {
    if(formik.values.email && formik.values.password && !formik.errors.email && !formik.errors.password && !loading){
      setDisableSubmit(false)      
    }
  }, [formik.values, formik.errors, loading])

  return (
    <div style={{ backgroundImage: `url('https://lagnah.vercel.app/wallpaper/wallpaper.jpg')`, backgroundSize: 'cover', width: '100%', height: '100vh'}  }
      className='flex align-items-center'>
    <Container className='p-3'>
      <form onSubmit={formik.handleSubmit} className='col-12 col-md-5 mx-auto flex gap-4 flex-col rounded-lg p-5 bg-white' dir='rtl'>


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


      <div style={{ display: 'flex', alignItems: `${formik.errors.password? 'center' : 'end'}` }}>
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


        <Button 
          color="primary" 
          variant="contained" 
          type="submit" 
          className={`${loading && 'opacity-50'} mx-auto col-md-6`}
          disabled = { disableSubmit }
          >
          {!loading?'تسجيل الدخول' : 'جارى التحميل...'}
        </Button>
        <hr className='w-2/3 mx-auto bg-black' />
        <div className='mx-auto'> ليس لديك حساب؟  <Link to="/register" className='text-green-600 underline'> أنشأ حسابك </Link> </div>
        
      </form>
    </Container>
</div>
  )
}

export default UserLogin