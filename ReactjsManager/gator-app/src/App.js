import Login from './Login';
import Home from "./Home";

import { Routes, Route } from "react-router-dom";


export default function App() {

  return(
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}