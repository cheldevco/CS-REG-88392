<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
<script>
const socket = io();

let players = {};
let graphics;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1e1e1e",
  parent: "game",
  scene: {
    create,
    update
  }
};

const game = new Phaser.Game(config);

function create() {
  graphics = this.add.graphics();

  // управление с клавиатуры
  this.input.keyboard.on("keydown", (e) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
      const dir = e.key.replace("Arrow", "").toLowerCase();
      socket.emit("move", dir);
    }
  });

  // обработка обновлений
  socket.on("updatePlayers", (data) => {
    players = data;
  });
}

function update() {
  graphics.clear();
  for (let id in players) {
    const p = players[id];
    graphics.fillStyle(p.color === undefined ? 0xffffff : Phaser.Display.Color.HexStringToColor(p.color).color, 1);
    graphics.fillRect(p.x, p.y, 40, 40);
  }
}
</script>
