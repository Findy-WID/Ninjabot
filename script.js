const chatContainer = document.querySelector(".chat-container");
const chatInput = document.getElementById("chat-input");
const sendButton = document.querySelector(".send-button");
const themeToggle = document.getElementById("theme-toggle");
const emojiPopup = document.getElementById("emoji-popup");
let isCooldown = false; // Cooldown flag

// Load chat history and theme from local storage
const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("themeColor");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "Dark Mode" : "Light Mode";

    chatContainer.innerHTML = localStorage.getItem("all-chats") || "";
};

// Handle sending message
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send user message to chat and fetch AI response
function sendMessage() {
    if (isCooldown) {
        alert("You are sending messages too fast! Please wait a moment.");
        return;
    }
    
    const userText = chatInput.value.trim();
    if (!userText) return;

    // Add user message to chat
    createChatBubble(userText, true);
    chatInput.value = "";

    // Show typing animation
    const typingIndicator = createTypingBubble();

    // Apply cooldown
    isCooldown = true;
    sendButton.disabled = true;
    setTimeout(() => {
        isCooldown = false;
        sendButton.disabled = false;
    }, 5000); // 5 seconds cooldown

    // Fetch AI response with a delay (to handle rate limits)
    setTimeout(() => {
        fetchAIResponse(userText, typingIndicator);
    }, 2000);
}

// Fetch AI response from your API
async function fetchAIResponse(userText, typingIndicator) {
    try {
        const response = await generateAIResponse(userText);
        chatContainer.removeChild(typingIndicator);
        createChatBubble(response, false);
    } catch (error) {
        console.error("Error fetching AI response:", error);
        chatContainer.removeChild(typingIndicator);
        createChatBubble("Error fetching response 😔", false);
    }
}

