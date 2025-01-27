import { Outlet } from 'react-router-dom'
import Header from '../ui/Navbar/Navbar'

const Home = () => {

  return (
    <div>
        <Header />
        <Outlet />
    </div>
  )
}

export default Home