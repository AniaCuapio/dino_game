// Config
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
//ctx.font = "50px 'Press Start 2P'"
//ctx.fillRect(0,0,canvas.width,canvas.height)

// Globals
let images = {
  dino: "../img/dino.png",
  blackDino: "../img/black_dino.png",
  bg:
    //"../img/wallpaper2.jpg",
    "https://cdna.artstation.com/p/assets/images/images/015/107/198/large/jean-nicolas-racicot-fca-background-canyon.jpg?1547075913",
  bg2: "../img/background-montana.jpg",
  bg3: "../img/background-jungle.jpg",
  bg4: "../img/background-ny.jpg",
  bg5: "../img/background-mars.jpg",
  meteo: "../img/Meteo.png",
  meteo2: "../img/Meteo2.png",
  person2:
    //"../img/ninja-girl.png",
    "../img/mariposa-purpura-izquierda.png",
  person:
    //"../img/running.png",
    "../img/mariposa-azul-derecha.png",
  lives: "../img/egg.png",
};

let interval; // si queremos apagar
let frames = 0; // siempre queremos contar
let enemies = [];
let friends = [];
let score = 5;

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
    this.vy = config.vy ? config.vy : 3;
    this.vx = config.vx ? config.vx : 2;
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
    this.vy = config.vy ? config.vy : 3;
    this.vx = config.vx ? config.vx : 2;
  }

  draw = () => {
    // sobreescribimos el draw original
    this.y += this.vy;
    this.x -= this.vx;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

class Person extends GameItem {
  constructor(config) {
    super(config);
    this.vx = config.vx ? config.vx : 2;
    this.width = 50;
    this.height = 50;
  }

  draw = () => {
    // sobreescribimos el draw original
    this.x += this.vx;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

class Person2 extends GameItem {
  constructor(config) {
    super(config);
    this.vx = config.vx ? config.vx : 2;
    this.width = 50;
    this.height = 50;
  }

  draw = () => {
    // sobreescribimos el draw original
    this.x -= this.vx;
    ctx.drawImage(this.img, this.x, this.y, this.height, this.height);
  };
}

// Instancias
let backg = new GameItem({
  height: canvas.height,
  width: canvas.width,
  image: images.bg,
});
let dino = new Dino({ x: 0, y: 500, image: images.dino });

backg.draw = function () {
  if (this.x > canvas.width) this.x = 0;
  this.x += 0.5;
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  ctx.drawImage(this.img, this.x - this.width, this.y, this.width, this.height);
};

// Main functions
function start() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px 'Press Start 2P'";
  ctx.fillStyle = "#02F9FD";
  ctx.fillText("**Dino Game**", 140, 100);
  ctx.font = "25px 'Press Start 2P'";
  ctx.fillStyle = "#FEFC2D";
  ctx.fillText("Press Enter to start", 160, 150);
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
  drawScore();
  // si lo quiero en mi videojuego lo tengo que meter a update
  drawMeteos();
  drawMeteos2();
  // generate
  if (frames % 60 === 0) generateMeteo();
  if (frames % 40 === 0) generateMeteo2();
  checkCollition();

  if (frames % 100 === 0) generatePerson();
  drawPerson();
  if (frames % 100 === 0) generatePerson2();
  drawPerson2();
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

function checkCollition() {
  enemies.forEach((m) => {
    if (dino.crashWith(m)) {
      score = score - 1;
      if (score === 0) {
        stop();
      }
    }
  });
}

function generatePerson() {
  let y = Math.floor(Math.random() * (canvas.width - 5) + 5);
  let person = new Person({ y, image: images.person, vx: 2 });
  friends.push(person);
  console.log(friends);
}

function drawPerson() {
  // ya podemos dibujarlos a todos
  friends.forEach((person) => {
    // porque es un ciclo
    person.draw();
  });
}

function generatePerson2() {
  let y = Math.floor(Math.random() * (canvas.width - 5) + 5);
  let x = canvas.width;
  let person2 = new Person2({ y, x, image: images.person2, vx: 2 });
  friends.push(person2);
  console.log(friends);
}

function drawPerson2() {
  // ya podemos dibujarlos a todos
  friends.forEach((person2) => {
    // porque es un ciclo
    person2.draw();
  });
}

function checkCollitionFriend() {
  friends.forEach((p) => {
    if (dino.crashWith(p)) {
      score = score + 1;
      if (score === 0) {
        stop();
      }
      //stop();
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

function drawScore() {
  ctx.font = `20px 'Press Start 2P'`;
  ctx.fillText(`${score} lives`, 700, 50);
}

// function welcome() {
//   ctx.fillStyle = "transparent";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   ctx.font = "40px 'Press Start 2P'";
//   ctx.fillText("**Dino Game**", 140, 100);
//   ctx.font = "25px 'Press Start 2P'";
//   ctx.fillText("Press Enter key to start", 160, 150);
// }

// welcome();