// Generate AI response
async function generateAIResponse(userText) {
    try {
        const response = await axios.post('/netlifyFunctions/fetchAI', { prompt: userText });
        return response.data.response;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// Create chat bubble (user or AI)
function createChatBubble(text, isUser) {
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat", isUser ? "outgoing" : "incoming");

    const chatImage = document.createElement("img");
    chatImage.src = isUser ? "./user.jpg" : "./ninjabotgirl.jpg";
    chatImage.alt = isUser ? "User" : "NinjaBot";

    const chatContent = document.createElement("div");
    chatContent.classList.add("chat-content");
    chatContent.textContent = text;

    chatBubble.appendChild(chatImage);
    chatBubble.appendChild(chatContent);
    chatContainer.appendChild(chatBubble);

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Create typing indicator
function createTypingBubble() {
    const typingBubble = document.createElement("div");
    typingBubble.classList.add("chat", "incoming");

    const chatImage = document.createElement("img");
    chatImage.src = "./ninjabotgirl.jpg";
    chatImage.alt = "NinjaBot";

    const typingContent = document.createElement("div");
    typingContent.classList.add("chat-content");

    const typingAnimation = document.createElement("div");
    typingAnimation.classList.add("typing-animation");
    typingAnimation.innerHTML = "<span></span> <span></span> <span></span>";

    typingContent.appendChild(typingAnimation);
    typingBubble.appendChild(chatImage);
    typingBubble.appendChild(typingContent);
    chatContainer.appendChild(typingBubble);

    return typingBubble;
}

// Toggle theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const newTheme = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
    localStorage.setItem("themeColor", newTheme);
    themeToggle.textContent = newTheme;
});

// Show/hide emoji popup
function show_emoji() {
    emojiPopup.style.display = emojiPopup.style.display === "block" ? "none" : "block";
}

// Insert emoji into input
function emoji(emojiId) {
    const selectedEmoji = document.getElementById(emojiId).textContent;
    chatInput.value += selectedEmoji;
}

// const chatContainer = document.querySelector(".chat-container");
// const chatInput = document.getElementById("chat-input");
// const sendButton = document.querySelector(".send-button");
// const themeToggle = document.getElementById("theme-toggle");
// const emojiPopup = document.getElementById("emoji-popup");
// let isCooldown = false; // Cooldown flag
// // const API_KEY = ""; // Ensure this is kept secure!

// // Load chat history and theme from local storage
// const loadDataFromLocalStorage = () => {
//     const themeColor = localStorage.getItem("themeColor");
//     document.body.classList.toggle("light-mode", themeColor === "light_mode");
//     themeToggle.textContent = document.body.classList.contains("light-mode") ? "Dark Mode" : "Light Mode";

//     chatContainer.innerHTML = localStorage.getItem("all-chats") || "";
// };

// // Handle sending message
// sendButton.addEventListener("click", sendMessage);
// chatInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         sendMessage();
//     }
// });

// // Send user message to chat and fetch AI response
// function sendMessage() {
//     if (isCooldown) {
//         alert("You are sending messages too fast! Please wait a moment.");
//         return;
//     }
    
//     const userText = chatInput.value.trim();
//     if (!userText) return;

//     // Add user message to chat
//     createChatBubble(userText, true);
//     chatInput.value = "";

//     // Show typing animation
//     const typingIndicator = createTypingBubble();

//     // Apply cooldown
//     isCooldown = true;
//     sendButton.disabled = true;
//     setTimeout(() => {
//         isCooldown = false;
//         sendButton.disabled = false;
//     }, 5000); // 5 seconds cooldown

//     // Fetch AI response
//     // Fetch AI response with a delay (to handle rate limits)
//     // setTimeout(() => {
//     //     fetchAIResponse(userText, typingIndicator);
//     // }, 2000);
// }

// // Fetch AI response
// //userText, typingIndicator
// async function generateAIResponse(userText) {
//     try {
//         const response = await axios.post('/netlifyFunctions/fetchAI', { prompt: userText });
//         return response.data.response;
//     } catch (error) {
//         console.error("Error calling Gemini API:", error);
//         throw error;
//     }
// }

// // Create chat bubble (user or AI)
// function createChatBubble(text, isUser) {
//     const chatBubble = document.createElement("div");
//     chatBubble.classList.add("chat", isUser ? "outgoing" : "incoming");

//     const chatImage = document.createElement("img");
//     chatImage.src = isUser ? "./user.jpg" : "./ninjabotgirl.jpg";
//     chatImage.alt = isUser ? "User" : "NinjaBot";

//     const chatContent = document.createElement("div");
//     chatContent.classList.add("chat-content");
//     chatContent.textContent = text;

//     chatBubble.appendChild(chatImage);
//     chatBubble.appendChild(chatContent);
//     chatContainer.appendChild(chatBubble);

//     // Scroll to bottom
//     chatContainer.scrollTop = chatContainer.scrollHeight;
// }

// // Create typing indicator
// function createTypingBubble() {
//     const typingBubble = document.createElement("div");
//     typingBubble.classList.add("chat", "incoming");

//     const chatImage = document.createElement("img");
//     chatImage.src = "./ninjabotgirl.jpg";
//     chatImage.alt = "NinjaBot";

//     const typingContent = document.createElement("div");
//     typingContent.classList.add("chat-content");

//     const typingAnimation = document.createElement("div");
//     typingAnimation.classList.add("typing-animation");
//     typingAnimation.innerHTML = "<span></span> <span></span> <span></span>";

//     typingContent.appendChild(typingAnimation);
//     typingBubble.appendChild(chatImage);
//     typingBubble.appendChild(typingContent);
//     chatContainer.appendChild(typingBubble);

//     return typingBubble;
// }

// // Toggle theme
// themeToggle.addEventListener("click", () => {
//     document.body.classList.toggle("dark-mode");
//     const newTheme = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
//     localStorage.setItem("themeColor", newTheme);
//     themeToggle.textContent = newTheme;
// });

// // Show/hide emoji popup
// function show_emoji() {
//     emojiPopup.style.display = emojiPopup.style.display === "block" ? "none" : "block";
// }

// // Insert emoji into input
// function emoji(emojiId) {
//     const selectedEmoji = document.getElementById(emojiId).textContent;
//     chatInput.value += selectedEmoji;
// }



// Load chat history on page load
// loadDataFromLocalStorage();
