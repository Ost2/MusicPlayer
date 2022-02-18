/**
    * 1. Render songs
    * 2. Scroll top
    * 3. Play / Pause / seek
    * 4. CD rotate
    * 5. Next / prev
    * 6. Random
    * 7. Next / Repeat when ended
    * 8. Active song
    * 9. Scroll active song into view
    * 10. Play song when click
    */
const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: "海市蜃樓 (抖音版)",
            singer: "MAKS",
            path: "./assets/music/AoAnh.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e02f8fd369bdfebd51adaf20f3c"
        },
        {
            name: "微微",
            singer: "傅如乔",
            path: "./assets/music/Vivi.mp3",
            image:
                "https://i.scdn.co/image/ab67616d00001e02bc532c75d81e01e93e3eee3d"
        },
        {
            name: "那女孩对我说",
            singer: "Uu",
            path:
                "./assets/music/shetoldme.mp3",
            image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRFLRVZJYxKrYAzWJo300gH5IjZpvg-6fjRScVJBMf5NF6QdDb2"
        },
        {
            name: "飞鸟和蝉",
            singer: "Ren ran",
            path: "./assets/music/phidieuvavesau.mp3",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfLl5wtt3jwxe1PfeaqIPw2e18jb961Sc3sQHUhHdE-MsYem-"
        },
        {
            name: "R&B All Night",
            singer: "Lưu Nghiêu Nghiêu",
            path: "./assets/music/r&ballnight.mp3",
            image:
                "https://i.ytimg.com/vi/iRAEWV2jCsk/mqdefault.jpg"
        },
        {
            name: "爱殇",
            singer: "小时姑娘",
            path: "./assets/music/aithuong.mp3",
            image:
                "https://scontent.fhan5-11.fna.fbcdn.net/v/t1.15752-9/270130396_456374839478490_616987971310461920_n.png?_nc_cat=111&ccb=1-5&_nc_sid=ae9488&_nc_ohc=1cmzVyVBpoQAX-g9MAX&tn=ZdTirAqgYq4gnion&_nc_ht=scontent.fhan5-11.fna&oh=03_AVLDvRi-2AcZiA2gi3ncYfz1HWQCAKFLkX2MJiBDtwWMKA&oe=6226433C"
        },
        {
            name: "四块五",
            singer: "Lão Phàn Cách Vách",
            path: "./assets/music/4dong5.mp3",
            image:
                "https://scontent.fsgn5-12.fna.fbcdn.net/v/t1.6435-9/p960x960/52426939_1992534557468300_6229840132883611648_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=e3f864&_nc_ohc=Yu33BXAaKh4AX97Qf8u&_nc_ht=scontent.fsgn5-12.fna&oh=00_AT9upFkm8fAtkfXdta_MYJr9Ru_SaVuXGyuQyKToA1yO4g&oe=62274427"
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')"></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;

        })
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay /dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth > cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // Khi bài hát bị Pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function (e) {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát
        prevBtn.onclick = function (e) {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý bật/tắt random bài hát
        randomBtn.onclick = function () {
           _this.isRandom = !_this.isRandom
           _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //  Xử lý lặp lại một bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //  Xử lý next song khi audo ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click() // Tự động ấn vào nút next bài hát
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()


                }

                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {

                }
                
            }
        }

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên của UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
};

app.start();


