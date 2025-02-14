// Get the button and the body element
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;

// Check if dark mode is already set in localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggleButton.textContent = "Light Mode";
} else {
  body.classList.remove("dark-mode");
  themeToggleButton.textContent = "Dark Mode";
}

// Toggle dark and light modes
themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggleButton.textContent = "Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggleButton.textContent = "Dark Mode";
  }
});

// Check if the browser supports SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;

  const startButton = document.getElementById("start-btn");
  const output = document.getElementById("output");

  startButton.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    output.textContent = transcript;
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
  };
} else {
  console.log("Speech Recognition API is not supported in this browser.");
}

const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = "";
const API_KEY = process.env.API_KEY;

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const API_URL = process.env.BASE_URL;
  const pElement = document.createElement("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    pElement.textContent = data.choices[0].text;
  } catch (error) {
    console.log(error);
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
};

const showTypingAnimation = () => {
  const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="./ninjabotgirl.jpg" alt="ninjabot">
                     <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                     </div>
                </div>
                <span class="material-symbols-rounded">content_copy</span>
            </div>`;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./user.jpg" alt="user">
                        <p>${userText}</p>
                    </div>
                </div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = "";
  setTimeout(showTypingAnimation, 500);
};

sendBtn.addEventListener("click", handleOutgoingChat);

// Emoji logic
let click = false;
function show_emoji() {
  const emojiContainer = document.getElementById("emoji-popup");
  emojiContainer.style.display = click ? "none" : "grid";
  click = !click;
}

function emoji(id) {
  const emojiChar = document.getElementById(id).innerHTML;
  chatInput.value += emojiChar;
}
