import './App.css'
import UserSignUp from './components/forms/UserSignUp'
import Home from './components/Home/Home'
import { Routes, Route } from 'react-router-dom'
import Posts from './components/Home/Posts'
import Dashboard from './components/Home/Dashboard/Dashboard'
import Contact from './components/Home/Contact'
import UserLogin from './components/forms/UserLogin'
import "@fontsource/cairo";
import "@fontsource/noto-kufi-arabic";
import Consumers from './components/Home/Dashboard/Consumer/Consumers'
import Safe from './components/Home/Dashboard/Safe'
import Users from './components/Home/Dashboard/Users'
import Transactions from './components/Home/Dashboard/Transactions/Transactions'
import AddTransaction from './components/Home/Dashboard/Transactions/AddTransaction'
// import ProtectedRoutes from './Utils/ProtectedRoutes'
import Main from './components/Home/Main'
import ProtectAdminRoutes from './Utils/ProtectAdminRoutes'
import Messages from './components/Home/Messages'



function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} >

          <Route path='/posts' element={ <Posts /> } />


          {/* <Route path='/posts' element={<ProtectedRoutes>
                                          <Posts />
                                        </ProtectedRoutes>} /> */}

          <Route index element={<Main />} />
            <Route path='/dashboard' element={<ProtectAdminRoutes>
                                                <Dashboard />
                                              </ProtectAdminRoutes>
              } >

              <Route path='consumers' element={<Consumers />} />

              <Route path='safe' element={<Safe />} />

              <Route path='transactions' element={<Transactions />} >
                <Route path='add' element={<AddTransaction />} />  
              </Route>


              <Route path='users' element={<Users />} />
            </Route>

          <Route path='/contact' element={ <Contact /> } />


          {/* <Route path='/contact' element={<ProtectedRoutes >
                                            <Contact />
                                          </ProtectedRoutes>
            } /> */}

          <Route path='/messages' element={<Messages />} />


          {/* <Route path='/messages' element={<ProtectAdminRoutes >
                                            <Messages />
                                          </ProtectAdminRoutes>
            } /> */}
                          

        </Route>
        <Route path='/register' element={<UserSignUp />} />
        <Route path='/login' element={<UserLogin />} />
      </Routes>
    </>
  )
}

export default App
