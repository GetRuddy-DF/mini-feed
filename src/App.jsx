import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";



export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />}/>
      <Route path="/login" element={<Login/>} />
      <Route path="register" element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}