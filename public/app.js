async function loadVideos() {
    const res = await fetch("/videos");
    const videos = await res.json();

    const container = document.getElementById("videos");
    container.innerHTML = "";

    videos.forEach(video => {
    container.innerHTML += `
        <div class="video-card">
            <video class="thumb" controls>
                <source src="/uploads/${video.name}" type="video/mp4">
            </video>

            <div class="video-info">
                <h3>${video.name}</h3>
            </div>
        </div>
    `;
});
}

loadVideos();