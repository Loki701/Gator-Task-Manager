import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import AddEvent from "./components/AddEvent";
//import { ProtectedRoute } from './context/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/AddEvent" element={<AddEvent />} />
    </Routes>
  );
}

{/* <Route 
      path="/Home" 
      element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
      } />*/}