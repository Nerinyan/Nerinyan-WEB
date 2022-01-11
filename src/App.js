import React from "react";
import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom";
import { Navbar } from './Components';
import { Users, TsetD } from './Pages';

function App() {
  return(
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/main"/>}/>
        <Route path="/main" element={<Users />}/>
        <Route path="/test" element={<TsetD />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;