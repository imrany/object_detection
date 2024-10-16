import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotSupported from "./pages/NotSupported.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import { GlobalContext } from "./context";

export default function App(){
    const API_URL=`https://gemmie.onrender.com`
    const [isSupported,setIsSupported]=useState(true)
    const [isFacingModeUser,setIsFacingModeUser]=useState(false)
    const [videoConstraints, setVideoConstraints]=useState<any>({
        width: screen.width-400,
        height: 720,
        facingMode: "user"
    })

    window.onresize=function(){
        screen.width>1080?setIsSupported(false):setVideoConstraints({height:720, width:screen.width, facingMode:"environment"})
    }
     
    function changeVideoConstraints(){
        if(isFacingModeUser===false){
            setIsFacingModeUser(true)
            setVideoConstraints({height:720, width:screen.width, facingMode:"user"})
        }else{
            setIsFacingModeUser(false)
            setVideoConstraints({height:720, width:screen.width, facingMode:"environment"})
        }
    }

    useEffect(()=>{
        screen.width>1080?setIsSupported(false):setVideoConstraints({height:720, width:screen.width, facingMode:"environment"})
    },[screen.width])
    return(
        <>
            {isSupported?(
                <BrowserRouter>
                    <GlobalContext.Provider value={{ videoConstraints, changeVideoConstraints, API_URL }}>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/search" element={<SearchPage/>}/>
                        </Routes>
                    </GlobalContext.Provider>
                </BrowserRouter>
            ):(
                <NotSupported/>
            )}
        </>
    )
}
