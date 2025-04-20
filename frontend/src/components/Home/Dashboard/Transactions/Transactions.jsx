import { Empty, Image, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SetSelected } from "../../../../Contexts/SetSelectedContext";
import Swal from "sweetalert2";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { TbDeviceIpadDollar } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";

const Transactions = () => {

    const {setSelectedDashboard} = useContext(SetSelected)

    const [transactions, setTransactions] = useState([])
    const [activeTransactions, setActiveTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
  
    useEffect(()=>{
      setSelectedDashboard('transactions')

      fetch(import.meta.env.VITE_TRANSACTION_API, {credentials: 'include'})
      .then(res => res.json())
      .then(data => {
          if(data.success){
            setTransactions(data.data)
            setActiveTransactions(data.data)
            setLoading(false)
          } else if(data.data.name === 'JsonWebTokenError'){
                    Swal.fire({
                      icon: 'error',
                      title: 'يجب تسجيل الدخول أولا',
                    })
                    navigate('/login')
                  }
      })
      
    }, [setSelectedDashboard, navigate])

    if(loading){
      return <div className="flex justify-center items-center h-96">
                <Spinner animation="border" variant="primary" />
              </div>
    }

  return (
  <div>
    <div className="flex px-3 py-2 bg-white mb-3 align-content-center">
      <div className="hover:text-[#0c969c] text-2xl cursor-pointer" onClick={()=> navigate('add')}> <TbDeviceIpadDollar className="inline ml-3" /></div>
      <div>
          <InputGroup dir="ltr">
        <Button variant="outline-secondary" id="button-addon3">
          <IoSearch />
        </Button>
        <Form.Control
          onChange={(e)=> {
            setActiveTransactions(transactions?.filter(transaction => transaction.title.toLowerCase().includes(e.target.value.toLowerCase()) 
                                                        || transaction.content.toLowerCase().includes(e.target.value.toLowerCase())))
          }}
        />
      </InputGroup>
      </div>
    </div>
    <div>
      <Outlet />
    </div>
    <div className="flex flex-wrap">
      {transactions.length === 0 ? 
        <Empty
      className="mx-auto"
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={
        <Typography.Text>
          لا توجد تحويلات حتى الآن!
        </Typography.Text>
      }
    >
      <Button variant="primary" onClick={()=> {navigate('add')}}>أضف الآن</Button>
    </Empty>
    :<>
      {activeTransactions?.map((transaction, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-4 px-2 pb-2">
        <div className="bg-white rounded-lg p-2 hover:scale-105" style={{fontFamily: 'Cairo', transitionDuration: '0.5s'}}>
          <div className="flex justify-between p-2">
            <span className={`${transaction.type === 'incoming'? 'bg-[#0c969c]' : 'bg-[#031716]'} text-white rounded-full py-1 px-3`}>{transaction.type === 'incoming' ? 'إيداع' : 'صرف'}</span>
            <span>{new Date(transaction.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
          <hr />
          <div className="flex justify-center align-items-center p-12">
            <span className="text-white rounded-full py-2 col-9 col-md-10 text-center" style={{backgroundImage: 'linear-gradient(135deg, #031716, #0c969c)'}}>
                            {transaction.amount}{transaction.isFinance? "ج م": ` كجم ${transaction.seedsType || 'لحوم' }  `}</span>
          </div>
          <hr />
          <div className="p-3">
            {transaction.type === 'outgoing'? <>
              الهدف: 
              <span className="font-bold p-3">
              {transaction.targetDescription}
              </span>
            </> : <>
              المصدر:
            <span className="font-bold p-3">
              {transaction.depositeSource}
            </span>
            </>}
          </div>
          <hr />
            {transaction.type === 'outgoing' && 
              <div className="m-2">
                <h1 className="text-center p-2 font-bold">المستفيدين</h1>
                <table className="col-12" >
                      <thead>
                        <tr>
                          <th className="border p-2 text-center">الاسم</th>
                          <th className="border p-2 text-center">الرقم القومى</th>
                          <th className="border p-2 text-center">الحصة</th>
                        </tr>
                      </thead>
                      <tbody>
                {transaction.consumers.map((consumer, i) => {
                  if (i >= transaction.consumers.length/2){
                    return(<></>)
                  }
                  return(
                        <tr key={i}>
                          <td className="border text-center text-nowrap">{consumer.consumer.name}</td>
                          <td className="border text-center text-nowrap">{consumer.consumer.IDNumber}</td>
                          <td className="p-2 border text-center text-nowrap">{consumer.consumerShare}</td>
                        </tr>
                )})}
                </tbody>
              </table>
              <hr />
            </div>
            }
          <div className="flex flex-wrap p-2 gap-3">
            {transaction.images?.map((image, i) => (
              <div key={i} className="col-6">
                <Image src={image.url}/>
              </div>
            ))}
          </div>
        </div>
        </div>
      ))}</>}
    </div>
  </div>  
  )
}

export default Transactions