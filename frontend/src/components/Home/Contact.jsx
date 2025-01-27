import { Button } from '@mui/material';
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { MESSAGE_API } from '../../APIS'
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
        fetch(MESSAGE_API, {
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
    <div style={{ backgroundImage: `url('http://localhost:5173/wallpaper/wallpaper.jpg')`, backgroundSize: 'cover', width: '100%', height: 'calc(100vh - 88px'}  }
      className='flex align-items-center'>
    <Container>
      <div className='p-3 flex-row flex-wrap bg-white flex col-12 col-md-7 mx-auto justify-around rounded align-items-center' style={{height: '500px'}}>
        <div className='col-12 col-md-6'>
          <img src="http://localhost:5173/assets/contact.jpg" alt="" className='fluid'/>
        </div>


      <form onSubmit={handleSubmit} className='col-12 col-md-5 flex gap-4 flex-col' dir='rtl'>

      <div className='flex'>
        <MessageIcon className='ml-2'/>
        <FloatingLabel controlId="floatingTextarea2" label="شاركنا رأيك..." className='ml-auto mr-0 text-right'>
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: '300px', width: '250px' }}
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
          className={`${loading && 'opacity-50'} mx-auto col-md-6`}
          disabled = { disabled }
          >
          {!loading?'إرسال' : 'جارى الإرسال...'}
        </Button>
        
      </form>
      </div>
    </Container>
</div>
  )
}

export default Contact