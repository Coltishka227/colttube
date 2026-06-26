async function loadVideos() {
    const res = await fetch("/videos");
    const videos = await res.json();

    const container = document.getElementById("videos");
    container.innerHTML = "";

    videos.forEach(video => {
        container.innerHTML += `
            <div class="video-card">
                <video class="thumb" controls width="400">
                    <source src="${video.url}" type="video/mp4">
                </video>

                <div class="video-info">
                    <h3>${video.name}</h3>
                    <p>Видео ColtTube</p>
                </div>
            </div>
        `;
    });
}

loadVideos();