import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { FaChevronLeft } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { GlobalContext } from "../context";
import { FaAngellist } from "react-icons/fa6";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";

export default function SearchPage(){
    const navigate=useNavigate()
    const { videoConstraints, API_URL }=useContext(GlobalContext);
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
        checkQueryAndCapture()
        window.speechSynthesis.cancel()
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
