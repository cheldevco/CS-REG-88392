import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {
  console.log("Player connected:", socket.id);

  // создаём нового игрока
  players[socket.id] = {
    x: Math.random() * 600,
    y: Math.random() * 400,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  };

  io.emit("updatePlayers", players);

  // получаем движение
  socket.on("move", dir => {
    const player = players[socket.id];
    if (!player) return;
    if (dir === "left") player.x -= 5;
    if (dir === "right") player.x += 5;
    if (dir === "up") player.y -= 5;
    if (dir === "down") player.y += 5;
    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(3000, () => console.log("✅ Server started on http://localhost:3000"));
