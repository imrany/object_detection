import { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "../context";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { textToSpeech } from "../components/utilities.ts";
import Microphone from "../components/ui/Microphone.tsx";

export default function LandingPage(){
    const navigate=useNavigate();
    const { isLoading, voiceInput,voiceCommands }=useContext(GlobalContext);

    const heroSectionContent=[
        "Experts on Special needs and Vision Loss",
        "We assistant children with vision loss to learn and navigate their environment using artificial intelligence, voice recognition and definition, and image identification.",
        "We are an expert of 100 therapists involved in making this website possible to create awareness and services for special need cases.",
        "If you would like to start, say start"
    ]

    const middleSectionContent=[
        "The Impact of Vision Loss",
        "Vision loss is a serious case and needs more attension, so we've created a expert system that would try to assistance anyone with vision loss to identify common object around them by using their phone camera.",
        "With the ability to receive voice input and output using artificial intelligence."
    ]

    const footerSectionContent=[
        "Services",
        "If you would like to start, say start",
        "If you would like to contact us, say contact us"
    ]

    function readSection(contents:string[]){
        localStorage.setItem("audio","unmute")
        contents.map((content:string)=>{
            textToSpeech(content)
        })
    }

    useEffect(()=>{
        if(voiceInput.length>0){
            console.log(voiceInput)
            if(voiceCommands.includes(voiceInput)){
                if(voiceInput==voiceCommands[0]||voiceInput==voiceCommands[7]){
                    readSection(heroSectionContent)
                    readSection(middleSectionContent)
                }else if(voiceInput==voiceCommands[3]){
                    localStorage.setItem("audio","unmute")
                    console.log("unmuted")
                }else if(voiceInput==voiceCommands[2]){
                    window.location.reload()
                }else if(voiceInput==voiceCommands[4]){
                    localStorage.setItem("audio","mute")
                    console.log("muted")
                }else if(voiceInput==voiceCommands[5]){
                    if(isLoading){
                        textToSpeech("Please wait and try again later")
                    }else{
                        navigate("/main")
                    }
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
    },[voiceInput]);
    return (
        <div className="flex flex-col min-h-screen">
            <div>
                <div className="flex mx-3 my-4">
                    <Link to="/" className="font-semibold text-xl text-blue-400">Special needs experts</Link>
                    <button onClick={()=>{
                        const menu:any=document.querySelector('#menu')
                        menu.classList.toggle('none')
                    }} className="ml-auto">
                        <FiMenu className="w-[24px] h-[24px]"/>
                    </button>
                </div>
                <div id="menu" className="fixed none top-0 botton-0 left-0 rigth-0 z-10 border-b-[1px] border-gray-400 bg-white h-[25vh] w-screen">
                    <div className="flex gap-1 flex-col">
                        <button onClick={()=>{
                            const menu:any=document.querySelector('#menu')
                            menu.classList.toggle('none')
                        }}  className="ml-auto m-3 flex-grow border-b-[2px] border-blue-500">
                            <IoClose className="w-[30px] h-[30px]"/>
                        </button>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <button onClick={()=>{
                                    if(isLoading){
                                        localStorage.setItem("audio","unmute")
                                        textToSpeech("Please wait and try again later")
                                    }else{
                                        navigate("/main")
                                    }
                                }} className="p-4 capitalize active:text-blue-500">Get Started</button>
                            </li>
                            <li>
                                <a href="#contact_us" className="p-4 capitalize active:text-blue-500">Contact us</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div onDoubleClick={()=>readSection(heroSectionContent)} className="flex relative flex-col gap-6 items-center justify-center text-gray-100 h-[65vh] bg-[url('/images/support-the-africa-child.png')] bg-cover bg-no-repeat bg-center">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative text-2xl w-[80vw] font-bold text-center">
                    <p>{heroSectionContent[0]}</p>
                </div>
                <div className="relative w-[80vw] text-center">
                    <p>{heroSectionContent[1]}</p>
                    <p>{heroSectionContent[2]}</p>
                </div>
                <button onClick={()=>{
                    if(isLoading){
                        localStorage.setItem("audio","unmute")
                        textToSpeech("Please wait and try again later")
                    }else{
                        navigate("/main")
                    }
                }}  className="relative shadow-md h-[40px] w-[150px] rounded-[50px] bg-white hover:bg-blue-500 hover:text-white active:bg-blue-500 active:text-white flex items-center justify-center text-blue-500">Get Started</button>
            </div>
            <div onDoubleClick={()=>readSection(middleSectionContent)}  className="mx-3 my-10">
                <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold text-gray-800">{middleSectionContent[0]}</p>
                    <p className="text-sm">{middleSectionContent[1]}</p>
                    <p className="text-sm">{middleSectionContent[2]}</p>
                </div>
            </div>
            <footer onDoubleClick={()=>readSection(footerSectionContent)} className="px-4 h-[200px] py-6 bg-blue-800 text-white flex ">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold">{footerSectionContent[0]}</p>
                    <div className="text-sm flex flex-col gap-1">
                        <Link to="/main">Get Started</Link>
                        <a href="#contact_us">Contact Us</a>
                        <a href="mailto:imranmat254@gmail.com" target="_blank">Email</a>
                    </div>
                </div>
            </footer>
            <Microphone/>
        </div>
    )
}
