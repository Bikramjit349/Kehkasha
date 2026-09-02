document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const songs = [
        {
            title: "Honey, I'm good",
            artist: "Artist Name",
            mood: "happy",
            src: "Audio/Honey, I'm Good.mp3",
            image: "img/andy.jpg"
        },

        {
            title: "Shut Up and Dance with.mp3",
            artist: "Artist Name",
            mood: "happy",
            src: "Audio/Shut Up and Dance .mp3",
            image: "img/Shut.jpg"
        },

        {
            title: "Apna bana le ",
            artist: "Arijit Singh",
            mood: "romantic",
            src: "Audio/Apna Bana Le .mp3",
            image: "img/apna.jpg"
        },

        {
            title: "Ishq wala love",
            artist: "Stephen Sanchez",
            mood: "romantic",
            src: "Audio/Ishq Wala Love.mp3",
            image: "img/Ishq wala love.jpg"
        },

        {
            title: "Chill Vibes",
            artist: "Artist Name",
            mood: "chill",
            src: "audio/chill-vibes.mp3",
            image: "images/chill-vibes.jpg"
        },

        {
            title: "Relax",
            artist: "Artist Name",
            mood: "chill",
            src: "Oye Boy Charlie .mp3",
            image: "images/relax.jpg"
        },

        {
            title: "Dhinka Chika",
            artist: "Artist Name",
            mood: "energetic",
            src: "Audio/Dhinka Chika Ready .mp3",
            image: "img/ready.jpg"
        },

        {
            title: "Uptown Funk",
            artist: "Bruno Mars",
            mood: "energetic",
            src: "Audio/Uptown Funk.mp3",
            image: "img/funk.png"
        },

        {
            title: "Kaise Hua",
            artist: "Vishal Mishra",
            mood: "sad",
            src: "Audio/Kaise Hua Kabir Singh 320 Kbps.mp3",
            image: "images/the-night-we-met.jpg"
        },


        {
            title: "Someone You Loved",
            artist: "Lewis Capaldi",
            mood: "sad",
            src: "audio/someone-you-loved.mp3",
            image: "images/someone-you-loved.jpg"
        },

        {
            title: "Line without hook",
            artist: "Ricky Montgomery",
            mood: "late-night",
            src: "Audio/Ricky Montgomery .mp3",
            image: "images/night-changes.jpg"
        },

        {
            title: "After Dark",
            artist: "Mr.Kitty",
            mood: "late-night",
            src: "audio/after-dark.mp3",
            image: "images/after-dark.jpg"
        }

    ];


    const moodThemes = {


        happy: {
            primary: "#ffd785",
            soft: "rgba(255,215,133,0.16)",
            dim: "rgba(255,215,133,0.08)"
        },

        romantic: {
            primary: "#e91733",
            soft: "rgbrgb(38, 189, 71)43,172,0.16)",
            dim: "rgba(255,143,172,0.08)"
        },

        chill: {
            primary: "#8bd8d2",
            soft: "rgba(139,216,210,0.16)",
            dim: "rgba(139,216,210,0.08)"
        },

        energetic: {
            primary: "#f4f81d",
            soft: "rgba(255,112,189,0.16)",
            dim: "rgba(255,112,189,0.08)"
        },

        sad: {
            primary: "#8bb8ff",
            soft: "rgba(139,184,255,0.16)",
            dim: "rgba(139,184,255,0.08)"
        },

        "late-night": {
            primary: "#aaa3ff",
            soft: "rgba(170,163,255,0.16)",
            dim: "rgba(170,163,255,0.08)"
        }
    };

    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.65
    let currentSongIndex = 0;
    let currentMood = "happy";
    let currentPlaylist = [];
    let shuffle = false;
    let repeat = false;
    let isSeeking = false;
    const playButton =
        document.querySelector(".play-button");
    const previousButton =
        document.querySelector(
            ".player-controls button:nth-child(2)"
        );
    const nextButton =
        document.querySelector(
            ".player-controls button:nth-child(4)"
        );
    const shuffleButton =
        document.querySelector(
            ".player-controls button:nth-child(1)"
        );
    const repeatButton =
        document.querySelector(
            ".player-controls button:nth-child(5)"
        );
    const progressBar =
        document.querySelector(".progress-bar");
    const volumeBar =
        document.querySelector(".volume-bar");
    const currentImage =
        document.querySelector(
            ".current-song > img"
        );
    const currentTitle =
        document.querySelector(
            ".current-song-info h4"
        );
    const currentArtist =
        document.querySelector(
            ".current-song-info p"
        );
    const timeLabels =
        document.querySelectorAll(
            ".progress-container span"
        );
    const currentTimeLabel =
        timeLabels[0];
    const durationLabel =
        timeLabels[1];
    const favoriteButton =
        document.querySelector(
            ".favorite-button"
        );
    const searchInput =
        document.querySelector(
            ".search-box input"
        );
    const moodCards =
        document.querySelectorAll(
            ".mood-card"
        );
    const dots =
        document.querySelectorAll(
            ".dot"
        );
    const surpriseButtons =
        document.querySelectorAll(
            ".surprise-button"
        );

    let favorites = JSON.parse(
        localStorage.getItem(
            "moodscapeFavorites"
        ) || "[]"
    );

    function formatTime(seconds) {
        if (
            !Number.isFinite(seconds) ||
            seconds < 0
        ) {
            return "0:00";
        }
        const minutes =
            Math.floor(seconds / 60);
        const remaining =
            Math.floor(seconds % 60);
        return (
            minutes +
            ":" +
            String(remaining).padStart(
                2,
                "0"
            )
        );
    }

    function getCurrentSong() {
        return currentPlaylist[
            currentSongIndex
        ];
    }

    function createMoodPlaylist(mood) {
        currentPlaylist =
            songs.filter(
                song =>
                    song.mood === mood
            );
        currentSongIndex = 0;
        console.log(
            `Mood: ${mood}`
        );
        console.log(
            `Songs found: ${currentPlaylist.length}`
        );
    }

    function loadSong(
        index = 0,
        autoplay = false
    ) {

        if (
            currentPlaylist.length === 0
        ) {

            console.warn(
                `No songs found for mood: ${currentMood}`
            );
            return;
        }
        currentSongIndex =
            (
                index +
                currentPlaylist.length
            ) %
            currentPlaylist.length;
        const song =
            getCurrentSong();
        audio.src =
            song.src;
        audio.load();
        if (currentTitle) {
            currentTitle.textContent =
                song.title;
        }
        if (currentArtist) {
            currentArtist.textContent =
                song.artist;
        }
        if (currentImage) {
         currentImage.src =
                song.image;
            currentImage.alt =
                song.title;
        }
        if (progressBar) {
            progressBar.value = 0;
        }
        if (currentTimeLabel) {
            currentTimeLabel.textContent = "0:00";
        }
        if (durationLabel) {
            durationLabel.textContent = "0:00";
        }
        updateFavoriteButton();
        if (autoplay) {
            playSong();
        }
    }

    async function playSong() {
        try {
            await audio.play();
            if (playButton) {
                playButton.textContent =
                    "❚❚";
            }
            updateTopPicks();
        } catch (error) {
            console.warn(
                "Could not play:",
                getCurrentSong()?.src
            );
            if (playButton) {
                playButton.textContent =
                    "▶";
            }
        }
    }

    function pauseSong() {
        audio.pause();
        if (playButton) {
            playButton.textContent = "▶";
        }
        updateTopPicks();
    }

    function togglePlay() {
        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }
    }

    function nextSong() {
        if (
            currentPlaylist.length === 0
        ) {
            return;
        }

        if (shuffle) {
            let randomIndex;
            do {
                randomIndex =
                    Math.floor(
                        Math.random() *
                        currentPlaylist.length
                    );
            } while (
                currentPlaylist.length > 1 &&
                randomIndex ===
                    currentSongIndex
            );
            loadSong(
                randomIndex,
                true
            );
            return;
        }
        loadSong(
            currentSongIndex + 1,
            true
        );
    }

    function previousSong() {
        if (
            audio.currentTime > 3
        ) {
            audio.currentTime =
                0;
            return;
        }

        loadSong(
            currentSongIndex - 1,
            true
        );
    }

    playButton?.addEventListener(
        "click",
        togglePlay
    );

    nextButton?.addEventListener(
        "click",
        nextSong
    );

    previousButton?.addEventListener(
        "click",
        previousSong
    );

    shuffleButton?.addEventListener(
        "click",
        () => {

            shuffle =
                !shuffle;

            shuffleButton.style.color =
                shuffle
                    ? "var(--mood-primary)"
                    : "";
        }
    );

    repeatButton?.addEventListener(
        "click",
        () => {

            repeat =
                !repeat;

            audio.loop =
                repeat;

            repeatButton.style.color =
                repeat
                    ? "var(--mood-primary)"
                    : "";
        }
    );

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                isSeeking
            ) {
                return;
            }

            if (
                !Number.isFinite(
                    audio.duration
                )
            ) {
                return;
            }

            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

            if (progressBar) {
                progressBar.value =
                    percentage;
            }

            if (currentTimeLabel) {
                currentTimeLabel.textContent =
                    formatTime(
                        audio.currentTime
                    );
            }
            if (durationLabel) {
                durationLabel.textContent =
                    formatTime(
                        audio.duration
                    );
            }
        }
    );

    audio.addEventListener(
        "loadedmetadata",
        () => {
            if (durationLabel) {
                durationLabel.textContent =
                    formatTime(
                        audio.duration
                    );
            }
        }
    );

    audio.addEventListener(
        "ended",
        () => {
            if (!repeat) {
                nextSong();
            }
        }
    );

    progressBar?.addEventListener(
        "input",
        () => {
            isSeeking = true;
            if (
                Number.isFinite(
                    audio.duration
                )
            ) {
                const time =
                    (
                        Number(
                            progressBar.value
                        ) / 100
                    ) *
                    audio.duration;
                if (
                    currentTimeLabel
                ) {
                    currentTimeLabel.textContent =
                        formatTime(
                            time
                        );
                }
            }
        }
    );

    progressBar?.addEventListener(
        "change",
        () => {

            if (
                Number.isFinite(
                    audio.duration
                )
            ) {
                audio.currentTime =
                    (
                        Number(
                            progressBar.value
                        ) / 100
                    ) *
                    audio.duration;
            }
            isSeeking = false;
        }
    );

    progressBar?.addEventListener(
        "pointerdown",
        () => {


            isSeeking = true;
        }
    );

    progressBar?.addEventListener(
        "pointerup",
        () => {


            isSeeking = false;
        }
    );

    volumeBar?.addEventListener(
        "input",
        () => {


            audio.volume =
                Number(
                    volumeBar.value
                ) / 100;
        }
    );

    function updateFavoriteButton() {
        if (!favoriteButton) {
            return;
        }
        const song =
            getCurrentSong();
        if (!song) {
            return;
        }

        const isFavorite =
            favorites.includes(
                song.title
            );

        favoriteButton.textContent =
            isFavorite
                ? "♥"
                : "♡";


        favoriteButton.style.color =
            isFavorite
                ? "var(--mood-primary)"
                : "";
    }

    favoriteButton?.addEventListener(
        "click",
        () => {

            const song =
                getCurrentSong();

            if (!song) {
                return;
            }

            const title =
                song.title;

            if (
                favorites.includes(
                    title
                )
            ) {

                favorites =
                    favorites.filter(
                        item =>
                            item !==
                            title
                    );

            } else {

                favorites.push(
                    title
                );
            }

            localStorage.setItem(
                "moodscapeFavorites",
                JSON.stringify(
                    favorites
                )
            );

            updateFavoriteButton();
        }
    );

    function selectMood(
        mood,
        autoplay = false
    ) {

        if (
            !moodThemes[mood]
        ) {
            return;
        }

        currentMood =
            mood;

        const theme =
            moodThemes[mood];


        document.documentElement
            .style
            .setProperty(
                "--mood-primary",
                theme.primary
            );

        document.documentElement
            .style
            .setProperty(
                "--mood-primary-soft",
                theme.soft
            );

        document.documentElement
            .style
            .setProperty(
                "--mood-primary-dim",
                theme.dim
            );

        moodCards.forEach(
            card => {


                card.classList.remove(
                    "selected"
                );
            }
        );


        const selectedCard =
            document.querySelector(
                `.mood-card.${CSS.escape(
                    mood
                )}`
            );

        selectedCard?.classList.add(
            "selected"
        );

        createMoodPlaylist(
            mood
        );

        loadSong(
            0,
            autoplay
        );

        localStorage.setItem(
            "moodscapeMood",
            mood
        );

        const moodIndex =
            [...moodCards].findIndex(
                card =>
                    card.classList.contains(
                        mood
                    )
            );

        dots.forEach(
            dot =>
                dot.classList.remove(
                    "active"
                )
        );

        if (
            moodIndex >= 0 &&
            dots.length
        ) {

            dots[
                moodIndex %
                dots.length
            ]?.classList.add(
                "active"
            );
        }
    }

    moodCards.forEach(
        card => {
            card.addEventListener(
                "click",
                () => {

                    const mood =
                        [...card.classList]
                            .find(
                                className =>
                                    moodThemes[
                                        className
                                    ]
                            );

                    if (!mood) {
                        return;
                    }

                    selectMood(
                        mood,
                        true
                    );
                }
            );
        }
    );

    function updateTopPicks() {
        const topPicks =
            document.querySelector(
                ".top-picks"
            );
        if (!topPicks) {
            return;
        }

        const heading =
            topPicks.querySelector(
                ".section-heading"
            );
        topPicks.innerHTML =
            "";
        if (heading) {
            topPicks.appendChild(
                heading
            );
        }

        const visibleSongs =
            currentPlaylist.slice(
                0,
                4
            );
        visibleSongs.forEach(
            (song, index) => {
                const item =
                    document.createElement(
                        "div"
                    );
                item.className =
                    "song-item";
                item.innerHTML = `
                    <img
                        src="${song.image}"
                        alt="${song.title}"
                    >
                    <div class="song-details">
                        <h4>
                            ${song.title}
                        </h4>

                        <p>
                            ${song.artist}
                        </p>
                    </div>
                    <span class="song-time">
                        --
                    </span>
                    <button
                        class="play-small"
                        aria-label="Play ${song.title}"
                    >
                        ▶
                    </button>
                `;

                const button =
                    item.querySelector(
                        ".play-small"
                    );
                button.addEventListener(
                    "click",
                    event => {
                        event.stopPropagation();
                        const playlistIndex =
                            currentPlaylist.indexOf(
                                song
                            );
                        if (
                            playlistIndex ===
                                currentSongIndex &&
                            !audio.paused
                        ) {
                           pauseSong();
                        } else {
                            loadSong(
                                playlistIndex,
                                true
                            );
                        }
                    }
                );

                item.addEventListener(
                    "click",
                    () => {
                        const playlistIndex =
                            currentPlaylist.indexOf(
                                song
                            );
                        loadSong(
                            playlistIndex,
                            true
                        );
                    }
                );
                topPicks.appendChild(
                    item
                );
            }
        );
    }

    surpriseButtons.forEach(
        button => {
            button.addEventListener(
                "click",
                () => {
                    if (
                        currentPlaylist.length ===
                        0
                    ) {
                        return;
                    }
                    let randomIndex;
                    do {


                        randomIndex =
                            Math.floor(
                                Math.random() *
                                currentPlaylist.length
                            );


                    } while (
                        currentPlaylist.length >
                            1 &&
                        randomIndex ===
                            currentSongIndex
                    );
                    loadSong(
                        randomIndex,
                        true
                    );
                    button.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(.95)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 300,
                            easing:
                                "ease-out"
                        }
                    );
                }
            );
        }
    );

    searchInput?.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();
            document
                .querySelectorAll(
                    ".song-item"
                )
                .forEach(
                    item => {
                        const title =
                            item.querySelector(
                                ".song-details h4"
                            )
                                ?.textContent
                                .toLowerCase();
                        const artist =
                            item.querySelector(
                                ".song-details p"
                            )
                                ?.textContent
                                .toLowerCase();
                        const matches =
                            !query ||
                            title?.includes(
                                query
                            ) ||
                            artist?.includes(
                                query
                            );
                        item.style.display =
                            matches
                                ? ""
                                : "none";
                    }
                );
        }
    );
    document.addEventListener(
        "keydown",
        event => {
            const tag =
                document.activeElement
                    ?.tagName;
            if (
                tag === "INPUT" ||
                tag === "TEXTAREA"
            ) {
                return;
            }
            if (
                event.code === "Space"
            ) {
                event.preventDefault();
                togglePlay();
            }
            if (
                event.code ===
                "ArrowRight"
            ) {
                nextSong();
            }
            if (
                event.code ===
                "ArrowLeft"
            ) {
                previousSong();
            }
        }
    );
    const savedMood =
        localStorage.getItem(
            "moodscapeMood"
        );
    if (
        savedMood &&
        moodThemes[savedMood]
    ) {
        selectMood(
            savedMood,
            false
        );
    } else {
        selectMood(
            "happy",
            false
        );
    }
    if (volumeBar) {
        volumeBar.value = 65;
        audio.volume = 0.65;
    }
    console.log(
        "🎵 Moodscape mood player ready!"
    );


});
