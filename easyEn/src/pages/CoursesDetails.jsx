import { useEffect } from "react"
import { useParams } from "react-router"

export function CoursesDetails(){

    const {id} = useParams()

    useEffect(()=>{
        
    },[id])

    return(
        <div> details</div>
    )
}