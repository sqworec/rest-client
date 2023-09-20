function init() {
  console.log("init");
  let getBtn = document.getElementById("getBtn");
  let postBtn = document.getElementById("postBtn");
  let clearBtn = document.getElementById("clearBtn");
  //let result = document.getElementById("result")
  getWords();

  getBtn.onclick = () => {
    console.log("getBtn click");
    getWords();
  };

  postBtn.onclick = () => {
    console.log("postBtn click");

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
        console.log("Server respond: ", data);
        getWords();
      })
      .catch((error) => {
        console.error("Post error:", error);
      });
  };

  clearBtn.onclick = () => {
    console.log("clearBtn click");

    fetch("http://localhost:8080/words", {
      method: "DELETE",
    })
      .then(async (res) => {
        res.text();
        getWords();
      })
      .catch((error) => {
        console.error("Delete error: ", error);
      });
  };
}

function WordUI(word) {
  const div = document.createElement("div");
  for (const key in word) {
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
          result.appendChild(wordUI);
        });
      }
    })
    .catch((error) => {
      console.error("Get error:", error);
    });
}
