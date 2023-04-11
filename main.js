const inputNumber = document.getElementById("inputNumber");
const quoteDisplay = document.getElementById("quoteDisplay");
const generateButton = document.getElementById("generateButton");
const fileInput = document.getElementById("fileInput");
const copyButton = document.getElementById("copyButton");
const resetButton = document.getElementById("resetButton");
const inputWord = document.getElementById("inputWord");
inputNumber.addEventListener("input", function(event) {
    let afterFilter = inputNumber.value.replace(/[^0-9]/g, ""); //remove character word in text
    if (afterFilter !== "") {
        inputNumber.value = afterFilter;
    }

    inputNumber.cols += Math.ceil(inputNumber.value.length / 10);
});

inputNumber.addEventListener("keydown", function(event) {
    const previousLength = inputNumber.value.length;

    setTimeout(function() {
        const currentLength = inputNumber.value.length;
        if (currentLength === 0) {
            inputNumber.cols = 1;
        } else if (currentLength < previousLength) {
            inputNumber.cols -= 1 + Math.ceil((previousLength - currentLength) / 10);
        }
    }, 0);
});

copyButton.addEventListener("click", () => {
    const textToCopy = quoteDisplay.innerHTML;
    navigator.clipboard.writeText(textToCopy);
});

generateButton.addEventListener("click", () => {
    inputWord.style.display = "none";
    let numWords = inputNumber.value;
    if (numWords === "") {
        numWords = 1000;
    }

    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
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
    } else if (inputWord.value.length) {
        const words = inputWord.value.split(" ");
        let randomWords = "";
        for (let i = 0; i < numWords; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            randomWords += `${word} `;
        }
        quoteDisplay.innerHTML = randomWords.trim();
    } else {
        fetch("/assets/text.txt")
            .then((response) => response.blob())
            .then((blob) => {
                const fileReader = new FileReader();
                fileReader.readAsText(blob);
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
            });
    }
});

resetButton.addEventListener("click", () => {
    location.reload();
});