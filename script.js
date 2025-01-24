console.log("Lets write some js");


async function getSongs() {

    // Perform a GET request to the specified URL (http://127.0.0.1:3000/mysongs/)
    // 'fetch' is used to retrieve data from the server or API endpoint.
    // 'await' pauses the execution until the fetch operation completes.
    // This will return a Response object containing details of the HTTP response.
    let a = await fetch("http://127.0.0.1:3000/mysongs/");

    // Log the Response object to the console to inspect its properties.
    // The Response object contains information like status, headers, etc.
    console.log(a);

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

async function main() {

    //To get the list of all the songs
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    console.log(songUL);


    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>${song.replaceAll("%20", " ")}</li>`

    }
    //Play the first song

    var audio = new Audio(songs[4]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration);
        //The duration variable hols the duration (in seconds ) of the audio clip 
    })
}

main() 