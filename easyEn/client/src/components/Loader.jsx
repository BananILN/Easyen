import {ThreeCircles} from 'react-loader-spinner'
export  default function Loader (){
    return (<ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#217bcf"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />)
}