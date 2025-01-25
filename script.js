console.log("Lets write some js");
// Define a single Audio object to manage playback globally
let currentsong = new Audio();
let currentfolder;


function convertSecondsToMinutes(seconds) {

    if (isNaN(seconds)) {
        return "00:00"
    }
    // Use Math.floor to remove the decimal part of the seconds
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes
    const minutes = Math.floor(totalSeconds / 60);

    // Calculate remaining seconds
    const remainingSeconds = totalSeconds % 60;

    // Format seconds to always be two digits (e.g., 05 instead of 5)
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    // Return the formatted string
    return `${minutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

    // Perform a GET request to the specified URL (http://127.0.0.1:3000/mysongs/)
    // 'fetch' is used to retrieve data from the server or API endpoint.
    // 'await' pauses the execution until the fetch operation completes.
    // This will return a Response object containing details of the HTTP response.
    let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    currentfolder = folder;

    // Log the Response object to the console to inspect its properties.
    // The Response object contains information like status, headers, etc.
    // console.log(a);

    // Extract the response body as plain text.
    // 'await' ensures the operation completes before assigning the result to 'response'.
    // Use this when the API response is not in JSON format but in plain text (e.g., HTML or raw data).
    let response = await a.text();
    // console.log(response)
    // At this point, 'response' contains the raw text data from the server.
    // You can log it to see the actual response body.
    // console.log(response);

    // Create a new <div> element in memory (not yet added to the DOM)
    let div = document.createElement("div");

    // Set the innerHTML of the <div> element to the `response` text.
    // This allows you to work with the HTML structure returned by the server.
    // For example, if the response contains <a> tags, they will now be part of this <div>.
    div.innerHTML = response;

    // Find all <a> (anchor) elements within the <div>.
    // This extracts all hyperlinks from the HTML response.
    let as = div.getElementsByTagName("a");

    // Initialize an empty array to store song names/links that meet the criteria.
    let songs = [];

    // Loop through all the <a> elements found in the HTML.
    for (let index = 0; index < as.length; index++) {
        // Get the current <a> element from the array of links.
        const element = as[index];

        // Check if the href attribute of the <a> element ends with "mp3".
        // This is to filter for links that are likely to be mp3 audio files.
        if (element.href.endsWith("mp3") || element.href.endsWith("m4a")) {
            // Extract the part of the href after "/mysongs/".
            // This isolates the song name or file name.
            songs.push(element.href.split(`${folder}`)[1]);
        }
    }

    //Show all songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // console.log(songUL);

    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
                                <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info" >
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Bikash</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li> `

    }
    // Add click event listeners to each song in the list
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // Get the song name from the list item's .info child element and trim any whitespace
            const track = e.querySelector(".info").firstElementChild.innerHTML.trim();

            // Play the selected song using the playmusic function
            playmusic(track);
        });
    });


    // Return the array of song names/links that were extracted and filtered.
    return songs;

}

// Function to play music when a song is clicked
const playmusic = (track, pause = false) => {
    // SCENARIO 1: Using a single Audio object (currentsong)
    // - Here, currentsong is reused for all tracks.
    // - Updating currentsong.src will automatically stop any currently playing song and start the new one.

    currentsong.src = `${currentfolder}` + track;

    // SCENARIO 2: Creating a new Audio object inside the function
    // - If we declare 'let audio = new Audio()' here, a new Audio object will be created each time.
    // - This would allow multiple songs to play simultaneously unless the previous one is explicitly paused.
    //
    // Example of this alternate scenario:
    // let audio = new Audio("/mysongs/" + track);
    // audio.play();
    if (pause == false) {
        currentsong.play();
        play.src = "/img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ")
    document.querySelector(".songtime").innerHTML = ` 00:00/00:00`
};


async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:3000/mysongs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    console.log(anchors);
    array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/mysongs/")) {
            albumName = e.href.split("/mysongs/")[1]
            let folder = albumName.slice(0, albumName.length - 1)
            // console.log(folder);
            
            //Get the metadata of  the folder
            let a = await fetch(`http://127.0.0.1:3000/mysongs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response);
           
            
            cardcontainer = document.querySelector(".cardContainer")
            cardcontainer.innerHTML = cardcontainer.innerHTML + `       <div data-folder = "${folder}" class="card">   
        <!-- Here folder is a data attribute . A data attribute is set in HTML using data-key="value" and accessed in JavaScript using element.dataset.key. -->
                        <div class="play ">
                            <img src="https://alfred.app/workflows/vdesabou/spotify-mini-player/icon.png" alt="">
                            </div>
                        <img src="/mysongs/${folder}/cover.png" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                        
                        </div>`
        }

    }
    // console.log(div);


        //Load the playlist when the card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                // Here folder is a data attribute in card i html . A data attribute is set in HTML using data-key="value" and accessed in JavaScript using element.dataset.key.
                // console.log(e);
                //  console.log(item);
    
                folder = item.currentTarget.dataset.folder    //Here item is a card and current target indicates the click in card if clicked anywhere in card . Target gives data of img or paragraph inside card so current target is used
                // console.log(folder);
    
                let songs = await getSongs(`/mysongs/${folder}/`);
                playmusic(songs[0])
            })
    
        })
}
    




async function main() {

    //To get the list of all the songs
    let songs = await getSongs("/mysongs/chill/");
    // console.log(songs);
    playmusic(songs[0], true)


    //display all albums in the page
    displayalbums()


    //Attach event listenier to play,next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/img/pause.svg"
        } else {
            currentsong.pause()
            play.src = "/img/play.svg"
        }
    })


    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate", async () => {
        // console.log(currentsong.currentTime , currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)}/${convertSecondsToMinutes(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })


    //Add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


    //Add an event listener at previous and next
    previous.addEventListener("click", async () => {
        let songlist = await getSongs("/mysongs/chill/")


        songindex = songlist.indexOf(currentsong.src.split("/chill/")[1]) - 1;



        if (songindex >= 0) {
            playmusic(songlist[songindex])

        }

    })
    //Add an event listener at previous and next
    next.addEventListener("click", async () => {
        let songlist = await getSongs("/mysongs/chill/")
        songindex = songlist.indexOf(currentsong.src.split("/chill/")[1]) + 1;



        if (songindex + 1 < songlist.length) {
            playmusic(songlist[songindex])

        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to : ", e.target.value + "/100");
        //here e.target.value give value of tar
        currentsong.volume = parseInt(e.target.value) / 100
    })

        //Add event listener to mute the song
        document.querySelector(".volume > img").addEventListener("click" , e => {
            // console.log(e.target);  
            // Here target give the img of the target 
            if(e.target.src.includes("volume.svg")){
                e.target.src = "img/mute.svg"
                currentsong.volume = 0
            }
            else{
                e.target.src = "img/volume.svg"
                currentsong.volume =0.5
            }

        })


}

main()




