const app = require('http').createServer(handler)
const fs = require('fs')
const port = process.env.PORT || 3000
const io = require('socket.io')(app)

function handler (req, res) {
  const page = req.url === '/debugger' ? '/client/debugger.html' : '/client/index.html'
  fs.readFile(__dirname + page,
  function (err, data) {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading page ', page)
    }

    res.writeHead(200)
    res.end(data)
  })
}

app.listen(port)
console.log(`pulse-web server running on ${port}`)