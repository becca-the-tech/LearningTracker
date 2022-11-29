//creates NodeList of all i tags which are used by FontAwesome
let downButtons = document.getElementsByClassName("toggle-btn");
//nodeList of all elements with "container" as a class, which are the flexbox containers for each course article
let containers = document.getElementsByClassName("container");
let timeRemaining = document.getElementsByClassName("timeRemaining");

//cycles through all i tags to add event listeners to them
for (let i = 0; i < downButtons.length; i++) {
    downButtons[i].addEventListener("click", function() {
        //when event listener is clicked, hides all but the h tag since that is out of the container for that course article
        containers[i].classList.toggle("hidden");
        //hides the add section btn
        containers[i].nextElementSibling.classList.toggle("hidden");
        //if circle-right is showing, hides it and shows circle-down and vice versa
        downButtons[i].classList.toggle("fa-arrow-circle-right");
        downButtons[i].classList.toggle("fa-arrow-circle-down");
    });
}

// let boxes = document.getElementsByClassName("box");
// for (let i = 0; i < boxes.length; i++) {
//     boxes[i].addEventListener("click", function() {
//         boxes[i].classList.toggle("completed");
//     });
// }

let timeArticles = document.getElementsByClassName("timeRemaining");
let amountSpans = document.querySelectorAll("article .amount");

for (let i = 0; i < timeArticles.length; i++) {
    timeArticles[i].addEventListener("click", function() {
        console.log("Time Articles: " + timeArticles);
        console.log("Spans for the amount of time: " + amountSpans);
    });
}


