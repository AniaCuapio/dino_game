// Config
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
//ctx.font = "50px 'Press Start 2P'"
//ctx.fillRect(0,0,canvas.width,canvas.height)

// Globals
let images = {
  dino: "../img/dino.png",
  //dino: "../img/black_dino.png",
  bg:
    //"../img/mountains_background.jpg",
    "https://cdna.artstation.com/p/assets/images/images/015/107/198/large/jean-nicolas-racicot-fca-background-canyon.jpg?1547075913",
  meteo: "../img/Meteo.png",
  meteo2: "../img/Meteo2.png",
  floor: "http://pixelartmaker.com/art/11f36df09b75735.png",
  lives: "",
  // star:
  //   "https://www.pikpng.com/pngl/m/318-3188473_estrella-de-vida-pixel-art-mario-star-clipart.png",
};
let interval; // si queremos apagar
let frames = 0; // siempre queremos contar
let enemies = [];

// Clases
class GameItem {
  constructor(config) {
    this.x = config.x ? config.x : 0;
    this.y = config.y ? config.y : 0;
    this.width = config.width ? config.width : 60;
    this.height = config.height ? config.height : 60;
    this.img = new Image();
    this.img.src = config.image ? config.image : null;
    this.img.onload = this.draw;
  }

  draw = () => {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

class Dino extends GameItem {
  constructor(config) {
    super(config);
  }
  moveLeft = () => {
    if (this.x < 60) return;
    this.x -= 64;
  };
  moveDown = () => {
    if (this.y < 64) return;
    this.y -= 64;
  };

  moveUp = () => {
    if (this.y < 64) return;
    this.y += 64;
  };

  moveRight = () => {
    if (this.x + 60 > canvas.width - 60) return;
    dino.x += 64;
  };

  crashWith = (item) => {
    // false o un true ....
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  };
}

class Meteo2 extends GameItem {
  constructor(config) {
    super(config);
    this.vy = config.vy ? config.vy : 2;
    this.vx = config.vx ? config.vx : 3;
  }

  draw = () => {
    // sobreescribimos el draw original
    this.y += this.vy;
    this.x += this.vx;

    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

class Meteo extends GameItem {
  constructor(config) {
    super(config);
    this.vy = config.vy ? config.vy : 2;
    this.vx = config.vx ? config.vx : 3;
  }

  draw = () => {
    // sobreescribimos el draw original
    this.y += this.vy;
    this.x -= this.vx;

    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

// Instancias
let backg = new GameItem({
  height: canvas.height,
  width: canvas.width,
  image: images.bg,
});
let dino = new Dino({ x: 0, y: 450, image: images.dino });

backg.draw = function () {
  if (this.x > canvas.width) this.x = 0;
  this.x += 0.2;
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  ctx.drawImage(this.img, this.x - this.width, this.y, this.width, this.height);
};

// Main functions
function start() {
  interval = setInterval(update, 1000 / 60);
}

function update() {
  // esto se repite infinitamente
  // también contamos
  frames++;
  console.log(frames); // aquí dibujamos
  // antes borramos
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // redibujamos cada uno de los elementos del videjuego (instancias) <-- regla
  backg.draw();
  dino.draw();

  // si lo quiero en mi videojuego lo tengo que meter a update
  drawMeteos();
  drawMeteos2();
  // generate stuff:
  if (frames % 60 === 0) generateMeteo();
  if (frames % 40 === 0) generateMeteo2();

  checkCollition();
}

function stop() {
  clearInterval(interval);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// aux functions
// <3 de tu juego
function generateMeteo() {
  // queremos: enemies.push(new Goomba({x:100,y:20,image:images.goomba}))
  let x = Math.floor(
    Math.random() * (canvas.width - getRandomInt(5)) + getRandomInt(5)
  );
  //generate random vy
  let meteo = new Meteo({ x, image: images.meteo, vy: 2 });
  enemies.push(meteo);
}

function generateMeteo2() {
  // queremos: enemies.push(new Goomba({x:100,y:20,image:images.goomba}))
  let x = Math.floor(
    Math.random() * (canvas.width - getRandomInt(5)) + getRandomInt(5)
  );
  //generate random vy
  let meteo2 = new Meteo2({ x, image: images.meteo2, vy: 3 });
  enemies.push(meteo2);
  console.log(enemies);
}

function drawMeteos2() {
  // ya podemos dibujarlos a todos
  enemies.forEach((meteo2) => {
    // porque es un ciclo
    meteo2.draw();
  });
}

function drawMeteos() {
  // ya podemos dibujarlos a todos
  enemies.forEach((meteo) => {
    // porque es un ciclo
    meteo.draw();
  });
}

let lives = [0, 1, 2];
function checkCollition() {
  enemies.forEach((meteo) => {
    if (dino.crashWith(meteo)) {
      stop();
      // function aux restarle la vida y probar un que se vuelva esqueleto
    }
  });
}

function checkCollition2() {
  enemies.forEach((meteo2) => {
    if (dino.crashWith(meteo2)) {
      stop();
      // function aux restarle la vida y probar un que se vuelva esqueleto
    }
  });
}

// listeners
addEventListener("keydown", (e) => {
  if (e.keyCode === 37) dino.moveLeft(); // esto es un atributo publico
  if (e.keyCode === 39) dino.moveRight(); // deberíamos usar setters y getters...
  if (e.keyCode === 38) dino.moveDown(); //ya no recuerdo nada de eso... que triste :(
  if (e.keyCode === 40) dino.moveUp();
  if (e.keyCode === 32) stop();
  if (e.keyCode === 13) start();
});

//start();
