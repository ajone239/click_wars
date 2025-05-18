document.addEventListener("gesturestart", function(e) {
    e.preventDefault();
});

const GameState = Object.freeze({
    MENU: 0,
    READY: 1,
    PLAY: 2,
    OVER: 3
});

const VERSION = "1.0.0"

const GAME_LENGTH = 60 * 1000
const OVER_MENU = 1 * 1000

let game_state = GameState.MENU;
let score = 0;
let play_start;
let can_go_to_menu = false

function setup() {
    createCanvas(document.body.clientWidth, document.body.clientHeight);
    background(Theme.background);
}

function draw() {
    background(Theme.background);
    credit()

    switch (game_state) {
        case GameState.MENU:
            start_menu()
            break;
        case GameState.READY:
            play_draw("Click Me!");
            break;
        case GameState.PLAY:
            play_draw(`${score}`);
            break;
        case GameState.OVER:
            play_draw();
            summary_menu();
            break;
    }
}

function handleInteraction() {
    switch (game_state) {
        case GameState.MENU:
            game_state = GameState.READY
            break;
        case GameState.READY:
            game_state = GameState.PLAY
            score = 1
            can_go_to_menu = false
            play_start = Date.now()

            setTimeout(
                () => {
                    game_state = GameState.OVER
                    setTimeout(
                        () => { can_go_to_menu = true },
                        OVER_MENU
                    );
                },
                GAME_LENGTH
            );
            break;
        case GameState.PLAY:
            score++
            break;
        case GameState.OVER:
            if (!can_go_to_menu) {
                return;
            }
            score = 0
            game_state = GameState.MENU
            break;
    }
}

function play_draw(button_text) {
    push()

    translate(width / 2, height / 2);

    let radius1 = Math.min(
        (3 * height / 4),
        (3 * width / 4)
    )
    let radius2 = radius1 * 0.9
    let radius3 = radius2 * 0.9

    fill(Theme.accent1)

    let diff = Date.now() - play_start;
    let adjust = diff / GAME_LENGTH;
    if (adjust > 1) {
        adjust = 0;
    }

    let angle_from = 2 * PI
    let angle_to = angle_from * adjust

    push()

    rotate((3 / 2) * PI)
    arc(0, 0, radius1, radius1, angle_from, angle_to)

    pop()

    fill(Theme.primary)
    ellipse(0, 0, radius2)

    fill(Theme.back_highlight)
    ellipse(0, 0, radius3)

    fill(Theme.primary)
    textAlign(CENTER, CENTER);
    textSize(30)
    text(button_text, 0, 0);

    pop()
}

function touchStarted() {
    handleInteraction();
}

function keyPressed() {
    if (key == ' ') {
        handleInteraction();
    }
}

function credit() {
    push()
    fill(Theme.primary)
    textAlign(CENTER, CENTER);
    text("Click Wars!", width / 2, 20);

    text(`Version: ${VERSION}`, 1 * width / 4, 20);
    text(`Score: ${score}`, 3 * width / 4, 20);

    pop()
}

function start_menu() {
    push()

    const menu_height = 300
    const menu_width = 300

    stroke(Theme.primary)
    strokeWeight(3)
    fill(Theme.back_highlight)

    rect(
        (width - menu_width) / 2,
        (height - menu_height) / 2,
        menu_width,
        menu_height,
        20
    );

    push()

    noStroke()
    textAlign(CENTER, CENTER);

    fill(Theme.primary)
    textSize(20)
    text("Welcome!", width / 2, (height / 2) - 25);

    textSize(15)
    text(`Once started, tap to being.`, width / 2, (height / 2));

    fill(Theme.back_highlight)
    textSize(15)
    text("Tap/press space to start...", width / 2, (height / 2) + 25);

    pop()
    pop()
}

function summary_menu() {
    push()

    const menu_height = 300
    const menu_width = 300

    stroke(Theme.primary)
    strokeWeight(3)
    fill(Theme.accent1)

    rect(
        (width - menu_width) / 2,
        (height - menu_height) / 2,
        menu_width,
        menu_height,
        20
    );

    push()

    noStroke()
    textAlign(CENTER, CENTER);

    fill(Theme.primary)
    textSize(15)
    text("Game Over!", width / 2, (height / 2) - 25);

    textSize(20)
    text(`You scored ${score}!`, width / 2, (height / 2));

    fill(Theme.back_highlight)
    textSize(15)
    text("Tap/press space to start...", width / 2, (height / 2) + 25);

    pop()
    pop()
}
