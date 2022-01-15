import React from "react"
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom"
import { Navbar } from './Components'
import { Beatmaps, TsetD } from './Pages'

function App() {
  return(
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/main"/>}/>
          <Route path="/main" element={<Beatmaps />}/>
          <Route path="/test" element={<TsetD />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App