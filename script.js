console.log("Lets write some js");


async function getSongs() {
    
    let a  = await fetch("http://127.0.0.1:3000/mysongs/")
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mpeg")){
            songs.push(element.href)   
        }  
    }
   return songs;
}

async function main() {
    
    //To get the list of all the songs
    let songs = await getSongs();
    console.log(songs);
    
}
main()