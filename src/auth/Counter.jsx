import React, { useState } from 'react'


let  timer = null;

const Counter = () => {
  
const [count , setcount] = useState(0);
const [running , setrunning] = useState(false);


 const handleclick =()=>{
     timer = setInterval(()=>{
     setcount((pre)=> pre +1)
    },1000)

}
 const handlestop  =()=>{
     clearInterval(timer)
}
 const handlereset  =()=>{
     setcount(0)
    
}




  return (
    <>
    <h1>{count}</h1>
    <button onClick={handleclick} >start</button>
    <button onClick={handlestop}>stop</button>
    <button onClick={handlereset} >reset</button>
    
    
    </>
  )
}

export default Counter
