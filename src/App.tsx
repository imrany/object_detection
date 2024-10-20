import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotSupported from "./pages/NotSupported.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { GlobalContext } from "./context";

export default function App(){
    const API_URL=`https://gemmie.onrender.com`
    const [net, setNet]=useState<any>(null)
    const [isLoading, setIsLoading]=useState(true)
    const [isSupported,setIsSupported]=useState(true)
    const [voiceInput,setVoiceInput]=useState("")
    const [isFacingModeUser,setIsFacingModeUser]=useState(false)
    const [videoConstraints, setVideoConstraints]=useState<any>({
        width: screen.width-400,
        height: 720,
        facingMode: "user"
    })
    const voiceCommands=["speak","search","reload","unmute","mute","start"]

    // Main function
    const runCoco = async () => {
        try{
            const $net = await cocossd.load();
            console.log("cocossd model loaded.");
            setIsLoading(false)
            setNet($net)
        }catch(error:any){
            setIsLoading(false)
            setError(error.message)
        }
    };

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

    async function speechToText(){
        try{
            var speech = true; 
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
  
            const recognition = new SpeechRecognition(); 
            recognition.interimResults = true; 
  
            recognition.addEventListener('result', e => { 
                const transcript = Array.from(e.results) 
                    .map(result => result[0]) 
                    .map(result => result.transcript) 
                    .join('') 
  
                setVoiceInput(transcript); 
            }); 
          
            if (speech == true) { 
                recognition.start(); 
                recognition.addEventListener('end', recognition.start); 
            } 
        }catch(error:any){
            console.log(error.message)
        }
    }

    useEffect(()=>{
        runCoco()
        speechToText()
        screen.width>1080?setIsSupported(false):setVideoConstraints({height:720, width:screen.width, facingMode:"environment"})
    },[screen.width])
    return(
        <>
            {isSupported?(
                <BrowserRouter>
                    <GlobalContext.Provider value={{ videoConstraints, changeVideoConstraints, API_URL, voiceCommands, isLoading, net, voiceInput }}>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/main" element={<MainPage/>}/>
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
