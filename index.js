const word = document.querySelector("h1");
const phonetics = document.querySelector(".pronunciation");
const nounList = document.querySelector(".noun");
const verbList = document.querySelector(".verb");
const audioIcon = document.querySelector(".audio-icon");
const adjectiveList = document.querySelector(".adjective");
const searchBar = document.querySelector(".search-bar");
const nounType = document.querySelector(".noun-type");
const verbType = document.querySelector(".verb-type");
const adjectiveType = document.querySelector(".adjective-type");
const source = document.querySelector(".source");
const fontSelector = document.querySelector("#font-type");
const themeToggle = document.querySelector("#theme");
const moonIcon = document.querySelector(".moon-icon");
const error = document.querySelector(".error");
const synonymList = document.querySelector(".synonyms-list");
let audioClip = undefined;

document.documentElement.dataset.theme = "light";
audioIcon.style.display = "none";
themeToggle.checked = false;

themeToggle.addEventListener("click", () => {
  if (document.documentElement.dataset.theme === "light") {
    document.documentElement.dataset.theme = "dark";
    moonIcon.style.stroke = "purple";
  } else {
    moonIcon.style.stroke = "black";
    document.documentElement.dataset.theme = "light";
  }
});

searchBar.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && searchBar.value) {
    word.innerText = "";
    phonetics.innerText = "";
    error.innerText = "";
    nounList.innerHTML = "";
    verbList.innerHTML = "";
    nounType.style.display = "none";
    verbType.style.display = "none";
    adjectiveType.style.display = "none";
    adjectiveList.innerHTML = "";
    synonymList.innerHTML = "";
    source.style.display = "block";
    searchBar.style.outline = "2px solid purple";
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchBar.value}`)
      .then((response) => response.json())
      .then((data) => {
        word.innerText = data[0].word;
        if (data[0].phonetic) {
          phonetics.innerText = data[0].phonetic;
        } else {
          phonetics.innerText = "No pronunciation available";
        }

        if (data[0].phonetics[0].audio[0]) {
          audioIcon.style.display = "block";
          audioClip = new Audio(data[0].phonetics[0].audio);
        } else {
          audioIcon.style.display = "none";
          audioClip = undefined;
        }

        if (data[0].meanings) {
          data[0].meanings.forEach((meaning) => {
            if (meaning.partOfSpeech === "noun") {
              nounType.style.display = "block";
              meaning.definitions.forEach((definition) => {
                const nounItem = document.createElement("li");
                nounItem.innerText = definition.definition;
                nounList.appendChild(nounItem);
              });
            } else if (meaning.partOfSpeech === "verb") {
              verbType.style.display = "block";
              meaning.definitions.forEach((definition) => {
                const verbItem = document.createElement("li");
                verbItem.innerText = definition.definition;
                verbList.appendChild(verbItem);
              });
            } else if (meaning.partOfSpeech === "adjective") {
              adjectiveType.style.display = "block";
              meaning.definitions.forEach((definition) => {
                const adjectiveItem = document.createElement("li");
                adjectiveItem.innerText = definition.definition;
                adjectiveList.appendChild(adjectiveItem);
              });
            }
          });
        }

        if (data[0].meanings[0].synonyms) {
          console.log(data[0].meanings[0].synonyms);
          data[0].meanings[0].synonyms.forEach((synonym) => {
            const synonymItem = document.createElement("li");
            synonymItem.innerText = synonym;
            synonymList.appendChild(synonymItem);
          });
        }
      })
      .catch((err) => {
        searchBar.style.outline = "2px solid red";
        error.innerText = "Word not found";
        // Handle any errors that occurred during the request
      });
  } else if (event.key === "Enter" && !searchBar.value) {
    searchBar.style.outline = "none";
    searchBar.style.outline = "2px solid red";
    error.innerText = "Whoops can't be empty...";
  }
});

audioIcon.addEventListener("click", () => {
  if (audioClip) {
    audioClip.play();
  }
});

fontSelector.addEventListener("change", (event) => {
  if (event.target.value === "serif") {
    document.body.style.fontFamily = "Lora, serif";
  } else if (event.target.value === "sans-serif") {
    document.body.style.fontFamily = "Inter, sans-serif";
  } else if (event.target.value === "monospace") {
    document.body.style.fontFamily = "Inconsolata, monospace";
  }
});
