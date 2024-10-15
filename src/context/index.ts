import { createContext } from 'react'

type ContextType={
    videoConstraints:{
        height?:number,
        weigth?:number,
        facingMode:string
    },
    API_URL:string
}

export const GlobalContext=createContext<ContextType>({
    videoConstraints:{
        /*width: 1280,*/
        height: 720,
        facingMode: "user"
    },
    API_URL:""
})
