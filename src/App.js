import React from "react"
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom"
import { Navbar, MusicPlayer } from './Components'
import { Beatmaps, TsetD } from './Pages'

function App() {
    sessionStorage.setItem('downloadServer', 0)

    return(
    <BrowserRouter>
        <Navbar />
        <div className="container">
            <Routes>
                <Route path="/" element={<Navigate to="/main"/>}/>
                <Route path="/main" element={<Beatmaps />}/>
                <Route path="/2" element={<TsetD />}/>
            </Routes>
        </div>
        <MusicPlayer />
    </BrowserRouter>
  );
}

export default App