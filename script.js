particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ff0000"
      },
      "shape": {
        "type": "circle"
      },
      "opacity": {
        "value": 0.5,
        "random": true
      },
      "size": {
        "value": 3,
        "random": true
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ff0000",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      }
    },
    "retina_detect": true
  }
);

VanillaTilt.init(document.querySelectorAll(".song"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
});

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayers = document.querySelectorAll('audio');
    const cdDiscs = document.querySelectorAll('.cd-disc');
    const trackName = document.querySelector('.track-name');

    function stopAllSongs() {
        audioPlayers.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        cdDiscs.forEach(disc => disc.classList.remove('playing'));
    }

    audioPlayers.forEach((audio, index) => {
        audio.removeEventListener('play', () => {});
        
        audio.addEventListener('play', () => {
            stopAllSongs();
            audio.play();
            cdDiscs[index].classList.add('playing');
            const title = audio.closest('.track-item').querySelector('.track-title').textContent;
            trackName.textContent = title;
        });

        audio.addEventListener('pause', () => {
            cdDiscs[index].classList.remove('playing');
            if (!Array.from(audioPlayers).some(a => !a.paused)) {
                trackName.textContent = 'Select a track';
            }
        });
    });

    document.getElementById('playAll').addEventListener('click', () => {
        stopAllSongs();
        audioPlayers[0].play();
    });

    document.getElementById('pauseAll').addEventListener('click', () => {
        stopAllSongs();
        trackName.textContent = 'Select a track';
    });

    document.getElementById('shuffle').addEventListener('click', () => {
        stopAllSongs();
        
        const trackList = document.querySelector('.track-list');
        const tracks = Array.from(trackList.children);
        
        for (let i = tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            trackList.appendChild(tracks[j]);
        }
        
        tracks.forEach((track, index) => {
            const numberElement = track.querySelector('.track-number');
            numberElement.textContent = String(index + 1).padStart(2, '0');
        });

        trackName.textContent = 'Select a track';
    });

    const style = document.createElement('style');
    style.textContent = `
        .song.playing {
            border: 1px solid var(--primary);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
        }
        
        .song.playing .song-number {
            color: var(--primary);
            animation: numberPulse 1.5s infinite;
        }

        @keyframes numberPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('.song').forEach(song => {
        song.addEventListener('mousemove', (e) => {
            const rect = song.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            song.style.transform = `
                translateY(-10px)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                scale(1.02)
            `;
        });
        
        song.addEventListener('mouseleave', () => {
            song.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });

    function updatePlayingState(isPlaying) {
        const cdCollection = document.querySelector('.cd-collection');
        const allDiscs = document.querySelectorAll('.cd-visual');
        
        if (isPlaying) {
            cdCollection.classList.add('playing');
            allDiscs.forEach(disc => disc.classList.add('playing'));
        } else {
            cdCollection.classList.remove('playing');
            allDiscs.forEach(disc => disc.classList.remove('playing'));
        }
    }
});
