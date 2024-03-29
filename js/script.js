let resizeReset = function() {
  w = canvasBody.width = document.documentElement.scrollWidth;
  h = canvasBody.height = document.documentElement.scrollHeight;
}

let particleAmount = Math.floor(document.documentElement.scrollHeight / 10.0);

const opts = { 
  particleColor: "rgb(234,191,82)",
  lineColor: "rgb(200,200,200)",
  particleAmount: particleAmount,
  defaultSpeed: 0.3,
  variantSpeed: 0.3,
  defaultRadius: 2,
  variantRadius: 2,
  linkRadius: 150,
};

window.addEventListener("resize", function(){
  deBouncer();
});

let deBouncer = function() {
    clearTimeout(tid);
    tid = setTimeout(function() {
        resizeReset();
    }, delay);
};

let checkDistance = function(x1, y1, x2, y2){ 
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

let linkPoints = function(point1, hubs){ 
  for (let i = 0; i < hubs.length; i++) {
    let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
    let opacity = 1 - distance / opts.linkRadius;
    if (opacity > 0) { 
      drawArea.lineWidth = 0.5;
      drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
      drawArea.beginPath();
      drawArea.moveTo(point1.x, point1.y);
      drawArea.lineTo(hubs[i].x, hubs[i].y);
      drawArea.closePath();
      drawArea.stroke();
    }
  }
}

Particle = function(xPos, yPos){ 
  this.x = Math.random() * w; 
  this.y = Math.random() * h;
  this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed; 
  this.directionAngle = Math.floor(Math.random() * 360); 
  this.color = opts.particleColor;
  this.radius = opts.defaultRadius + Math.random() * opts. variantRadius; 
  this.vector = {
    x: Math.cos(this.directionAngle) * this.speed,
    y: Math.sin(this.directionAngle) * this.speed
  };
  this.update = function(){ 
    this.border(); 
    this.x += this.vector.x; 
    this.y += this.vector.y; 
  };
  this.border = function(){ 
    if (this.x >= w || this.x <= 0) { 
      this.vector.x *= -1;
    }
    if (this.y >= h || this.y <= 0) {
      this.vector.y *= -1;
    }
    if (this.x > w) this.x = w;
    if (this.y > h) this.y = h;
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0; 
  };
  this.draw = function(){ 
    drawArea.beginPath();
    drawArea.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    drawArea.closePath();
    drawArea.fillStyle = this.color;
    drawArea.fill();
  };
};

function setup(){ 
  particles = [];
  resizeReset();
  for (let i = 0; i < opts.particleAmount; i++){
    particles.push( new Particle() );
  }
  window.requestAnimationFrame(loop);
}

function loop(){ 
  window.requestAnimationFrame(loop);
  drawArea.clearRect(0,0,w,h);
  for (let i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].draw();
  }
  for (let i = 0; i < particles.length; i++){
    linkPoints(particles[i], particles);
  }
}

document.addEventListener("DOMContentLoaded", function() {
    let text = Array.from(document.querySelector('h1').innerText);

    // Заменяем текст на отдельные span элементы для каждой буквы
    document.querySelector('h1').innerHTML = text.map((char) => `<span>${char}</span>`).join('');

    // Получаем все span элементы
    let spans = Array.from(document.querySelectorAll('h1 span'));

    // Фильтруем список, чтобы оставить только span элементы без пробелов
    let nonSpaceSpans = spans.filter(span => span.innerText !== ' ');

    // Выбираем случайный span элемент для начала
    let index = Math.floor(Math.random() * nonSpaceSpans.length);
    nonSpaceSpans[index].classList.add('invisible');

    setInterval(function() {
        // Удаляем класс 'invisible' у текущего span элемента
        nonSpaceSpans[index].classList.remove('invisible');

        // Выбираем новый случайный индекс
        index = Math.floor(Math.random() * nonSpaceSpans.length);

        // Добавляем класс 'invisible' к новому span элементу
        nonSpaceSpans[index].classList.add('invisible');
    }, 1000);
});



const canvasBody = document.getElementById("canvas"),
drawArea = canvasBody.getContext("2d");
let delay = 200, tid,
rgb = opts.lineColor.match(/\d+/g);
resizeReset();
setup();
