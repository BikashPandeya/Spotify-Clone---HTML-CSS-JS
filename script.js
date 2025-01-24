console.log("Lets write some js");
// Define a single Audio object to manage playback globally
let currentsong = new Audio();



function convertSecondsToMinutes(seconds) {
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

async function getSongs() {

    // Perform a GET request to the specified URL (http://127.0.0.1:3000/mysongs/)
    // 'fetch' is used to retrieve data from the server or API endpoint.
    // 'await' pauses the execution until the fetch operation completes.
    // This will return a Response object containing details of the HTTP response.
    let a = await fetch("http://127.0.0.1:3000/mysongs/");

    // Log the Response object to the console to inspect its properties.
    // The Response object contains information like status, headers, etc.
    // console.log(a);

    // Extract the response body as plain text.
    // 'await' ensures the operation completes before assigning the result to 'response'.
    // Use this when the API response is not in JSON format but in plain text (e.g., HTML or raw data).
    let response = await a.text();

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

        // Check if the href attribute of the <a> element ends with "mpeg".
        // This is to filter for links that are likely to be MPEG audio files.
        if (element.href.endsWith("mpeg")) {
            // Extract the part of the href after "/mysongs/".
            // This isolates the song name or file name.
            songs.push(element.href.split("/mysongs/")[1]);
        }
    }
    
    // Return the array of song names/links that were extracted and filtered.
    return songs;
    
}

// Function to play music when a song is clicked
const playmusic = (track , pause = false) => {
    // SCENARIO 1: Using a single Audio object (currentsong)
    // - Here, currentsong is reused for all tracks.
    // - Updating currentsong.src will automatically stop any currently playing song and start the new one.
    currentsong.src = "/mysongs/" + track;

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
    document.querySelector(".songtime").innerHTML = `00:00/00:00`
};

async function main() {

    //To get the list of all the songs
    let songs = await getSongs();
    // console.log(songs);
    playmusic(songs[0] , true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    console.log(songUL);


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
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime , currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)}/${convertSecondsToMinutes( currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) *100 + "%";
    })


    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentSong.duration) * percent) / 100
    })
        
   
}

main()




