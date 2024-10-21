import { useRef, useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "../context";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { textToSpeech } from "../components/utilities.ts";

export default function LandingPage(){
    const navigate=useNavigate();
    const { isLoading, voiceInput,voiceCommands, recognition }=useContext(GlobalContext);

    const heroSectionContent=[
        "Experts on Special needs and Vision Loss",
        "We assistant children with vision loss to learn and navigate their environment using artificial intelligence, voice recognition and definition, and image identification.",
        "We are an expert of 100 therapists involved in making this website possible to create awareness and services for special need cases.",
        "If you would like to start, say start"
    ]

    const middleSectionContent=[
        "The Impact of Vision Loss",
        "Vision loss is a serious case and needs more attension, so we've created a expert system that would try to assistance anyone with vision loss to identify common object around them by using their phone camera.",
        "With the ability to receive voice input and output using artificical intelligence."
    ]

    const footerSectionContent=[
        "Services",
        "If you would like to start, say start",
        "If you would like to contact, say contact us"
    ]

    useEffect(()=>{
        if(voiceInput.length>0){
            console.log(voiceInput)
        }else{
            //recognition.start()
            //window.speechSynthesis.cancel()
        }
    },[voiceInput]);
    return (
        <div className="flex flex-col min-h-screen" 
            //onClick={()=>{
              //  recognition.start()
            //}}
        >
            <div>
                <div className="flex mx-3 my-4">
                    <Link to="/" className="font-semibold text-xl text-blue-400">Special needs experts</Link>
                    <button onClick={()=>{
                        const menu=document.querySelector('#menu')
                        menu.classList.toggle('none')
                    }} className="ml-auto">
                        <FiMenu className="w-[24px] h-[24px]"/>
                    </button>
                </div>
                <div id="menu" className="fixed none top-0 botton-0 left-0 rigth-0 z-10 border-b-[1px] border-gray-400 bg-white h-[22vh] w-screen">
                    <div className="flex gap-1 flex-col">
                        <button onClick={()=>{
                            const menu=document.querySelector('#menu')
                            menu.classList.toggle('none')
                        }}  className="ml-auto m-3 flex-grow border-b-[2px] border-blue-500">
                            <IoClose className="w-[30px] h-[30px]"/>
                        </button>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link to="/main" className="p-4 capitalize active:text-blue-500">Get Started</Link>
                            </li>
                            <li>
                                <a href="#contact_us" className="p-4 capitalize active:text-blue-500">Contact us</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div onDoubleClick={()=>{
                localStorage.setItem("audio","unmute")
                heroSectionContent.map((content:string)=>{
                    textToSpeech(content)
                })
            }} className="flex relative flex-col gap-6 items-center justify-center text-gray-100 h-[65vh] bg-[url('/images/support-the-africa-child.png')] bg-cover bg-no-repeat bg-center">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative text-2xl w-[80vw] font-bold text-center">
                    <p>{heroSectionContent[0]}</p>
                </div>
                <div className="relative w-[80vw] text-center">
                    <p>{heroSectionContent[1]}</p>
                    <p>{heroSectionContent[2]}</p>
                </div>
                <Link to="/main" className="relative shadow-md h-[40px] w-[150px] rounded-[50px] bg-white flex items-center justify-center text-blue-500">Get Started</Link>
            </div>
            <div onDoubleClick={()=>{
                localStorage.setItem("audio","unmute")
                middleSectionContent.map((content:string)=>{
                    textToSpeech(content)
                })
            }}  className="mx-3 my-10">
                <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold text-gray-800">{middleSectionContent[0]}</p>
                    <p className="text-sm">{middleSectionContent[1]}</p>
                    <p className="text-sm">{middleSectionContent[2]}</p>
                </div>
            </div>
            <footer onDoubleClick={()=>{
                localStorage.setItem("audio","unmute")
                footerSectionContent.map((content:string)=>{
                    textToSpeech(content)
                })
            }} className="px-4 py-6 bg-blue-500 text-white flex ">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold">{footerSectionContent[0]}</p>
                    <div className="text-sm flex flex-col gap-1">
                        <Link to="/main">Get Started</Link>
                        <a href="#contact_us">Contact Us</a>
                        <a href="mailto:imranmat254@gmail.com" target="_blank">Email</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
