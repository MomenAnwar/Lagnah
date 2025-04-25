import { Button, Form, InputGroup, ListGroup, Overlay, Popover, Spinner } from "react-bootstrap"
import { useContext, useEffect, useRef, useState } from "react"
import { SetSelected } from "../../Contexts/SetSelectedContext"
import { MdEditNote, MdOutlinePostAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";
import { AuthContext } from "../../Contexts/AuthContext";
import { Image } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";





const Posts = () => {

    const {setSelectedNavbar} = useContext(SetSelected)
    const {userData} = useContext(AuthContext)

    const [posts, setPosts] = useState([])
    const [activePosts, setActivePosts] = useState([])
    const [posting, setPosting] = useState(false)
    const [editing, setEditnig] = useState(false)
    const [id, setID] = useState('')
  
    const [ loading, setLoading ] = useState(true)
    const [ disableSubmit, setDisableSubmit] = useState(true)
    const [files, setFiles] = useState([]);
    


const [activeOverlay, setActiveOverlay] = useState(null); // Tracks which overlay is active
const [target, setTarget] = useState(null); // Tracks the target element for the active overlay
const ref = useRef([]); // Stores refs for all posts

const handleClick = (postId, event) => {
  if(activeOverlay === postId){
    handleClose()
  } else {
    setActiveOverlay(postId); // Set the active post's ID
    setTarget(event.target);   // Set the target for the overlay
  }

};

const handleClose = () => {
  setActiveOverlay(null); // Close any open overlay
};

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

const deletepost = (id) => {
  handleClose()
  swalWithBootstrapButtons.fire({
    title: `هل أنت متأكد من حذف المنشور ؟`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم, احذف!",
    cancelButtonText: "لا, إلغاء!",
  }).then((result) => {
    if (result.isConfirmed) {

      fetch(import.meta.env.VITE_POST_API + '/' + id, {
        method: 'DELETE',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        if(data.success){
          setActivePosts(posts.filter(post => post._id !== id))
          Swal.fire({
            icon: 'success',
            title: data.data,
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
          })
}

  const editPost = (post) => {
    handleClose()
    formik.setValues({title: post.title, content: post.content, images: post.images})
    setEditnig(true)
    setID(post._id)
  }

  const handleImageChange = (e) => {
    if (e.target.files){
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(file =>{
        const reader = new FileReader();      
  
        reader.readAsDataURL(file); // base64
  
        reader.onloadend = () => {
          setFiles((prevFiles) => [...prevFiles, reader.result]);
        };
      })
    }
	};


    const navigate = useNavigate()   
        const validationSchema = yup.object({
            title: yup
            .string('Enter your email')
            .min(8, 'العنوان يجب أن يكون أكثر من 8 أحرف')
            .required('العنوان مطلوب'),
            content: yup
            .string('Enter your password')
            .min(15, 'المحتوى يجب أن يكون أكثر من 15 حرف')
            .required('محتوى المنشور مطلوب')
        });

        const clearForm = () => {
          formik.setValues({})
        }
      
        const formik = useFormik({
            initialValues: {},
            validationSchema: validationSchema,
            onSubmit: async (values) => {                      
                setLoading(true)
                if(editing){
                  fetch(import.meta.env.VITE_POST_API + '/' + id, {method: "PUT", 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({...values, images: files}),
                    credentials: 'include'})
                    .then( res => res.json())
                    .then( data => {
                        if(data.success){
                          setActivePosts(activePosts.map(post => post._id === id ? data.body : post))
                          setEditnig(false)
                          clearForm()
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
                const res = await fetch(import.meta.env.VITE_POST_API, {method: "POST", 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({...values, images: files}),
                    credentials: 'include'})
                const data = await res.json()
                        if(data.success){
                          setActivePosts([data.body, ...activePosts])
                          setPosting(false)
                          clearForm()
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
                }
                setLoading(false)
        },
      });
    
      useEffect(()=>{
        setSelectedNavbar('posts')
        fetch(import.meta.env.VITE_POST_API, {credentials: 'include'})
        .then(res => res.json())
        .then(data => {
          if(data.success){
            setPosts(data.data)
            setActivePosts(data.data)
            setLoading(false)
          }
          else if(data.data.name === 'JsonWebTokenError'){
          Swal.fire({
            icon: 'error',
            title: 'يجب تسجيل الدخول أولا',
          })
          navigate('/login')
        }})  
      }, [setSelectedNavbar, navigate])

      useEffect(()=> {
        if(formik.values.title && formik.values.content && !formik.errors.title && !formik.errors.content && !loading){
          setDisableSubmit(false)
        } else {
          setDisableSubmit(true)
        }
      }, [formik.values, formik.errors, loading])


        if(loading){
          return <div className='flex justify-center items-center h-96'>
                    <Spinner animation="border" variant="primary" />
                  </div>
        }

  return (
    <div>
      <div className="md:container">
        <div className="bg-[#eee] p-1 flex flex-col lg:flex-row rounded-lg">

          <div className="col-12 col-lg-4 p-1 flex-col flex gap-1">
          <div>
      <InputGroup dir="ltr">
        <Button variant="outline-secondary" id="button-addon1">
          <IoSearch />
        </Button>
        <Form.Control
          onChange={(e)=> {
            setActivePosts(posts?.filter(post =>  post.title.toLowerCase().includes(e.target.value.toLowerCase()) 
                                            || post.content.toLowerCase().includes(e.target.value.toLowerCase())))
          }}
        />
      </InputGroup>
      </div>
            {!userData.user? <div className="hidden lg:block">
                                <Image src="https://lagnah.vercel.app/assets/posts.jpg" />
                              </div> 
                              : 
              userData.user.isAdmin? <><Button className={`bg-[#0c969c] hover:bg-[#031716] border-0 w-full ${editing && 'hidden'}`} style={{fontFamily: 'Cairo'}}
            onClick={()=>{setPosting(!posting)}}
            > {posting? 'رجوع' : 'إضافة منشور '} <MdOutlinePostAdd className="inline"/></Button>
            
            <div className={`${posting || editing ? 'block' : 'hidden'}`}>
        <form className="flex flex-wrap relative bg-white p-2 rounded-lg gap-y-3" onSubmit={formik.handleSubmit}>
          {editing && <FaArrowLeftLong className="absolute left-4" onClick={()=> setEditnig(false)} />}
            <div className='col-12 px-2'>
                <TextField
                id="title"
                name="title"
                label="عنوان المنشور"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                variant="standard"
                fullWidth
                InputLabelProps={{
                    style: {
                    left: 'auto'
                    },
                }}
                />
            </div>
            <div className='col-12 px-2'>

            <Form.Group className="mb-3">
              <Form.Label>محتوى المنشور</Form.Label>
              <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={formik.values.content} 
                  id='content'
                  name="content"
                  onChange={formik.handleChange} 
                  onBlur={formik.handleBlur} 
                  isInvalid={formik.touched.content && !!formik.errors.content}
                  isValid={formik.touched.content && !formik.errors.content}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.content}
              </Form.Control.Feedback>
            </Form.Group>
            </div>
            <div className="col-12">
            <input
              type="file"
              multiple
              accept='image/*' 
              onChange={handleImageChange}
              id='images'
            />
            </div>
            <div className="col-12 flex flex-wrap gap-2">
              {files.map(img => (
                <div key={img}>
                  <MdCancel onClick={() => setFiles(files.filter(file => file !== img))} className='cursor-pointer text-[#0c969c]'/>
                  <Image src={img} width={100} height={100} />
                </div>
              ))}
            </div>

            <div className='mx-auto col-6'>
                <Button type="submit" variant="success" disabled={disableSubmit} onClick={formik.handleSubmit} className="w-full">
                    {editing ? 'تعديل' : 'نشر'}
                </Button>
            </div>
        </form>
    </div></> : 
    <div className="hidden lg:block">
      <Image src="http://localhost:5173/assets/posts.jpg" />
    </div>
    }

          </div>
        
        <div className="bg-[#eee] flex flex-col gap-1 col-12 col-lg-8 ">
          {activePosts.map((post, index) =>
            {
            return (<div key={post._id} className="bg-white rounded-lg p-1 relative" ref={(el) => (ref.current[index] = el)}>
            {!userData.user? <></> : userData.user.isAdmin ? <>
              <BsThreeDotsVertical className='cursor-pointer absolute' onClick={(event) => handleClick(post._id, event)} />
      <Overlay
        show={activeOverlay === post._id}
        target={target}
        placement="left"
        container={ref.current[index]}
      >
        <Popover>
          <Popover.Body className='p-0 w-40'>
            <ListGroup>
              <ListGroup.Item className='bg-[#0c969c] text-white cursor-pointer' ><button onClick={() => editPost(post)}><MdEditNote className='inline ml-2'/> تعديل  </button></ListGroup.Item>
              <ListGroup.Item className='bg-red-400 text-white cursor-pointer'><button onClick={()=> deletepost(post._id)}><TiDeleteOutline className='inline ml-2 bg'
              /> حذف  </button></ListGroup.Item>
            </ListGroup>
          </Popover.Body>
        </Popover>
      </Overlay></> : <></>}
        <div><h2 style={{fontFamily: 'Noto Kufi Arabic', textAlign: 'center'}}> {post.title} </h2></div>
        <div><p style={{fontFamily: 'Cairo'}}> {post.content} </p></div>
        <div className='flex flex-wrap justify-center'>
          {post.images?.map((img, i) => (
            <div className='p-1' key={i}>
                <Image key={i} src={img.url}/>
            </div>
          ))}
        </div>
    </div>)})}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Posts