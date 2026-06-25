async function loadVideos() {
    const res = await fetch("/videos");
    const videos = await res.json();

    const container = document.getElementById("videos");
    container.innerHTML = "";

    videos.forEach(video => {
        container.innerHTML += `
            <div class="video-card" onclick="openVideo(${video.id})">
                <img src="${video.thumbnail ? '/uploads/' + video.thumbnail : 'https://via.placeholder.com/400x220?text=No+Thumbnail'}" class="thumb">

                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                </div>
            </div>
        `;
    });
}

function openVideo(id) {
    window.location.href = "/watch.html?id=" + id;
}

loadVideos();
