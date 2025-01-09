import { useState } from 'react'
import {Route, Routes} from "react-router"
import './App.css'
import HomePage from './pages/HomePage'


function App() {
  const [count, setCount] = useState(0)

  return <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route/>
      <Route/>
      <Route/>
      <Route/>
      <Route/>

   </Routes>
  
}

export default App
