import CONFIG from "./config.js";

const API_URL = "CONFIG.API_URL";
const API_KEY = "CONFIG.API_KEY"; 
const chatContainer = document.querySelector(".chat-container");
const chatInput = document.getElementById("chat-input");
const sendButton = document.querySelector(".send-button");
const themeToggle = document.getElementById("theme-toggle");
const emojiPopup = document.getElementById("emoji-popup");
let isCooldown = false; // Cooldown flag

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

// Fetch AI response from OpenAI API
async function fetchAIResponse(userText, typingIndicator) {
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG.API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userText }],
            }),
        });

        if (response.status === 429) {
            chatContainer.removeChild(typingIndicator);
            createChatBubble("Too many requests! Please wait a moment before trying again. ⏳", false);
            return;
        }

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        chatContainer.removeChild(typingIndicator);
        createChatBubble(data.choices[0].message.content, false);
    } catch (error) {
        console.error("Error fetching AI response:", error);
        chatContainer.removeChild(typingIndicator);
        createChatBubble("Error fetching response 😔", false);
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

// Handle dark mode toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
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
