import { Navigate } from "react-router"

export const ProtectedRoute = ({children, isAllowed}) =>{
    if(!isAllowed){
        return <Navigate to="/"/>
    }

    return children
}