
let time = 0;
let isRunning = false;
let timerInterval = 0

function tick() {
  postMessage({ type: 'tick', time: ++time });
}

function timer(isInterval) {
  if (isRunning) {
    timerInterval = setInterval(() => {
      tick()
      if (time <= 0) {
        clearInterval(timerInterval);
        if(isInterval) 
          postMessage({ type: 'complete rest time' })
        else
          postMessage({ type: 'complete work time' });
      }
    }, 1000);
  }
}

onmessage = function (e) {
  const { type, payload } = e.data 
  switch (type) {
    case 'start':
      time = payload.time;
      isRunning = true;
      timer(payload.isInterval);
      break;
    case 'stop':
      clearInterval(timerInterval);
      isRunning = false;
      break;
    default:
      break;
  }
};
