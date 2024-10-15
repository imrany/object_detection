import { createContext } from 'react'

type ContextType={
    videoConstraints:{
        height?:number,
        width?:number,
        facingMode:string
    },
    API_URL:string
}

export const GlobalContext=createContext<ContextType>({
    videoConstraints:{
        width: screen.width-400,
        height: screen.height,
        facingMode: "user"
    },
    API_URL:""
})
