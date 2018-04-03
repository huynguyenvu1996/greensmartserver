module.exports.webclient = (req, res) => {
  console.log('log', __dirname)
  res.sendFile(__dirname + '/../public/index.html')
}