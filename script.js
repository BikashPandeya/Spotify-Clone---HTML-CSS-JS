console.log("Lets write some js");


async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/mysongs/")
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mpeg")) {
            songs.push(element.href.split("/mysongs/")[1])
        }
    }
    return songs;
}

async function main() {

    //To get the list of all the songs
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    console.log(songUL);
    

  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML+`<li>${song.replaceAll("%20" , " ")}</li>`
    
  }
    //Play the first song

    var audio = new Audio(songs[0]);
    // audio.play();
     
    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration);
        //The duration variable hols the duration (in seconds ) of the audio clip 
    })
} 
main() 