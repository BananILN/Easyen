import { useState } from 'react'
import {Route, Routes} from "react-router"
import './App.css'
import HomePage from './pages/HomePage'
import Courses from './pages/Courses'
import Statistic from './pages/Statistic'
import Profile from './pages/Profile'
import ErrorPage from './pages/ErrorPage'
import { BaseLayout } from './components/BaseLayout'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BaseLayout>
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/profile" element={<Profile/>}  />
          <Route path='/statistic' element={<Statistic/>} />
          <Route paht="*" element={<ErrorPage errorCode ={404} />}  />
          <Route/>
      </Routes>
   </BaseLayout>
  );
}

export default App
