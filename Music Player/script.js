const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volume = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');
const visualizer = document.querySelector('.music-visualizer');

const songs = [
  {
    title: "Acoustic Breeze",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    poster: "https://www.bensound.com/bensound-img/acousticbreeze.jpg"
  },
  {
    title: "Creative Minds",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    poster: "https://www.bensound.com/bensound-img/creativeminds.jpg"
  },
  {
    title: "Sunny",
    artist: "Bensound",
    file: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
    poster: "https://www.bensound.com/bensound-img/sunny.jpg"
  }
];



let songIndex = 0;
let isPlaying = false;

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.file;
  document.getElementById("poster").src = song.poster;
  updatePlaylistHighlight();
}


function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  visualizer.style.animationPlayState = 'running';
  visualizer.style.opacity = '0.5';
  updatePlaylistHighlight(); // ✅ add this
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  visualizer.style.animationPlayState = 'paused';
  visualizer.style.opacity = '0.3';
  updatePlaylistHighlight(); // ✅ add this
}



playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

prevBtn.addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  progress.value = (currentTime / duration) * 100;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener('input', () => {
  audio.volume = volume.value;
});

audio.addEventListener('ended', () => {
  nextBtn.click(); // autoplay next song
});

// Format time in mm:ss
function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Playlist UI
function updatePlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(song);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll('li');

  items.forEach((item, index) => {
    item.classList.remove('active');
    item.innerHTML = `${songs[index].title} - ${songs[index].artist}`;

    if (index === songIndex) {
      item.classList.add('active');

      const icon = isPlaying
        ? `<span class="equalizer">
             <span></span><span></span><span></span>
           </span>`
        : `<i class="fas fa-pause-circle pause-icon"></i>`;

      item.innerHTML = `${icon} ${songs[index].title} - ${songs[index].artist}`;
    }
  });
}



loadSong(songs[songIndex]);
updatePlaylist();
