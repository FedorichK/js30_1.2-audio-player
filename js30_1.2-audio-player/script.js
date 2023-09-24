let tracks = ["track1.mp3", "track2.mp3", "track3.mp3"];
let trackTitles = ["Ed Sheeran - Shape of You", "Haddaway - What Is Love", "Robert Cristian x @alisshuka - In The End"];
let images = ["image1.jpg", "image2.jpg", "image3.jpg"];
let index = 0; // Current file and image index
let audio = document.getElementById('audio');
let progressBar = document.getElementById('progress-bar');
let playPauseButton = document.getElementById('play-pause-button');
// New time elements
let currentTimeDisplay = document.getElementById('current-time');
let durationDisplay = document.getElementById('duration');
// New track title element
let trackTitleDisplay = document.getElementById('track-title');

audio.addEventListener('ended', nextTrack);
audio.addEventListener('timeupdate', updateProgressBar);
progressBar.addEventListener('input', changeProgressBar);

function playPause() {
    if (audio.paused) {
        if (!audioContext) {
            startAudioContext();
        }
        audio.play();
        playPauseButton.innerHTML = "❚❚";
    } else {
        audio.pause();
        playPauseButton.innerHTML = "►";
    }
}

function nextTrack() { // Switch to the next track
    index++;
    if (index >= tracks.length) index = 0;
    document.getElementById('src').src = tracks[index];
    document.getElementById('player-wrapper').style.backgroundImage = "url('" + images[index] + "')";
    // Update track title
    trackTitleDisplay.textContent = trackTitles[index];
    audio.load();
    audio.play(); // Start playing the track immediately
    playPauseButton.innerHTML = "❚❚"; // Change the button to show the pause icon
}

function prevTrack() { // Switch to the previous track
    index--;
    if (index < 0) index = tracks.length - 1;
    document.getElementById('src').src = tracks[index];
    document.getElementById('player-wrapper').style.backgroundImage = "url('" + images[index] + "')";
    // Update track title
    trackTitleDisplay.textContent = trackTitles[index];
    audio.load();
    audio.play(); // Start playing the track immediately
    playPauseButton.innerHTML = "❚❚"; // Change the button to show the pause icon
}

function updateProgressBar() { // Update the progress bar
   if(audio.duration) {
       let progress = Math.floor((100 / audio.duration) * audio.currentTime);
       progressBar.value = progress;
       // Update time display
       currentTimeDisplay.textContent = formatTime(audio.currentTime);
       durationDisplay.textContent = formatTime(audio.duration);
   }
}

function changeProgressBar() { // Change the current time of the audio when the progress bar changes
   if(audio.duration) {
       audio.currentTime = (progressBar.value / 100) * audio.duration;
   }
}

// New function to format time in minutes and seconds
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
 }

let audioContext;
let analyser;
let dataArray;
let source;

function startAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source = audioContext.createMediaElementSource(document.getElementById('audio'));
    source.connect(analyser);
    analyser.connect(audioContext.destination);
}

function drawEqualizer() {
    requestAnimationFrame(drawEqualizer);
    analyser.getByteFrequencyData(dataArray);

    let canvas = document.getElementById('equalizer');
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // transparent background

    let barWidth = (canvas.width / analyser.frequencyBinCount) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < analyser.frequencyBinCount; i++) {
        barHeight = dataArray[i];
        context.fillStyle = 'orange'; // orange bars
        context.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight/2);
        x += barWidth + 1;
    }
}

function toggleEqualizer() {
    if(equalizer.style.display === 'none') {
        equalizer.style.display = 'block';
        drawEqualizer();
    } else {
        equalizer.style.display = 'none';
    }
}
