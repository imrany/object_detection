import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import NotSupported from "./pages/NotSupported.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { GlobalContext } from "./context";
import { textToSpeech } from "./components/utilities.ts"

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
    const voiceCommands=["SPEAK","SEARCH","RELOAD","UNMUTE","MUTE","START", "BACK"]

    // Main function
    const runCoco = async () => {
        try{
            const $net = await cocossd.load();
            console.log("cocossd model loaded.");
            setIsLoading(false)
            setNet($net)
        }catch(error:any){
            setIsLoading(false)
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

    let recognition:any = window.SpeechRecognition ? window.SpeechRecognition : window.webkitSpeechRecognition; 
    if(recognition){
        recognition = new recognition();   
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Ready to listen")
        }

        recognition.addEventListener('result', (e:any) => { 
            /*const transcript = Array.from(e.results) 
                .map(result => result[0]) 
                .map(result => result.transcript) 
                .join('') 
             */    
            const result=e.results
            const transcript=result[result.length-1][result[0].length-1].transcript
            setVoiceInput(transcript.toUpperCase()); 
        }); 
          
        //if (speech) { 
            //recognition.start(); 
          //  setInterval(()=>{
            //    recognition.addEventListener('end', recognition.start)
            //},10); 
        //} 

        recognition.onend = ()=> {
            console.log("Speech recognition ended")
        }

        recognition.onerror =(e:any)=>{
            console.error(e.error)
        }
    }else {
        console.error('Speech recognition not supported');
    }

    useEffect(()=>{
        runCoco()
        screen.width>1080?setIsSupported(false):setVideoConstraints({height:720, width:screen.width, facingMode:"environment"})
    },[screen.width])
    return(
        <>
            {isSupported?(
                <BrowserRouter>
                    <GlobalContext.Provider value={{ videoConstraints, changeVideoConstraints, API_URL, recognition, voiceCommands, isLoading, net, voiceInput }}>
                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
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
