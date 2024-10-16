import { createContext } from 'react'

type ContextType={
    videoConstraints:{
        height?:number,
        width?:number,
        facingMode:string
    },
    changeVideoConstraints:any,
    API_URL:string
}

export const GlobalContext=createContext<ContextType>({
    videoConstraints:{
        width: screen.width-400,
        height: screen.height,
        facingMode: "user"
    },
    changeVideoConstraints:()=>{},
    API_URL:""
})
