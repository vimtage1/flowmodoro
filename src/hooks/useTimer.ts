import { useState, useRef, useEffect } from 'react'
import { formatToTwoDigits } from "../utils/formatToTwoDigits"

// const WORK_TIME = 60 * 50 // time in minutes
// const REST_TIME = 60 * 10 // time in minutes

export function useTimer() {
    const [workTime, setWorkTime] = useState(60 * 50)
    const [restTime, setRestTime] = useState(60 * 10)

    const [isRunning, setIsRunning] = useState(false)
    const timerWorkerRef = useRef<Worker | null>(null)

    const [isInterval, setIsInterval] = useState(false)
    const [time, setTime] = useState(isInterval ? restTime : workTime)

    const [pomodoroCounter, setPomodoroCounter] = useState(0)

    const audio = new Audio('./src/assets/sounds/Alarm09.mp4')

    const displayedTime = (time: number) => `${formatToTwoDigits(Math.trunc(time / 60))}:${(formatToTwoDigits(time % 60))}`

    function reset() {
        setTime(workTime)
        document.title = displayedTime(workTime)
    }

    function completWork() {
        setIsInterval(true)
        setIsRunning(false)
        setTime(restTime)
    }

    function completeRest() {
        setPomodoroCounter(prev => prev + 1)
        setIsInterval(false)
        setIsRunning(false)
        setTime(workTime)
    }

    function skipTime() {
        stopTimer()
        if(isInterval) completeRest()
        else completWork()
    }

    function startTimer() {
        timerWorkerRef.current?.postMessage({ type: 'start', payload: {
            time,
            isInterval
        }})
        setIsRunning(true)
    }

    function stopTimer() {
        timerWorkerRef.current?.postMessage({ type: 'stop' })
        setIsRunning(false)
    }

    useEffect(() => {
        timerWorkerRef.current = new Worker('./TimerWorker.js')

        timerWorkerRef.current.onmessage = function (e: MessageEvent) {
            const { type, time } = e.data

            switch (type) {
                case 'tick':
                    setTime(time)
                    document.title = displayedTime(time)
                    break
                case 'complete work time':
                    completWork()
                    audio.play()
                    break
                case 'complete rest time':
                    completeRest()
                    audio.play()
                    break
                default:
                    break
            }
        }

        return () => {
            timerWorkerRef.current?.terminate()
        }
    }, [workTime, restTime])

    return {
        time,
        setTime,
        reset,
        startTimer,
        stopTimer,
        displayedTime,
        pomodoroCounter,
        isRunning,
        isInterval,
        skipTime,
        setWorkTime,
        setRestTime
    }

}
