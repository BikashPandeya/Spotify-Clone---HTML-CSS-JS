console.log("Lets write some js");


async function main() {
    
    let a  = await fetch("https://http://127.0.0.1:3000/index.html")
    let response = await a.text()
    console.log(response);
    
}


main()