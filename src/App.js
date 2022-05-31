import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Beatmaps, Download } from './Pages'

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/main" />}/>
                <Route path="/main" element={<Beatmaps />}/>
                <Route path="/d/:beatmapsetid" element={<Download />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App