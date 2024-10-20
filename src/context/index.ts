import { createContext } from 'react'

type ContextType={
    videoConstraints:{
        height?:number,
        width?:number,
        facingMode:string
    },
    changeVideoConstraints:any,
    API_URL:string,
    net:any,
    isLoading:boolean,
    voiceInput:string,
    voiceCommands:string[],
    recognition:any
}

export const GlobalContext=createContext<ContextType>({
    videoConstraints:{
        width: screen.width-400,
        height: screen.height,
        facingMode: "user"
    },
    changeVideoConstraints:()=>{},
    recognition:{},
    API_URL:"",
    isLoading:true,
    net:null,
    voiceInput:"",
    voiceCommands:["speak","search","reload","unmute","mute","start"]
})
