import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import { GlobalContext } from "./context";

export default function App(){
    const API_URL=`http://127.0.0.1:5000`
    const [videoConstraints, setVideoConstraints]=useState<any>({
        width: screen.width-400,
        height: 720,
        facingMode: "user"
    })

    window.onresize=function(){
        screen.width>1080?"":setVideoConstraints({height:screen.height, width:screen.width, facingMode:"environment"})
    }

    useEffect(()=>{
        screen.width>1080?"":setVideoConstraints({height:screen.height, width:screen.width, facingMode:"environment"})
    },[screen.width])
    return(
        <BrowserRouter>
            <GlobalContext.Provider value={{ videoConstraints, API_URL }}>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/search" element={<SearchPage/>}/>
                </Routes>
            </GlobalContext.Provider>
        </BrowserRouter>
    )
}
