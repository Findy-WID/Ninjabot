// Get the button and the body element
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;

// Check if dark mode is already set in localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggleButton.textContent = "Dark Mode";
} else {
  body.classList.remove("dark-mode");
  themeToggleButton.textContent = "Dark Mode";
}

// Toggle dark and light modes
themeToggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Save the current theme in localStorage so it persists across sessions
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggleButton.textContent = "Dark Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggleButton.textContent = "Dark Mode";
  }
});

// Check if the browser supports SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US"; // You can change the language
  recognition.interimResults = true; // Show results even while speaking

  const startButton = document.getElementById("start-btn");
  const output = document.getElementById("output");

  startButton.addEventListener("click", () => {
    recognition.start(); // Start speech recognition
  });

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    //output.textContent = transcript; // Show the recognized text
  };
  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
  };
} else {
  console.log("Speech Recognition API is not supported in this browser.");
}

const chatinput = document.getElementById("chat-input");
const sendbtn = document.getElementById("send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
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

  // Define the properties and data for the API request
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
      stop: null,
    }),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].text;
  } catch (error) {
    console.log(error);
  }

  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
};

const showTyingAnimation = () => {
  const html = ` div class="chat-content">
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

  // Create an outgoing chat div with user's message and append it to chat container
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse();
};

const handleOutgoingChat = () => {
  userText = chatinput.value.trim();
  //if (!userText) return;  Prevent sending empty messages

  const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./user.jpg" alt="user">
                        <p>${userText}</p>
                    </div>
                </div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  // chatinput.value = ""; Clear input field after sending message
  setTimeout(showTyingAnimation, 500);
};

sendbtn.addEventListener("click", handleOutgoingChat);

// Create an outgoing chat div with user's message and append it to chat container
setTimeout(showTyingAnimation, 500);

//Remove the typing animation, append the paragraph element and save the chats to local storage
incomingChatDiv.querySelector(".typing-animation").remove();

// Logic for chat input box and send button
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      //output.textContent = transcript; // Show the recognized text
     
    };
    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
    };
  } else {
    console.log('Speech Recognition API is not supported in this browser.');
  }

  //Emoji
let click = false;

function show_emoji() {
    const emojiContainer = document.getElementById("emoji-popup");
    if (click == false) {
        emojiContainer.style.display = "grid";  
        click = true;
    } else {
        emojiContainer.style.display = "none";  
        click = false;
    }
}

function emoji(id) {
    const emojiChar = document.getElementById(id).innerHTML; 
    const inputField = document.getElementById("chat-input"); 

    // Append the selected emoji to the input field
    inputField.value += emojiChar;
}
