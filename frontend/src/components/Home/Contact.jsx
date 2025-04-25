import { Button } from '@mui/material';
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { useContext, useEffect, useState } from 'react';
import MessageIcon from '@mui/icons-material/Message';
import Swal from 'sweetalert2'
import { SetSelected } from '../../Contexts/SetSelectedContext';


const Contact = () => {

  
    const [ loading, setLoading ] = useState(false)
    const [ message, setMessage] = useState('')
    const [ disabled, setDisabled] = useState(true)

      const {setSelectedNavbar} = useContext(SetSelected)
    
          
    useEffect(()=> {
      setSelectedNavbar('contact')
      if(message.length >= 50){
        setDisabled(false)
      } else {
        setDisabled(true)
      }
    }, [message, setSelectedNavbar])


    const handleSubmit = (e) => {
      e.preventDefault()
      setLoading(true)
        fetch(import.meta.env.VITE_MESSAGE_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({content: message}),
          credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
          if(data.success){
            Swal.fire({
              icon: "success",
              title: data.data
            })
            setMessage('')
          } else {
            Swal.fire({
              icon: "error",
              title: data.data
            })
          }
        })

      setLoading(false)
    }

  
  
  return (
    <div style={{ backgroundImage: `url('https://lagnah.vercel.app/wallpaper/wallpaper.jpg')`, backgroundSize: 'cover', width: '100%', height: 'calc(100vh - 88px'}  }
      className='flex align-items-center'>
    <Container>
      <div className='flex-row flex-wrap bg-white flex col-12 justify-center p-5 rounded align-items-center'>
        <div className='col-6 col-md-6'>
          <img src="https://lagnah.vercel.app/assets/contact.jpg" alt="" className='fluid'/>
        </div>


      <form onSubmit={handleSubmit} className='col-12 col-md-5 mx-auto flex gap-2 flex-col align-items-center'>

      <div className='flex'>
        <MessageIcon className='ml-2'/>
        <FloatingLabel controlId="floatingTextarea2" className='contactArea' label="شاركنا رأيك...">
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{height: '250px', width: '250px'}}
          value={message}
          onChange= {(e) => {            
            setMessage(e.target.value)
          }}
        />
      </FloatingLabel>
      </div>


        <Button 
          color="success" 
          variant="contained" 
          type="submit" 
          className={`${loading && 'opacity-50'}`}
          disabled = { disabled }
          >
          {!loading?'إرسال' : 'جارى الإرسال...'}
        </Button>
        <p className='text-green-600 text-sm pt-1' style={{borderTop: 'solid 1px blue'}}>
          *لتجنب الرسائل الغير مهمة، يجب أن تكون الرسالة 50 حرفا فأكثر، ويرجى إضافة كافة التفاصيل الضرورية للمساعدة مثل رقم الهاتف أو العنوان.
        </p>
        
      </form>
      </div>
    </Container>
</div>
  )
}

export default Contact