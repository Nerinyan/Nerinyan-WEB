import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainPage, Beatmaps, Download, Info, NotFound } from './Pages'

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}/>
                <Route path="/main" element={<Beatmaps dev={false}/>}/>
                <Route path="/browse" element={<Beatmaps dev={false}/>}/>
                <Route path="/dev" element={<Beatmaps dev={true}/>}/>
                <Route path="/d/:beatmapsetid" element={<Download />}/>
                <Route path="/info" element={<Info />}/>

                <Route path="*" element={<NotFound />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App