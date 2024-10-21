 import { CiMicrophoneOn } from "react-icons/ci";
import { useContext } from "react";
import { GlobalContext } from "../../context";

export default function Microphone(){
    const { recognition }=useContext(GlobalContext);
    return(
        <button onClick={()=>{
            window.speechSynthesis.cancel()
            recognition.start()
        }} className="fixed right-5 bottom-10 z-30 shadow-md bg-white rounded-[50px]">
            <div className="flex items-center justify-center h-[50px] w-[50px]">
                <CiMicrophoneOn className="w-[24px] h-[24px]"/>
            </div>
        </button>
    )
}
