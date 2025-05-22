function navigatePath() {
    const selectedPath = document.getElementById("path-select").value;

    if (selectedPath === "networks") {
        window.location.href = "courses.html#networks";
    } else if (selectedPath === "data") {
        window.location.href = "courses.html#data";
    } else if (selectedPath === "webdev") {
        window.location.href = "courses.html#webdev";
    } else if (selectedPath === "programming") {
        window.location.href = "courses.html#programming";
    } else {
        alert("Please select a path to continue.");
    }
}console.log("Welcome to the Online Learning Platform!");

function navigatePath() {
    const selectedPath = document.getElementById("path-select").value;

    if (selectedPath) {
        
        window.location.href = "Courses.html#" + selectedPath;
    } else {
        alert("Please select a path to continue.");
    }
}

function flipCard(card) {
  card.classList.toggle('flipped');
}
