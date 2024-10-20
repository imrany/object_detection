import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context";

export default function LandingPage(){
    const navigate=useNavigate();
    const { isLoading, voiceInput,voiceCommands, recognition }=useContext(GlobalContext);

    useEffect(()=>{
        if(voiceInput.length>0){
            console.log(voiceInput)
        }else{
            //recognition.start()
            //window.speechSynthesis.cancel()
        }
    },[voiceInput]);
    return (
        <div className="flex flex-col h-screen bg-green-100" 
            onClick={()=>{
                recognition.start()
            }}
        >
            <p>This is the landing page</p>
        </div>
    )
}
