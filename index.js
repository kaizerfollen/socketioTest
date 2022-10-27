const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { v4: uuidv4 } = require('uuid');

let events = [
  {
    id: 1,
    title: 'Card 1',
    event_date: '2022-09-05',
    guests_count: 14,
    about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio voluptate soluta recusandae consequatur obcaecati voluptas nobis ipsum aspernatur minus?',
  },
  {
    id: 2,
    title: 'Card 2',
    event_date: '2022-09-16',
    guests_count: 3,
    about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio voluptate soluta recusandae consequatur obcaecati voluptas nobis ipsum aspernatur minus?',
  },
  {
    id: 3,
    title: 'Card 3',
    event_date: '2022-09-07',
    guests_count: 5,
    about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio voluptate soluta recusandae consequatur obcaecati voluptas nobis ipsum aspernatur minus?',
  },
  {
    id: 4,
    title: 'Card 4',
    event_date: '2022-09-01',
    guests_count: 7,
    about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio voluptate soluta recusandae consequatur obcaecati voluptas nobis ipsum aspernatur minus?',
  },
]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  socket.emit('list', events);

  socket.on('addCard', (data) => {
    events.push({
      id: uuidv4(),
      title: data.form.title,
      event_date: data.form.event_date,
      guests_count: Number(data.form.guests_count),
      about: data.form.about,
    })
    io.emit('list', events);
  })

  socket.on('editCard', (data) => {
    events = events.map(el => {
      if (data.form.id === el.id) {
        io.emit('changeCard', data.form)
        return data.form
      }
      return el
    })
    io.emit('list', events);
  })

  socket.on('deleteCard', (data) => {
    events.map((el, i) => {
      if (el.id === data.id) {
        events.splice(i, 1)
      }
      return el
    })
    io.emit('list', events);
  })
});
