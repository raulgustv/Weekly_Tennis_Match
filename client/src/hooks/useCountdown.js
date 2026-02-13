import { useEffect, useState } from "react"


const useCountdown = ({duration = 120000, onFinish}) =>{
    const [remaining, setRemaining] = useState(duration);
    const [active, setActive] = useState(false)

    const start = () =>{
        setRemaining(duration);
        setActive(true)
    }

    useEffect(() => {
        if(!active) return

        const interval = setInterval(() => {
            setRemaining((prev) => {
                if(prev <= 1000){
                    clearInterval(interval);
                    setActive(false)
                    onFinish?.();

                    return 0;
                }

                return prev - 1000
            })
        }, 1000);

        return () => clearInterval(interval)
    }, [active, duration, onFinish])

    return {active, remaining, start}

} 

export default useCountdown