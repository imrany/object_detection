import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { FaChevronLeft } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { GlobalContext } from "../context";
import { FaAngellist } from "react-icons/fa6";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import Microphone from "../components/ui/Microphone.tsx";
import { textToSpeech } from "../components/utilities.ts";

export default function SearchPage(){
    const navigate=useNavigate()
    const { videoConstraints, API_URL, voiceInput, voiceCommands }=useContext(GlobalContext);
    const [isMuted,setIsMuted]=useState(true)
    const [results,setResults]=useState<any>(<></>)
    const [error,setError]=useState("")
    const [isLoading,setIsLoading]=useState(true)
    let capture:any=localStorage.getItem("capture")
    let query:any=localStorage.getItem("query")

    async function getResults(){
        try{
            let url=`${API_URL}/api/prompt`

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ prompt: `What is a ${query}` }),
                headers: {
                    'content-type': 'application/json',
                },
            });

            const parseRes = await response.json();
            if (parseRes.error) {
                setError(parseRes.error);
                setIsLoading(false)
            } else {
                let text=parseRes.text.replace(/<[^>]+>/g, '')
                setResults(text)
                setIsLoading(false)
            }
        }catch(error:any){
            setError(error.message)
            setIsLoading(false)
        }
    }

    function checkQueryAndCapture(){
        if(!localStorage.getItem("capture")||!localStorage.getItem("query")){
            navigate("/main")
        }
    }

    useEffect(()=>{ 
        if(voiceInput.length>0){
        console.log(voiceInput)
        if(voiceCommands.includes(voiceInput)){
            if(voiceInput==voiceCommands[0]){
                localStorage.setItem("audio","unmute")
                setIsMuted(false)
                textToSpeech(results)
                console.log("unmuted")
            }else if(voiceInput==voiceCommands[7]){
                localStorage.setItem("audio","unmute")
                setIsMuted(false)
                textToSpeech(results)
                console.log("unmuted")
            }else if(voiceInput==voiceCommands[3]){
                localStorage.setItem("audio","unmute")
                setIsMuted(false)
                console.log("unmuted")
            }else if(voiceInput==voiceCommands[2]){
                window.location.reload()
            }else if(voiceInput==voiceCommands[4]){
                localStorage.setItem("audio","mute")
                setIsMuted(true)
                console.log("muted")
            }else if(voiceInput==voiceCommands[6]){
                navigate(-1)
            }else{
                textToSpeech("You cannot use that prompt on this page.")
            }
        }else{
            textToSpeech("Please use")
            voiceCommands.map((command:string)=>{
                textToSpeech(command)
            })
            textToSpeech("to interact")
        }
    }else{
        window.speechSynthesis.cancel()
    }
        checkQueryAndCapture()
        getResults()
    },[])
    return(
        <>
            {isLoading&&isLoading?(
                <div style={{display:"flex",justifyContent:"center", background:"#14161a", alignItems:"center", height:"100vh"}}>
                    <p style={{fontSize:14, color:"white", textAlign:"center"}}>Searching, please wait...</p>
                </div>
            ):(
                <div className="flex flex-col text-white bg-[#14161a] min-h-screen">
                    <Microphone/>
                    <div className="fixed h-[0px] z-10 top-0 left-0 right-0">
                        <div className="flex bg-none text-white items-center justify-between m-[20px]">
                            <Link to="/main">
                                <FaChevronLeft className="w-[22px] h-[20px]"/>
                            </Link>
                            <p>Search</p>
                            <button>
                                <FiMoreHorizontal className="w-[22px] h-[22px]"/>
                            </button>
                        </div>
                    </div>
                    <div className="bg-[#2a2d33] rounded-b-[20px]">
                        <img src={capture} width={videoConstraints.width} height={480} className="h-[380px] object-cover rounded-b-[20px]"/>
                        <div className="flex items-center m-[15px] justify-between">
                            <div className="flex gap-2">
                                <FaAngellist className="w-[22px] h-[22px]"/>
                                <p className="capitalize">{query}</p>
                            </div>
                            {isMuted?(
                                <HiMiniSpeakerWave onClick={()=>{
                                    setIsMuted(false)
                                    
                                    // Create a new instance of SpeechSynthesisUtterance
                                    var speech = new SpeechSynthesisUtterance(results);
                                    // Set the voice, rate, pitch, and language if desired
                                    speech.lang = 'en-US'; // You can change the language
                                    speech.rate = 1; // Speed (default is 1, range: 0.1 to 10)
                                    speech.pitch = 1; // Pitch (default is 1, range: 0 to 2)
                                    // Speak the text
                                    window.speechSynthesis.speak(speech);
                                }} className="w-[22px] h-[22px] ml-auto"/>
                            ):(
                                <HiMiniSpeakerXMark onClick={()=>{
                                    setIsMuted(true)
                                    window.speechSynthesis.cancel()
                                }} className="w-[22px] h-[22px] ml-auto"/>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col m-[20px] text-sm">
                        {results?results:(<p className="text-center">{error}</p>)}
                    </div>
                </div>
            )}
        </>
    )
}
