/*todo:
    - CSS
    - Sound implementieren
    - pausen starten automatisch
    - Zeit wird im Tab angezeigt
    - Pause Long Break - Überschrift
*/

const button = document.querySelector('#start');
const counter = document.querySelector('#countdown');
const container = document.querySelector('#container');
const settings = document.querySelector('#settingWindow');
const saveButton = document.querySelector('#save');
let workTime = 25;
let pauseTime = 5;
let longPause = 2; //long break after 2 intervals
let longPauseTime = 10; 
let counterLongPause = 0;
let state = 'work'; //'work', 'pause', 'longBreak'
let cycle;
let start;
let end;
let remTime;
let remMin;
let remSec;
let pause = false;

button.addEventListener('click', startSession);
displayCounter(workTime, 0);

function startSession() {
    button.removeEventListener('click', startSession);
    button.addEventListener('click', pauseCountdown);
    button.innerText = 'Stop';
    end = getEnd(workTime);
    startCountdown(end);
}

function startCountdown(end) {
    cycle = setInterval(() => {
        start = new Date().getTime();
        remTime = end - start; 
        remMin = Math.trunc(remTime / 60000); //Nachkommastellen abschneiden für Minuten anzahl 
        remSec = Math.trunc(Math.round((remTime % 60000) / 1000));//modulo für rest mm, um auf die restlichen mm zu kommen
        displayCounter(remMin,remSec);
        console.log(remMin, remSec);
        if (remTime <= 0) {

            remTime = undefined;
            remMin = undefined;
            remSec = undefined;
            clearInterval(cycle);

            //state Ändern nach Countdown-Ablauf
            state =  checkNextCycle(counterLongPause,state);
            console.log(state);
            setBackGroundColor(state);

            //Wenn Long Break ansteht
            if(state == 'longBreak'){
                counterLongPause = 0;
                button.removeEventListener('click', pauseCountdown);
                button.addEventListener('click', startLongBreak);
            }
            //Wenn Pauseansteht
            else if(state == 'work'){
                displayCounter(pauseTime,0);
                button.innerText = 'Start';
                button.removeEventListener('click', pauseCountdown);
                button.addEventListener('click', startPause);
            }                 
            //Wenn weitergearbeitet werden soll
            else if(state == 'pause'){ 
                counterLongPause++;//wenn grün
                displayCounter(workTime,0);
                button.innerText = 'Start';
                button.removeEventListener('click', pauseCountdown);
                button.addEventListener('click', startPause);
            }
        }
    }, 1000);
}

function getEnd(cycleTime) {
    end = new Date();
    if (remTime == undefined && remMin == undefined && remSec == undefined) {
        let min = end.getMinutes();
        end.setMinutes(min + cycleTime);
        return end.getTime();
    }
    else {
        return end.getTime() + remTime; //Neue Endzeit berechnen
    }
}

function pauseCountdown() {
    clearInterval(cycle);
    button.innerText = 'Continue';
    console.log('Continue in pauseCountdown!');
    button.removeEventListener('click', pauseCountdown);
    button.addEventListener('click', resumeSession);
}

function resumeSession() {
    console.log('resume-Funktion');
    button.innerText = 'Stop';
    button.removeEventListener('click', resumeSession);
    button.addEventListener('click', pauseCountdown);
    startCountdown(getEnd());
}

function startPause() {
    console.log('Pause wurde gestartet!')
    button.innerText = 'Stop';
    end = getEnd(pauseTime);
    button.removeEventListener('click', startPause);
    button.addEventListener('click', pauseCountdown);
    startCountdown(end);
}

function displayCounter(min, sec){

    if(min < 10 && sec < 10){
        counter.innerText = '0' + min + ':0'  + sec;
    }
    if(min < 10 && sec >= 10){
        counter.innerText = '0' + min + ':' + sec;
    }
    if(min >= 10 && sec < 10){
        counter.innerText = min + ':' + '0' + sec;
    }
    if(min >= 10 && sec >=10){
        counter.innerText = min + ':' + sec;
    }
}

function openSettings(){
    console.log('Einstellungen wurden geöffnet!');
    saveButton.style.backgroundColor = 'rgb(204, 22, 62)';
    saveButton.style.color= 'white';
    saveButton.style.fontFamily= 'Chakra Petch'
    container.style.display = 'none';
    settings.style.display = 'block';    
}

function closeSettings(){
    console.log('Einstellungen wurden geschlossen');
    settings.style.display = 'none';
    container.style.display = 'flex';
}

function saveIntervals(){
    console.log('Speichert die Einstellungen');
    //Werte in die Anwendung eingeben
    workTime = parseInt(document.querySelector('#cycleInput').value);
    pauseTime = parseInt(document.querySelector('#pauseInput').value);
    longPause = parseInt(document.querySelector('#longPauseIntervall').value);
    longPauseTime =parseInt(document.querySelector('#longPauseInput').value);
    displayCounter(workTime,0);

    //Werte für Anzeige abspeichern
    document.querySelector('#cycleInput').setAttribute('value',workTime);
    document.querySelector('#pauseInput').setAttribute('value',pauseTime);
    document.querySelector('#longPauseIntervall').setAttribute('value',longPause);
    document.querySelector('#longPauseInput').setAttribute('value',longPauseTime);    

    closeSettings();
}

function checkLongBreak(counterLongPause){
    if(counterLongPause == longPause){
        return true; 
    }
    else{
        return false;
    }
}

function startLongBreak(){
    displayCounter(longPauseTime,0);
    button.innerText = 'Start'
    button.removeEventListener('click', pauseCountdown);
    button.addEventListener('click', startPause());// muss korrigiert werden
}

function setBackGroundColor(state){
    switch(state){
        case 'work':
            container.style.backgroundColor = 'grey';
            break;
        case 'pause':
            container.style.backgroundColor = 'green';
            break;
        case 'longBreak':
            container.style.backgroundColor = 'orange';
    }
}

function checkNextCycle(counterLongPause, state){
    switch(state){
        case 'work':
            if(checkLongBreak(counterLongPause)){
                state = 'longBreak';
            }
            else{
                state = 'pause';
            }
            return state;
        case 'pause':
            state = 'work'
            return state;
        case 'longBreak':
            state = 'work';
            return state;
    }
}
















