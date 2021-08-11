$score = document.querySelector(".score");
$startScreen = document.querySelector(".start-screen");
$gameArea = document.querySelector(".game-area");
$joyStick = document.querySelector(".joys-stick");

const gameWidth = $gameArea.offsetWidth;

const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
const player = { speed: 10, score: 0 };
const enemyColor = ["red", "green", "yellow"];
const enemyLocation = [];

$startScreen.addEventListener("click", start);
$joyStick?.addEventListener("click", joyStick);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function start() {
    $startScreen.classList.add("hide");
    $gameArea.innerHTML = '';
    // $gameArea.innerHTML = '<div class="joys-stick"><div class="joys-stick__touch"></div></div>';
    player.score = 0;
    player.start = true;
    enemyLocation.length = 0;
    window.requestAnimationFrame(playGame);
    for (let y = 0; y <= 10; y++) {
        let $line = document.createElement("div");
        $line.classList.add("line");
        $line.y = y * 150;
        $line.style.top = (y * 150) + "px";
        $gameArea.appendChild($line);
    }
    for (let y = 1; y <= 3; y++) {
        let $enemy = document.createElement("div");
        $enemy.classList.add("enemy");
        $enemy.classList.add("enemy--" + y);
        $enemy.y = -(y * 600);
        $enemy.style.top = $enemy.y + "px";
        $enemy.style.left = Math.floor(Math.random() * (gameWidth - 50)) + "px";
        $enemy.style.backgroundColor = randomColor();
        enemyLocation.push($enemy.style.left.split("px")[0] * 1);
        $gameArea.appendChild($enemy);
    }
    let $car = document.createElement("div");
    $car.classList.add("car");

    $gameArea.appendChild($car);
    player.x = $car.offsetLeft;
    player.y = $car.offsetTop;
}

function moveLines() {
    const $lines = document.querySelectorAll(".line");
    $lines.forEach($line => {
        if ($line.y > 1500) $line.y = 0;
        $line.y += player.speed;
        $line.style.top = $line.y + "px";
    });
}

function moveEnemy($car) {
    const $enemys = document.querySelectorAll(".enemy");
    $enemys.forEach($enemy => {
        isColide($car, $enemy) && endGame();
        if ($enemy.y > 1500) {
            $enemy.y = -600;
            $enemy.style.left = setEnemyLocation();
            $enemy.style.backgroundColor = randomColor();
        }
        $enemy.y += player.speed + ($enemy.className.split("--")[1]*1);
        $enemy.style.top = $enemy.y + "px";
    });
}

function isColide($a, $b) {
    const rectA = $a.getBoundingClientRect();
    const rectB = $b.getBoundingClientRect();

    return !(
        (rectA.top > rectB.bottom) ||
        (rectA.bottom < rectB.top) ||
        (rectA.left > rectB.right) ||
        (rectA.right < rectB.left)
    );
}

function randomColor() {
    const color = () => Math.floor(Math.random() * 255);
    return `rgb(${color()}, ${color()}, ${color()})`;
}

function setEnemyLocation() {
    enemyLocation.pop();
    let unique = [0];
    let location;
    while (unique.length) {
        location = Math.floor(Math.random() * (gameWidth - 50));
        unique = enemyLocation.filter(cur => !(location - 50 > cur || location < cur - 50));
    }
    enemyLocation.unshift(location);
    return location + "px";
}

function joyStick(e) {
    console.log({$joyStick});
    console.log(e.x, e.y);
}

function playGame() {
    let $car = document.querySelector(".car");
    let road = $gameArea.getBoundingClientRect();
    moveLines();
    moveEnemy($car);
    if (player.start) {
        if (keys.ArrowDown && player.y < road.bottom) player.y += player.speed;
        if (keys.ArrowUp && player.y > road.top) player.y -= player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - 50) player.x += player.speed;

        $car.style.left = player.x + "px";
        $car.style.top = player.y + "px";
        window.requestAnimationFrame(playGame);
        player.score += .1;
        $score.textContent = Math.floor(player.score);
    }
}

function endGame() {
    player.start = false;
    $score.innerHtml = "Game Over <br /> Score was " + Math.floor(player.score);
    $startScreen.classList.remove("hide");
}