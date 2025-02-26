import { useState } from 'react'
import { useTimer } from "./hooks/useTimer"

export function App() {
  const { time, setTime, displayedTime, startTimer, stopTimer, reset, pomodoroCounter, isRunning, isInterval, setWorkTime, setRestTime } = useTimer()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  function handleCloseSettings() {
    setIsSettingsOpen(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleUpdateSettings(e: any) {
    e.preventDefault()
    const workTime = e.target.workTime.value
    const restTime = e.target.restTime.value
    setWorkTime(60 * workTime)
    setRestTime(60 * restTime)
    setTime(60 * workTime)
    handleCloseSettings()
  }

  return (
    <div className={`w-screen h-screen flex flex-col justify-center items-center ${isInterval ? 'bg-gray-800' : 'bg-gray-900'}`}>
      <h1 className="text-3xl text-white">Flowmodoro</h1>
      <h2 className='text-white'>{isInterval ? 'Rest time' : 'Work time!'}</h2>

      <div className="flex flex-col items-center gap-4">
        <p className="mt-4 text-white text-[10rem] font-semibold">{displayedTime(time)}</p>
        <p className="text-lg text-white font-semibold">#{pomodoroCounter}</p>
      </div>

      <div className="mt-8 flex gap-2">
        {
          isRunning ?
            <button className="bg-red-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={stopTimer}>Stop</button>
            :
            <button className="bg-green-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={startTimer}>Start</button>
          }

      </div>
      <div className='flex gap-4'>
        <button className="mt-8 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={reset}>reset</button>
      </div>
      {
        isSettingsOpen && (
          <section className='absolute bg-gray-700/70 inset-0 flex justify-center items-center'>
            <form onSubmit={handleUpdateSettings} className='min-w-[25rem] bg-white px-12 py-16 rounded-2xl shadow-xl'>
              <header className='flex justify-end'>
                <button className='text-red-600 hover:text-red-500 text-md px-2 py' onClick={handleCloseSettings}>close</button>
              </header>

              <div className='flex flex-col gap-2 mt-4'>
                <label htmlFor="workTime">Work</label>
                <input className='w-full px-4 py-2 border-2 border-black/50 shadow-sm' type="text" id="workTime" name='workTime' />
              </div>

              <div className='flex flex-col gap-2 mt-4 mb-4'>
                <label htmlFor="restTime">Rest</label>
                <input className='w-full px-4 py-2 border-2 border-black/50 shadow-sm' type="text" id="restTime" name="restTime" />
              </div>
              <button className='w-full justify-center bg-green-600 py-4 rounded-lg text-white font-bold' type='submit'>Confirm</button>
            </form>
          </section>
        )
      } 
    </div>
  )
}
