const roundNumberElement = document.getElementById('roundNumber');
let roundNumber = 1; // Initial round number

document.addEventListener('DOMContentLoaded', function () {
    hideRoundCounter();
    const sliderReps = document.getElementById('numberReps');
    const div_nb_rep = document.getElementById('value_nb_rep');
    let value_nb_rep = 10;
    // Mettre à jour la valeur affichée lors du déplacement du curseur
    sliderReps.addEventListener('input', function () {
        div_nb_rep.innerHTML = sliderReps.value;
        value_nb_rep = sliderReps.value;
    });

    let isRunning = false; // Variable pour suivre l'état du programme
    const btn_stop = document.getElementById('stop');
    const speech = new SpeechSynthesisUtterance();

    btn_stop.addEventListener('click', function (e) {
        hideRoundCounter();
        var audio_end = new Audio('stop.mp3');
        audio_end.volume = 0.7;
        audio_end.play();

        isRunning = false;
    });
    var btn_start_par_time = document.getElementById('launch_par_time');

    btn_start_par_time.addEventListener('click', function (e) {
        isRunning = true;
        this.setAttribute('disabled', true);
        this.style.opacity = '0.5';
        this.style.cursor= 'not-allowed';

        // L'API Web Speech est prise en charge
        var start = "Shooter Ready, Stand By";
        speech.text = start;
        speech.voice = speechSynthesis.getVoices()[7];
        speechSynthesis.speak(speech);

        // Appel initial
        var par_time = parseFloat(document.getElementById('input_par_time').value)*1000;
        var delay_before_start = parseFloat(document.getElementById('input_delay_time').value);
        var randomizer_time = parseFloat(document.getElementById('input_randomizer').value);

        playBeepSequence(0, par_time, delay_before_start, randomizer_time, value_nb_rep);
    });

    var inputElement = document.getElementById('input_par_time');
    // Ajouter un gestionnaire d'événements blur pour détecter la désélection de l'input
    inputElement.addEventListener('blur', function (e) {
        if(e.target.value===''){
            e.target.value = '3.0';
        }
    });

    document.getElementById('input_par_time').addEventListener('input', function (event) {
        var inputValue = event.target.value;

        // Vérifier si l'entrée est un chiffre, une virgule ou un point
        if ((!/^\d*\.?\d{0,2}$/.test(inputValue) && event.data !== null) || inputValue>60) {
            event.target.value = '3.0';
        }

    });

    function playBeepSequence(i, par, start, random, nbRep) {
        if (i < nbRep) {
            displayRoundCounter(i+1);
            var random_start = parseFloat(start + getRandomNumber(random))*1000;

            setTimeout(function () {
                if (isRunning) {
                    var audio_debut = new Audio('beep-debut.mp3');
                    audio_debut.play();
                    inProgressRoundCounter(i+1);

                    setTimeout(function () {
                        if (isRunning) {
                            var audio_end = new Audio('beep-fin.mp3');
                            audio_end.volume = 0.7;
                            audio_end.play();

                            // Increment round number
                            roundNumber++;
                            updateRoundCounter();
                            playBeepSequence(i + 1, par, start, random, nbRep);
                        }
                    }, par);
                }
            }, random_start);
        }else{
            isRunning = false;

            setTimeout(function () {
                hideRoundCounter();
            }, 4000);

            btn_start_par_time.removeAttribute('disabled');
            btn_start_par_time.style.opacity = '1';
            btn_start_par_time.style.cursor= '';

            displayFinishRoundCounter();
        }
    }
});

function increaseTime(elementId) {
    var inputElement = document.getElementById(elementId);
    inputElement.value = (parseFloat(inputElement.value) + 0.1).toFixed(2);
}

function decreaseTime(elementId) {
    var inputElement = document.getElementById(elementId);
    if (parseFloat(inputElement.value) > 0) {
        inputElement.value = (parseFloat(inputElement.value) - 0.1).toFixed(2);
    }
}

function getRandomNumber(maximum) {
    var randomNumber = Math.random();
    var result = randomNumber * maximum;
    return result;
}

function updateRoundCounter() {
    // Update the round number in the HTML
    if (roundNumberElement) {
        roundNumberElement.innerText = roundNumber;
    }
}

function displayRoundCounter(i) {
    const roundCounter = document.getElementById('roundCounter');
    if (roundCounter) {
        roundCounter.innerHTML = "Round<span id=\"roundNumber\">" + i + "</span> : Be ready"
        roundCounter.style.backgroundColor = "#bd7c1a"
        roundCounter.style.display = 'block';
    }
}

function hideRoundCounter() {
    const roundCounter = document.getElementById('roundCounter');
    if (roundCounter) {
        roundCounter.style.display = 'none';
    }
}

function inProgressRoundCounter(i) {
    const roundCounter = document.getElementById('roundCounter');
    if (roundCounter) {
        roundCounter.innerHTML = "Round<span id=\"roundNumber\">" + i + "</span> : In progress..."
        roundCounter.style.backgroundColor = "#1abd32"
    }
}

function displayFinishRoundCounter(i) {
    const roundCounter = document.getElementById('roundCounter');
    if (roundCounter) {
        roundCounter.innerHTML = "All rounds are finished"
        roundCounter.style.backgroundColor = "#bd1a1a"
        roundCounter.style.display = 'block';
    }
}