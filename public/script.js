window.onload = function () {
  const dpsHumidity = [] // dataPoints
  const chartHumidity = new CanvasJS.Chart('chartHumidity', {
    title: {
      text: 'Humidity',
    },
    axisY: {
      includeZero: false,
    },
    axisX: {
      interval: 2,
    },
    data: [
      {
        type: 'line',
        lineThickness: 5,
        dataPoints: dpsHumidity,
      }],
  })
  const dpsTemperature = []
  const chartTemperature = new CanvasJS.Chart('chartTemperature', {
    title: {
      text: 'Temperature',
    },
    axisY: {
      includeZero: false,
    },
    axisX: {
      interval: 2,
    },
    data: [
      {
        type: 'spline',
        lineColor: 'red',
        lineThickness: 5,
        dataPoints: dpsTemperature,
      }],
  })
  chartHumidity.render()
  chartTemperature.render()
  let xVal = 0
  const dataLength = 20 // number of dataPoints visible at any point
  const socket = io()
  socket.on('event_weather_sensor', (msg) => {
    //$('#messages').append($('<li>').text(JSON.stringify(msg)))
    console.log('log display', msg)
    dpsHumidity.push({
      x: xVal,
      y: msg.humidity,
    })
    dpsTemperature.push({
      x: xVal,
      y: msg.temperature,
    })
    xVal = xVal + 2
    if (dpsHumidity.length > dataLength) {
      dpsHumidity.shift()
      dpsTemperature.shift()
    }
    chartHumidity.render()
    chartTemperature.render()
  })
  const weathers = {
    temperature: 25,
    humidity: 40,
    rain: 0,
  }
  setInterval(() => {
    socket.emit('event_weather_sensor', weathers)
    weathers.temperature++
    weathers.humidity++

    console.log('log', weathers)
  }, 2000);
  $('form').submit(() => {
    const input = $('#m')
    //socket.emit('event_rain_sensor', input.val())
    input.val('')
    return false
  })
  $('#btn_rain').on('click', () => {
    console.log('log', 'click-button')
    weathers.rain = 1 - weathers.rain
  })
}