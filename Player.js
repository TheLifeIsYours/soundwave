class Player {
  song
  songData
  songIndex
  isLoaded=false
  loadedPercentage=0.0
  playList
  volume
  autoPlay
  logging=true


  constructor() {
    this.volume = Number(localStorage.getItem('volume')) || 0.05
    this.songIndex = Number(localStorage.getItem('songIndex')) || 0
    this.autoPlay = localStorage.getItem('autoplay') || true
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      await this.getPlayList()
      await this.set(this.songIndex)
      this.toggleAutoPlay(this.autoPlay)
      resolve(true)
    })
  }
  
  update(){

  }

  toggleAutoPlay(state) {
    if(state){
      this.song.onended(() => {
        if(
          this.isLoaded && 
          this.song.isPlaying() &&
          this.song.currentTime() >= this.song.duration() * 0.85
        ) {
          this.isLoaded = false
          this.next()

          if(this.logging) console.log(`Auto played next song`)
        }
      }) 
    } else {
      this.song.onended(undefined)
    }

    localStorage.setItem("autoplay", this.autoPlay)
    if(this.logging) console.log(`Auto play toggled ${state ? "on" : "off"}`)
  }
  
  async set(songIndex) {
    return new Promise(async (resolve, reject) => {
      localStorage.setItem("songIndex", (songIndex || this.songIndex))

      this.songData = this.playList[(songIndex || this.songIndex)]
      this.song = await this.load()
      
      this.toggleAutoPlay(this.autoPlay)
      this.isLoaded = true
      this.play()
      resolve(this.isLoaded)
    }).catch((err) => {
      console.error(err)
    })

  }

  play() {
    if(!this.song.isPlaying()) {
      this.song.play()
      this.setVolume()
    }
  }

  pause() {
    if(this.song.isPlaying()) {
      this.song.pause()
    }
  }

  toggle() {
    this.song.isPlaying() ? this.pause() : this.play()
  }

  next() {
    this.song.stop()
    this.songIndex = this.songIndex + 1 < this.playList.length ? this.songIndex + 1 : 0
    this.set()

    if(this.logging) console.log("Playing next song")
  }

  prev() {
    this.song.stop()
    this.songIndex = this.songIndex - 1 >= 0 ? this.songIndex - 1 : this.playList.length - 1
    this.set()

    if(this.logging) console.log("Playing previous song")
  }

  durationText() {
    let t = this.song.duration()
    let m = Math.floor(t / 60);
    let s = Math.floor(t % 60);

    if(s <= 9){
      s = "0"+s;
    }

    return m+":"+s;
  }


  forward(time) {
    this.song.jump(this.song.currentTime() + (time || 15))
    
    if(this.logging) console.log(`forwarded ${(time || 15)}`)
  }

  rewind(time) {
    this.song.jump(this.song.currentTime() - (time || 5))
    
    if(this.logging) console.log(`rewound ${(time || 5)}`)
  }

  setVolume(volume) {
    volume = volume || this.volume
    if(volume !== 0) volume = Number(volume.toFixed(2))

    this.song.setVolume(volume)
    localStorage.setItem('volume', volume)

    if(this.logging) console.log(`volume set ${(volume || this.volume)}`)
  }

  volumeUp() {
    this.volume = constrain(this.volume + 0.05, 0.000001, 1)
    this.setVolume()
  }

  volumeDown() {
    this.volume = constrain(this.volume - 0.05, 0.000001, 1)
    this.setVolume()
  }

  load() {
    return new Promise((resolve, reject) => {
      loadSound(`/assets/audio/${this.songData.path}`,
        resolve,
        reject,
        this.loading
      )
    }).catch((err) => {
      console.log(`Error while loading song: ${err}`)
    })
  }

  loading(percent) {
    this.loadedPercentage = percent
    this.isLoaded = false
  }
  
  async getPlayList() {
    let data = await fetch('/assets/audio/index.json')
    data = await data.json()

    this.playList = data;
  }
}