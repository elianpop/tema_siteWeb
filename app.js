const API_URL = "https://jsonplaceholder.typicode.com/posts";

const main = document.querySelector("main");
const form = document.querySelector("#post-form");
const submitButton = form.querySelector("button");
const formMessage = document.querySelector("#form-message");
const statusElement = document.querySelector("#status");
const postsList = document.querySelector("#posts-list");
const searchInput = document.querySelector("#search");

let posts = [];
let loaded = false;

function showMessage(element, message, type = "") {
  element.textContent = message;
  element.className = type;
}

function createPostElement(post) {
  const item = document.createElement("li");
  item.className = "post";

  const title = document.createElement("h3");
  title.textContent = post.title;

  const body = document.createElement("p");
  body.textContent = post.body;

  item.append(title, body);
  return item;
}

function renderPosts() {
  postsList.textContent = "";

  const query = searchInput.value.trim().toLowerCase();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query)
  );

  if (filteredPosts.length === 0) {
    const message = posts.length === 0
      ? "Lista este goală."
      : "Nu există postări care să corespundă căutării.";

    showMessage(statusElement, message);
    return;
  }

  showMessage(statusElement, "");

  for (const post of filteredPosts) {
    postsList.append(createPostElement(post));
  }
}

async function readServerError(response) {
  const text = await response.text();

  if (!text.trim()) {
    return `Serverul a răspuns cu eroarea ${response.status}.`;
  }

  try {
    const data = JSON.parse(text);

    return data.message
      || data.error
      || JSON.stringify(data);
  } catch {
    return text;
  }
}

async function loadPosts() {
  showMessage(statusElement, "Se încarcă postările...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const message = await readServerError(response);
      showMessage(statusElement, message, "error");
      return;
    }

    posts = await response.json();
    loaded = true;
    renderPosts();
  } catch {
    showMessage(
      statusElement,
      "Nu am putut încărca datele. Verifică internetul.",
      "error"
    );
  }
}

async function createPost(event) {
  event.preventDefault();

  const formData = new FormData(form);

  const newPost = {
    title: formData.get("title").trim(),
    body: formData.get("body").trim(),
    userId: Number(formData.get("userId"))
  };

  submitButton.disabled = true;
  showMessage(formMessage, "Se trimite postarea...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      const message = await readServerError(response);
      showMessage(formMessage, message, "error");
      return;
    }

    if (response.status !== 201) {
      showMessage(
        formMessage,
        `Răspuns neașteptat: ${response.status}. Era așteptat 201.`,
        "error"
      );
      return;
    }

    const createdPost = await response.json();

    posts.unshift(createdPost);
    loaded = true;

    form.reset();
    searchInput.value = "";
    renderPosts();

    showMessage(
      formMessage,
      "Postarea a fost adăugată în listă!",
      "success"
    );
  } catch {
    showMessage(
      formMessage,
      "Eroare de rețea. Postarea nu a putut fi trimisă.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener("submit", createPost);

// Delegare: ascultăm evenimentul pe părintele câmpului de căutare.
main.addEventListener("input", (event) => {
  if (event.target.matches("#search") && loaded) {
    renderPosts();
  }
});

loadPosts();