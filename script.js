// document.addEventListener("DOMContentLoaded", loadChatHistory);

// const chatContainer = document.getElementById("chat-container");
// const inputField = document.getElementById("chat-input");
// const sendBtn = document.getElementById("send-btn");

// // Send message on button click
// sendBtn.addEventListener("click", sendMessage);

// // Send message on Enter key press
// inputField.addEventListener("keypress", function (event) {
//     if (event.key === "Enter") {
//         event.preventDefault();
//         sendMessage();
//     }
// });

// function sendMessage() {
//     let message = inputField.value.trim();
//     if (message === "") return;

//     // Display User Message
//     displayMessage("user", message);
//     saveMessage("user", message);

//     inputField.value = ""; // Clear input

//     // Show Typing Animation
//     showTypingAnimation();

//     setTimeout(() => {
//         let botResponse = getPredefinedResponse(message);
//         displayMessage("bot", botResponse);
//         saveMessage("bot", botResponse);
//     }, 1000);
// }

// function displayMessage(role, message) {
//     let messageDiv = document.createElement("div");
//     messageDiv.classList.add("chat", role);

//     messageDiv.innerHTML = `
//         <div class="chat-content">
//             <div class="chat-details">
//                 <img src="${role === 'user' ? './user.jpg' : './ninjabotgirl.jpg'}" alt="${role}">
//                 <p>${message}</p>
//             </div>
//         </div>
//     `;

//     if (role === "bot") {
//         let copyBtn = document.createElement("button");
//         copyBtn.classList.add("copy-btn");
//         copyBtn.innerHTML = "📋";
//         copyBtn.onclick = () => copyText(message);
//         messageDiv.querySelector(".chat-details").appendChild(copyBtn);
//     }

//     chatContainer.appendChild(messageDiv);
//     chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
// }

// function saveMessage(role, message) {
//     let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
//     chatHistory.push({ role, message });
//     localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
// }

// function loadChatHistory() {
//     let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
//     chatHistory.forEach(chat => displayMessage(chat.role, chat.message));
// }

// function copyText(text) {
//     navigator.clipboard.writeText(text).then(() => {
//         alert("Copied to clipboard!");
//     }).catch(err => {
//         console.error("Error copying text: ", err);
//     });
// }

// // Function for Predefined Responses
// function getPredefinedResponse(userText) {
//     const responses = {
//         "hello": "Hi there! How can I help you?",
//         "how are you": "I'm just a chatbot, but I'm doing great! How about you?",
//         "what is your name": "I'm NinjaBot, your friendly assistant!",
//         "bye": "Goodbye! Have a great day!",
//         "default": "I'm not sure how to respond to that. Try asking something else!"
//     };

//     // Convert user text to lowercase for better matching
//     let lowerText = userText.toLowerCase();

//     return responses[lowerText] || responses["default"];
// }

// // Typing Animation
// function showTypingAnimation() {
//     let typingDiv = document.createElement("div");
//     typingDiv.classList.add("chat", "incoming");

//     typingDiv.innerHTML = `
//         <div class="chat-content">
//             <div class="chat-details">
//                 <img src="./ninjabotgirl.jpg" alt="ninjabot">
//                 <div class="typing-animation">
//                     <div class="typing-dot" style="--delay: 0.2s"></div>
//                     <div class="typing-dot" style="--delay: 0.3s"></div>
//                     <div class="typing-dot" style="--delay: 0.4s"></div>
//                 </div>
//             </div>
//         </div>
//     `;

//     chatContainer.appendChild(typingDiv);
//     chatContainer.scrollTop = chatContainer.scrollHeight;

//     setTimeout(() => {
//         typingDiv.remove();
//     }, 1000);
// }
