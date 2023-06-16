const inputNumber = document.getElementById("inputNumber");
const quoteDisplay = document.getElementById("quoteDisplay");
const generateButton = document.getElementById("generateButton");
const fileInput = document.getElementById("fileInput");
const copyButton = document.getElementById("copyButton");
const resetButton = document.getElementById("resetButton");
const inputWord = document.getElementById("inputWord");
const darkMode = document.getElementById("darkModeBtn");
const scrollToTop = document.getElementById("upToHeader");
let isDarkModeEnabled = false;

if(sessionStorage.getItem("darkModeEnabled") === "true"){
    isDarkModeEnabled = true;
    document.body.classList.add("dark-mode");
}

inputNumber.addEventListener("input", function(event) {
    // increase width of input tag when type

    const valueLength = inputNumber.value.length;
    inputNumber.style.width = valueLength + 3 + "ch";
});

inputNumber.addEventListener("keydown", function(event) {
    // prevent input more than 7 nu
    if (
        event.key === " " ||
        event.key === "-" ||
        event.key === "." ||
        event.key === "," ||
        (inputNumber.value.length >= 7 &&
            event.key !== "Backspace" &&
            event.key !== "Delete" &&
            event.key !== "ArrowLeft" &&
            event.key !== "ArrowRight")
    ) {
        event.preventDefault();
    }
});

inputNumber.addEventListener("keydown", function(event) {
    //function to calculate length of textarea input number of word when user delete character
    const previousLength = inputNumber.value.length;

    setTimeout(function() {
        const currentLength = inputNumber.value.length;
        if (currentLength === 0) {
            inputNumber.cols = 1;
        } else if (currentLength < previousLength) {
            inputNumber.cols -= 1 + Math.ceil((previousLength - currentLength) / 10); // Math.ceil round up to nearest int number. Ex: (10 - 6) / 10 = 0.4 round to 1
        }
    }, 0);
});

copyButton.addEventListener("click", () => {
    // function for copy button
    const textToCopy = quoteDisplay.innerHTML;
    navigator.clipboard.writeText(textToCopy);
});

generateButton.addEventListener("click", () => {
    // function generate random word
    inputWord.style.display = "none";
    let numWords = inputNumber.value;
    if (numWords === "") {
        numWords = 100; // set default equal 100
    }

    if (fileInput.files.length) {
        // generate by file input
        const file = fileInput.files[0]; // create file contain object
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = () => {
            const fileContent = fileReader.result;
            const words = fileContent.split(" ");

            let randomWords = "";
            for (let i = 0; i < numWords; i++) {
                const randomIndex = Math.floor(Math.random() * words.length); // Math.floor round down
                const word = words[randomIndex];
                randomWords += `${word} `;
            }

            quoteDisplay.innerHTML = randomWords.trim();
        };
    } else if (inputWord.value.length) {
        // generate by user input word
        const words = inputWord.value.split(" ");
        let randomWords = "";
        for (let i = 0; i < numWords; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            randomWords += `${word} `;
        }
        quoteDisplay.innerHTML = randomWords.trim();
    } else {
        // generate by default txt file of server
        fetch("./assets/text.txt") // using fetch API to get content of local file text.txt
            .then((response) => response.blob())
            .then((blob) => {
                // content of file are read as a blob object
                const fileReader = new FileReader();
                fileReader.readAsText(blob); // fileReader.readAsText need a blob object
                fileReader.onload = () => {
                    const fileContent = fileReader.result;
                    const words = fileContent.split(" ");

                    let randomWords = "";
                    for (let i = 0; i < numWords; i++) {
                        const randomIndex = Math.floor(Math.random() * words.length);
                        const word = words[randomIndex];
                        randomWords += `${word} `;
                    }

                    quoteDisplay.innerHTML = randomWords.trim();
                };
            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch or read operation
                console.log("An error occurred:", error);
              });
    }
});

const toggleDarkMode = () => {
    isDarkModeEnabled = !isDarkModeEnabled;
    if (isDarkModeEnabled) {
      document.body.classList.add("dark-mode");
      sessionStorage.setItem("darkModeEnabled", "true");
    } else {
      document.body.classList.remove("dark-mode");
      sessionStorage.setItem("darkModeEnabled", "false");
    }
  };

resetButton.addEventListener("click", () => {
    location.reload();
});

darkMode.addEventListener("click", () => {
    toggleDarkMode();
});

window.addEventListener("scroll", function() {
    if (this.window.pageYOffset > 0) {
        scrollToTop.style.display = "block";
    } else {
        if (window.innerWidth >= 600) {
            scrollToTop.style.display = "none";
        }
    }
});

scrollToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
