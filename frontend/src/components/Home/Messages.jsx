import { useEffect, useState } from "react"
import { MESSAGE_API } from "../../APIS"
import { Container, Spinner, Table } from "react-bootstrap"

const Messages = () => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(MESSAGE_API, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setMessages(data.data)
            setLoading(false)
        })
    }, [])

    if(loading){
        return <div className="flex justify-center items-center h-96">
            <Spinner animation="border" variant="primary" />
        </div>
    }
    
  return (
    <div>
        <Container className="p-4">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الرسالة</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((message, index) => (
                        <tr key={message._id}>
                            <td>{index + 1}</td>
                            <td>{message.sender.name}</td>
                            <td>{message.sender.email}</td>
                            <td>{message.content}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    </div>
  )
}

export default Messages