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

import CONFIG from "./config";

const chatinput = document.getElementById("chat-input");
const sendbtn = document.getElementById("send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
const API_KEY = CONFIG.API_KEY;

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = CONFIG.BASE_URL;
    const pElement = document.createElement("p");
    
    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {        
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).JSON();
        pElement.textContent = response.choices[0].text;
        
    } catch (error) {
        console.log(error);
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
}  

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
}
 
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
}

sendbtn.addEventListener('click', handleOutgoingChat);



// Create an outgoing chat div with user's message and append it to chat container
setTimeout(showTyingAnimation, 500);

//Remove the typing animation, append the paragraph element and save the chats to local storage
incomingChatDiv.querySelector(".typing-animation").remove();
