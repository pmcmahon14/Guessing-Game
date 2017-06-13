/**
 * Created by Patrick on 1/26/2017.
 */
$(document).ready(function() {
    $('#guess').click(analyzeGuess);
    pickNumber();
    $('#guess').keypress(enterKey);
});




var count = 10;
var randomNumber = null;
var playerGuess = null;
var low = 1;
var high = 100;
var top = 100;
var bottom = 1;
var background = null;


function pickNumber() {
    if (randomNumber === null) {
        randomNumber = Math.floor((Math.random() * 100) + 1);
        return(randomNumber);
    } else {
        return;
    }
}

//clears form for next guess

function clearForm() {
    $('#guess').val('');
}

//picks a new number after clicking start over

function pickNewNumber() {
    if (randomNumber === null) {
        randomNumber = Math.floor((Math.random() * 100) + 1);
        return(randomNumber);
    }
}

//allows player to press enter button

function enterKey(event) {
    if (event.which == 13) {
        analyzeGuess();
    }
}

//analyze guess and display message for range of 1-100

function analyzeGuess() {
    playerGuess = $('#guess').val();
    if (playerGuess < 1 || playerGuess > 100) {
        $('#displaymessage').text('Guess is out of range. Please try again.');
        clearForm();
        $('input').focus();
    } else {
        if (playerGuess < randomNumber) {
            $('#displaymessage').text('Oops, too low!');
            rangefinder();
        } else if (playerGuess > randomNumber) {
            $('#displaymessage').text('Whoa, too high!');
            rangefinder();
        } else if (playerGuess == randomNumber) {
            $('#displaymessage').text('Boom, confetti!');
            winnerAudio();
            setTimeout(confetti, 250);
            $('#displayrange').text(randomNumber);
            $('#guess').attr('disabled', true);
        } else {
            $('#displaymessage').text('Good try. The correct number is ' + randomNumber + '.');
        }
        guessCounter();
        clearForm();
        $('input').focus();
    }
}

//plays winner audio upon win

function winnerAudio() {
    var win = document.getElementById('winner');
    win.play();
}

// guess counter and button disabler

function guessCounter() {
    count = count - 1;
    $('#guessesleft').text(count);
    if (count === 0) {
        $('#guess').attr('disabled', true);
    }changeBackground();
}

//set background color

window.onload = changeBackground;

function changeBackground() {
    switch(count) {
        case 9:
            $('#board').css("background-color", "rgb(50, 255, 0)");
            break;
        case 8:
            $('#board').css("background-color", "rgb(100, 255, 0");
            break;
        case 7:
            $('#board').css("background-color", "rgb(150, 255, 0");
            break;
        case 6:
            $('#board').css("background-color", "rgb(200, 255, 0");
            break;
        case 5:
            $('#board').css("background-color", "rgb(255, 255, 0");
            break;
        case 4:
            $('#board').css("background-color", "rgb(255, 200, 0");
            break;
        case 3:
            $('#board').css("background-color", "rgb(255, 150, 0");
            break;
        case 2:
            $('#board').css("background-color", "rgb(255, 100, 0");
            break;
        case 1:
            $('#board').css("background-color", "rgb(255, 50, 0");
            break;
        case 0:
            $('#board').css("background-color", "rgb(255, 0, 0");
            break;
    }
}

//displays the range of guessed numbers

function rangefinder() {
    if (playerGuess < randomNumber) {
        low = playerGuess;
    } else {
        high = playerGuess;
    }
    $('#displayrange').text(low + '-' + high);
    difference();
}

//displays range of guesses

function difference() {
    top = high-randomNumber;
    bottom = randomNumber-low;

}



//when player clicks start over button

function startOver() {
    count = 10;
    $('#guessesleft').text(count);
    $('#displaymessage').text('');
    $('#displayrange').text('');
    $('#guess').attr('disabled', false);
    top = 100;
    bottom = 1;
    low = 1;
    high = 100;
    randomNumber = null;
    pickNewNumber();
    targetNumber = randomNumber;
    $('input').focus();
    $('#displaymessage').text('Good luck!');
    $('#displayrange').text('1-100');
    document.getElementById('board').style.background = "rgb(0, 250, 0)";
    $('canvas').remove();
}

//CONFETTI CELEBRATION FOR WIN

function confetti() {
    //canvas init
    canvas = $('<canvas>').attr('id', 'celebrate');
    $('.confetti').append(canvas);
    var ctx = canvas[0].getContext("2d");

    //canvas dimensions
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    //snowflake particles
    var mp = 2000; //max particles
    var particles = [];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * W, //x-coordinate
            y: Math.random() * H, //y-coordinate
            r: Math.random() * 2 + 1, //radius
            d: Math.random() * mp, //density
            color: "rgba(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", 0.8)",
            tilt: Math.floor(Math.random() * 5) - 5
        });
    }

    //Lets draw the flakes
    function draw() {
        ctx.clearRect(0, 0, W, H);



        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color; // Green path
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.tilt + p.r / 2, p.y + p.tilt);
            ctx.stroke(); // Draw it
        }

        update();
    }

    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;

    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;

            //Sending flakes back from the top when it exits
            //Let's make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > W + 5 || p.x < -5 || p.y > H) {
                if (i % 3 > 0) //66.67% of the flakes
                {
                    particles[i] = {
                        x: Math.random() * W,
                        y: -10,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                        tilt: p.tilt
                    };
                } else {
                    //If the flake is exiting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = {
                            x: -5,
                            y: Math.random() * H,
                            r: p.r,
                            d: p.d,
                            color: p.color,
                            tilt: p.tilt
                        };
                    } else {
                        //Enter from the right
                        particles[i] = {
                            x: W + 5,
                            y: Math.random() * H,
                            r: p.r,
                            d: p.d,
                            color: p.color,
                            tilt: p.tilt
                        };
                    }
                }
            }
        }
    }

    //animation loop
    setInterval(draw, 1);
}


