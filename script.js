// Save username and video link and move to player page
function startWatching() {
  const roomId = document.getElementById('roomId').value;
  const username = document.getElementById('username').value;
  const videoURL = document.getElementById('videoURL').value;

  if (!roomId || !username || !videoURL) {
    alert("Please fill all fields!");
    return;
  }

  localStorage.setItem('roomId', roomId);
  localStorage.setItem('username', username);

  // Save video URL to Firebase under Room ID
  db.ref('rooms/' + roomId).set({
    videoURL: videoURL
  });

  window.location.href = 'player.html';
}

if (window.location.pathname.includes('player.html')) {
  const roomId = localStorage.getItem('roomId');
  const username = localStorage.getItem('username');

  if (roomId && username) {
    document.getElementById('usernameDisplay').innerText = `${username} is watching:`;

    // Listen to video URL changes
    db.ref('rooms/' + roomId).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && data.videoURL) {
        let videoURL = data.videoURL;
        let videoId = '';

        if (videoURL.includes("youtu.be/")) {
          videoId = videoURL.split("youtu.be/")[1];
        } else if (videoURL.includes("v=")) {
          videoId = videoURL.split("v=")[1].split("&")[0];
        }

        const iframe = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        document.getElementById('videoContainer').innerHTML = iframe;
      }
    });
  }
}
