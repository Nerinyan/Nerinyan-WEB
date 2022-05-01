import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Navbar, Searchbar, MusicPlayer } from './Components'
import { Beatmaps, TsetD } from './Pages'

function App() {
    return(
    <BrowserRouter>
        <Navbar/>
        <div className="container">
            <Searchbar/>
            <Routes>
                <Route path="/" element={<Navigate to="/main" />}/>
                <Route path="/main" element={<Beatmaps />}/>
                <Route path="/2" element={<TsetD />}/>
            </Routes>
        </div>
        <MusicPlayer/>
    </BrowserRouter>
  );
}

export default App