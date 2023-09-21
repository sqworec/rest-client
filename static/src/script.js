function init() {
  console.log("init");
  let getBtn = document.getElementById("getBtn");
  let postBtn = document.getElementById("postBtn");
  let clearBtn = document.getElementById("clearBtn");
  window.onload = getWords();

  getBtn.onclick = () => {
    console.log("getBtn click");
    getWords();
  };

  postBtn.onclick = () => {
    console.log("postBtn click");
    postWord();
  };

  clearBtn.onclick = () => {
    console.log("clearBtn click");
    clearWords();
  };
}

function WordUI(word) {
  const div = document.createElement("div");

  for (const key in word) {
    if (key == "id") {
      continue;
    }
    const f = field(key, word[key]);
    div.classList.add("word-card");
    div.appendChild(f);
  }
  return div;
}

function field(key, value) {
  const div = document.createElement("div");
  div.innerHTML = `${key}: ${value}`;
  return div;
}

function getWords() {
  fetch("http://localhost:8080/words", {
    method: "GET",
  })
    .then(async (res) => {
      const words = await res.json();
      result.innerHTML = "";
      if (words != null) {
        words.forEach((w) => {
          const wordUI = WordUI(w);

          let wordId = "word-" + w.id;
          let id = wordId.split("-")[1];

          wordUI.id = wordId;
          wordUI.style.position = "relative";

          let deleteBtn = document.createElement("button");
          deleteBtn.textContent = "x";
          deleteBtn.classList.add("deleteBtn");

          deleteBtn.onclick = () => {
            console.log("deleteBtn click");
            deleteWord(id);
            let divToRemove = document.getElementById(wordId);
            if (divToRemove) {
              divToRemove.parentNode.removeChild(divToRemove);
              console.log(wordId);
            }
          };

          let editBtn = document.createElement("button");
          editBtn.textContent = "/";
          editBtn.classList.add("editBtn");

          editBtn.onclick = () => {
            console.log("editBtn click");
            let modal = document.getElementById("editModal");
            modal.style.display = "flex";

            let editedRuInput = document.getElementById("editedRu");
            let editedEnInput = document.getElementById("editedEn");

            editedRuInput.value = w.Russian;
            editedEnInput.value = w.English;

            let confirmBtn = document.getElementById("confirmBtn");
            let discardBtn = document.getElementById("discardBtn");

            confirmBtn.onclick = () => {
              editWord(id, editedRuInput.value, editedEnInput.value);
              modal.style.display = "none";
            };

            discardBtn.onclick = () => {
              modal.style.display = "none";
            };
          };

          wordUI.appendChild(deleteBtn);
          wordUI.appendChild(editBtn);

          result.appendChild(wordUI);
        });
      }
    })
    .catch((error) => {
      console.error("getWords error:", error);
    });
}

function postWord() {
  let ru_word = document.getElementById("ru-word");
  let en_word = document.getElementById("en-word");

  let data = {
    Russian: ru_word.value,
    English: en_word.value,
  };
  if (ru_word.value == "" || en_word.value == "") {
    throw "Words can not be empty";
  }

  ru_word.value = "";
  en_word.value = "";

  fetch("http://localhost:8080/words", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => res.text())
    .then(async (data) => {
      getWords();
    })
    .catch((error) => {
      console.error("postWord error:", error);
    });
}

function editWord(id, ru, en) {
  fetch("http://localhost:8080/words/" + id, {
    method: "PUT",
    body: JSON.stringify(id),
  })
    .then(async (res) => {
      res.text();

      console.log("Ru:", ru);
      console.log("En:", en);
      getWords();
    })
    .catch((error) => {
      console.log("editWord error:", error);
    });
}

function clearWords() {
  fetch("http://localhost:8080/words", {
    method: "DELETE",
  })
    .then(() => {
      getWords();
    })
    .catch((error) => {
      console.error("clearWords error: ", error);
    });
}

function deleteWord(id) {
  fetch("http://localhost:8080/words/" + id, {
    method: "DELETE",
    body: JSON.stringify(id),
  })
    .then(async (res) => {
      res.text();
    })
    .catch((error) => {
      console.log("deleteWord error:", error);
    });
}
