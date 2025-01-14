import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({children, isAllowed}) =>{
    if(!isAllowed){
        return <Navigate to="/"/>
    }

    return children
}