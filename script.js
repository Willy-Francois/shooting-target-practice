let isFinishDrillSaid = false;

document.addEventListener('DOMContentLoaded', function () {
    hideRoundCounterSequence();
    const sliderRepsSequence = document.getElementById('numberRepsSequence');
    const div_nb_rep_Sequence = document.getElementById('value_nb_rep_Sequence');
    let value_nb_rep_Sequence = 10;
    // Mettre à jour la valeur affichée lors du déplacement du curseur
    sliderRepsSequence.addEventListener('input', function () {
        div_nb_rep_Sequence.innerHTML = sliderRepsSequence.value;
        value_nb_rep_Sequence = sliderRepsSequence.value;
    });

    const btn_stop = document.getElementById('stop');
    const btn_launch = document.getElementById('launch');
    let isRunning = false; // Variable pour suivre l'état du programme

    btn_stop.addEventListener('click', function (e) {
        hideRoundCounterSequence();
        var audio_end = new Audio('stop.mp3');
        audio_end.volume = 0.7;
        audio_end.play();

        this.setAttribute('disabled', true);

        this.style.opacity = '0.5';
        this.style.cursor= 'not-allowed';

        isRunning = false;

        var btn_start_par_time = document.getElementById('launch_par_time');
        btn_start_par_time.removeAttribute('disabled');
        btn_start_par_time.style.opacity = '1';
        btn_start_par_time.style.cursor= '';


        btn_launch.removeAttribute('disabled');
        btn_launch.style.opacity = '1';
        btn_launch.style.cursor= '';

        setTimeout(function (){
            btn_stop.removeAttribute('disabled');
            btn_stop.style.opacity = '1.0';
            btn_stop.style.cursor= '';
        }, 1000);
    });


    const slider = document.getElementById('delay');
    const output = document.getElementById('value_daley');
    let timeout_value = 2500;
    // Mettre à jour la valeur affichée lors du déplacement du curseur
    slider.addEventListener('input', function () {
        output.innerHTML = slider.value;
        timeout_value = slider.value;
    });

    const sliderBarrier = document.getElementById('numberBarrier');
    const outputBarrier = document.getElementById('value_barrier');
    let number_of_barriers = 5;
    sliderBarrier.addEventListener('input', function () {
        outputBarrier.innerHTML = sliderBarrier.value;
        number_of_barriers = sliderBarrier.value;
    });

    const sliderMinTime = document.getElementById('timeBarrier');
    const outputMinTime = document.getElementById('value_time_min');
    let time_min_value = 2;
    sliderMinTime.addEventListener('input', function () {
        outputMinTime.innerHTML = sliderMinTime.value;
        time_min_value = sliderMinTime.value;
    });


    const speech = new SpeechSynthesisUtterance();

    // Afficher la valeur initiale
    output.innerHTML = slider.value;

    btn_launch.addEventListener('click', async function (e) {
        if (!isRunning) {
            isRunning = true;
            displayRoundCounterSequence(0);

            try {
                await saySequence(0, value_nb_rep_Sequence);
            } catch (error) {
                console.error("Erreur dans saySequence :", error);
            }
        }
    });


    function speak(speech) {
        return new Promise((resolve, reject) => {
            speech.onend = resolve;
            speech.onerror = reject;
            speechSynthesis.speak(speech);
        });
    }

    async function saySequence(i, nbRepSequence) {
        if (isRunning && i < nbRepSequence) {
            try {
                if ('speechSynthesis' in window) {
                    btn_launch.setAttribute('disabled', true);
                    btn_launch.style.opacity = '0.5';
                    btn_launch.style.cursor = 'not-allowed';

                    var start = "Shooter Ready, Stand By";
                    speech.text = start;

                    if (speechSynthesis.getVoices().length > 0) {
                        speech.voice = speechSynthesis.getVoices()[7];

                        if (isRunning) {
                            await speak(speech);
                        }

                        setTimeout(function () {
                            if (isRunning) {
                                inProgressRoundCounterSequence(i + 1);
                                speech.text = generateRandomSequence();
                                speech.voice = speechSynthesis.getVoices()[4];
                                speak(speech)
                                    .then(() => {
                                        // Appeler sayBarriers une fois que le discours est terminé
                                        if (isRunning) {
                                            sayBarriers("", speech, 0, nbRepSequence, i);
                                        }
                                    })
                                    .catch(error => {
                                        console.error("Erreur lors de la synthèse vocale :", error);
                                    });
                            }
                        }, parseInt(timeout_value) + 1000);

                    }
                } else {
                    alert("L'API Web Speech n'est pas prise en charge dans ce navigateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la synthèse vocale :", error);
            }
        } else {
            if (isRunning) {
                setTimeout(function () {
                    hideRoundCounter();
                }, 4000);

                btn_launch.removeAttribute('disabled');
                btn_launch.style.opacity = '1';
                btn_launch.style.cursor = '';

                displayFinishRoundCounterSequence();

                isRunning = false;
            }
        }
    }



    async function sayBarriers(randomBarriers, speech, count, countRepSequence, i) {
        if (isRunning) {
            if (i < countRepSequence-1) {
                if (count <= number_of_barriers) {
                    setTimeout(async function () {
                        if (isRunning) {
                            if (randomBarriers !== "") {
                                speech.text = randomBarriers;
                                await speak(speech);
                            }
                            count++;

                            var randomBarrier = generateRandomBarrier();
                            await sayBarriers(randomBarrier, speech, count, countRepSequence, i);
                        }
                    }, getRandomDelay(time_min_value));
                } else {
                    if (isRunning) {
                        if (!isFinishDrillSaid) {
                            speech.text = "Round terminé";
                            speak(speech);
                            isFinishDrillSaid = true;
                        }

                        updateRoundCounterSequence(i + 1);
                        displayRoundCounterSequence(i + 1);

                        isFinishDrillSaid = false;
                        i = i+1

                        setTimeout(async function () {
                            if (isRunning) {
                                saySequence(i, countRepSequence);
                            }
                        }, 4000 + parseInt(timeout_value));
                    }
                }
            } else {
                sequenceFinished(i, countRepSequence, speech)
            }
        }
    }

    async function sequenceFinished(i, countRepSequence, speech){
        isRunning = false;

        displayFinishRoundCounterSequence();

        btn_launch.removeAttribute('disabled');
        btn_launch.style.opacity = '1';
        btn_launch.style.cursor = '';

        speech.text = "Série de Drill terminé";
        speak(speech);

        isFinishDrillSaid = true;
    }

    function generateRandomBarrier(){
        var barrierSequence = "";
        var barrier = getRandomNumber();

        if(barrier < 0.7){
            //console.log("Nothing :" + barrier)
            return "";
        }else{
            if(0.7 <= barrier && barrier < 0.8){
                //console.log("Encre :" + barrier)
                //encre
                barrierSequence += "Encre";
            }else if(0.8 <= barrier && barrier <= 0.9){
                //retour ou passe
                if(0.8 <= barrier && barrier < 0.85){
                    //console.log("Retour :" + barrier)
                    barrierSequence += "Retour";
                }else{
                    //console.log("Passe :" + barrier)
                    barrierSequence += "Passe";
                }
            }else{
                if(0.9 < barrier && barrier <= 0.95){
                    //début
                    //console.log("Début :" + barrier)
                    barrierSequence += "Début";
                }else{
                    var numberOrLetterBarrier = getRandomNumber()
                    if(numberOrLetterBarrier < 0.5) {
                        /*barrierSequence += "Début";*/
                    }else{
                        if(0.5 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.5625) {
                            //A
                            barrierSequence += "A";
                        }else if(0.5625 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.625) {
                            //1
                            barrierSequence += "1";
                        }else if(0.625 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.6875) {
                            //B
                            barrierSequence += "B";
                        }else if(0.6875 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.75) {
                            //2
                            barrierSequence += "2";
                        }else if(0.75 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.8125) {
                            //C
                            barrierSequence += "C";
                        }else if(0.8125 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.875) {
                            //3
                            barrierSequence += "3";
                        }else if(0.875 <= numberOrLetterBarrier && numberOrLetterBarrier < 0.9375) {
                            //D
                            barrierSequence += "D";
                        }else{
                            //4
                            barrierSequence += "4";
                        }
                    }
                }
            }
        }
        return barrierSequence;
    }


    function generateRandomSequence(){
        var sequence = "";
        var ShapeOrColor = getRandomNumber();

        if (ShapeOrColor < 0.5) { // Couleur
            if (ShapeOrColor <= 0.125) {
                sequence += "Rouge "
            } else if (0.125 < ShapeOrColor && ShapeOrColor <= 0.25){
                sequence += "Bleu "
            } else if (0.25 < ShapeOrColor && ShapeOrColor <= 0.375){
                sequence += "Vert "
            }else{
                sequence += "Noir "
            }
        }else{ // Forme
            if (ShapeOrColor <= 0.625) {
                sequence += "Triangle "
            } else if (0.625 < ShapeOrColor && ShapeOrColor <= 0.75){
                sequence += "Croix "
            } else if (0.75 < ShapeOrColor && ShapeOrColor <= 0.875){
                sequence += "Carré "
            } else{
                sequence += "Rond "
            }
        }

        var direction = getRandomNumber();

        //direction
        if (direction <= 0.25) {
            sequence += "Haut"
        }else if(0.25 < direction && direction <= 0.5){
            sequence += "Bas"
        }else if(0.5 < direction && direction <= 0.75){
            sequence += "Gauche"
        }else{
            sequence += "Droite"
        }

        return sequence;
    }

// Fonction pour générer un nombre aléatoire entre 0 et 1 avec 4 chiffres après la virgule
    function getRandomNumber() {
        // Générer un nombre aléatoire entre 0 et 1
        const randomNum = Math.random();

        // Obtenir les quatre premiers chiffres après la virgule
        return parseFloat(randomNum.toFixed(4));
    }

    // Fonction pour générer un délai aléatoire entre temps_min et 2 secondes après temps_min
    function getRandomDelay(temps_min) {
        let minDelay = parseFloat(temps_min) * 1000; // Convertir temps_min en millisecondes
        let maxDelay = minDelay + 2000; // 2 secondes après temps_min

        return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    }
});

function updateRoundCounterSequence(i) {
    let roundNumberElementSequence = document.getElementById('roundNumberSequence');
    // Update the round number in the HTML
    if (roundNumberElementSequence) {
        roundNumberElementSequence.innerText = i;
    }
}

function displayRoundCounterSequence(i) {
    console.log("Display be ready :" + parseInt(i+1))
    const roundCounter = document.getElementById('roundCounterSequence');
    if (roundCounter) {
        roundCounter.innerHTML = "Round<span id=\"roundNumberSequence\">" + parseInt(i+1) + "</span> : Be ready"
        roundCounter.style.backgroundColor = "#bd7c1a"
        roundCounter.style.display = 'block';
    }
}

function hideRoundCounterSequence() {
    const roundCounter = document.getElementById('roundCounterSequence');
    if (roundCounter) {
        roundCounter.style.display = 'none';
    }
}

function inProgressRoundCounterSequence(i) {
    const roundCounter = document.getElementById('roundCounterSequence');
    if (roundCounter) {
        roundCounter.innerHTML = "Round<span id=\"roundNumberSequence\">" + i + "</span> : In progress..."
        roundCounter.style.backgroundColor = "#1abd32"
    }
}

function displayFinishRoundCounterSequence() {
    const roundCounter = document.getElementById('roundCounterSequence');
    if (roundCounter) {
        roundCounter.innerHTML = "All rounds are finished"
        roundCounter.style.backgroundColor = "#bd1a1a"
        roundCounter.style.display = 'block';
    }

    setTimeout(function () {
        hideRoundCounterSequence()
    }, 4000);
}

