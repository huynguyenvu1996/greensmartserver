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
  $('form').submit(function () {
    const input = $('#m')
    socket.emit('event_rain_sensor', input.val())
    input.val('')
    return false
  })
  socket.on('event_weather_sensor', function (msg) {
    //$('#messages').append($('<li>').text(JSON.stringify(msg)))
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
}