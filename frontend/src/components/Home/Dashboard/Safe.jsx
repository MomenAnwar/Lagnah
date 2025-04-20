import { useContext, useEffect, useState } from "react"
import { SetSelected } from "../../../Contexts/SetSelectedContext"
import { TbMoneybag } from "react-icons/tb";
import { FaSeedling } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Spinner, Table } from "react-bootstrap";

const Safe = () => {

    const {setSelectedDashboard} = useContext(SetSelected)
    const navigate = useNavigate()

    const [safe, setsafe] = useState([])
    const [loading, setLoading] = useState(true) 
  
    useEffect(()=>{
      setSelectedDashboard('safe')
      fetch(import.meta.env.VITE_FINANCE_API, {credentials: 'include'})
      .then(res => res.json())
      .then(data => {
        if(data.success){
          setsafe(data.data)
          setLoading(false)
        } else if(data.data.name === 'JsonWebTokenError'){
          Swal.fire({
            icon: 'error',
            title: 'انتهت مدة الجلسة، من فضلك قم بتسجيل الدخول مرة أخرى',
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
    <div className="flex px-2 flex-wrap text-center">
      <div className="col-12 col-md-6 px-2 mb-3">
        <div className="bg-white rounded-lg p-2 text-xl">
          <h1 className=" p-2"> <TbMoneybag className="inline"/> النقدية </h1>
          <hr />
          <div className="flex flex-col gap-y-2 p-5">
            <h1><strong className="text-3xl">{safe[0]?.totalFinance}</strong> جنيه</h1>
          </div>

        </div>
      </div>
      <div className="col-12 col-md-6 px-2 mb-3">
        <div className="bg-white rounded-lg p-2 text-xl">
          <h1 className=" p-2"> <TbMoneybag className="inline"/> اللحوم </h1>
          <hr />
          <div className="flex flex-col gap-y-2 p-5">
            <h1><strong className="text-3xl">{safe[0]?.meats}</strong> كجم</h1>
          </div>

        </div>
      </div>
      <div className="col-12 col-md-6 px-2 mb-3">
        <div className="bg-white rounded-lg p-2 text-xl">
          <h1 className=" p-2"> <FaSeedling className="inline"/> الزروع </h1>
          <hr />
          <div className="overflow-auto" style={{maxHeight: '300px'}}>
            <Table className="" striped bordered hover>
              <thead>
              <tr>
                <td>الزرعة</td>
                <td>الكمية</td>
              </tr>
              </thead>
              <tbody>
              {safe[0]?.seeds.map((seed, index) => (
                <tr key={index}>
                  <td>{seed.type}</td>
                  <td>{seed.amount}</td>
                </tr>
              ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Safe