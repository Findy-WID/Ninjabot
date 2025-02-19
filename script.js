const chatContainer = document.querySelector(".chat-container");
const chatInput = document.getElementById("chat-input");
const sendButton = document.querySelector(".send-button");
const themeToggle = document.getElementById("theme-toggle");
const emojiPopup = document.getElementById("emoji-popup");
let isCooldown = false; // Cooldown flag
const API_KEY = "AIzaSyDsc99NkQtPC1-MsCXbgTkAtoGpqtvwkuw"; // Ensure this is kept secure!

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

    // Fetch AI response
    setTimeout(() => {
        fetchAIResponse(userText, typingIndicator);
    }, 2000);
}

// Fetch AI response
// async function fetchAIResponse(userText, typingIndicator) {
//     try {
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 contents: [{ role: "user", parts: [{ text: userText }] }]
//             })
//         });

//         if (response.status === 500) {
//             chatContainer.removeChild(typingIndicator);
//             createChatBubble("Server error 😓. Please try again later.", false);
//             return;
//         }

//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const data = await response.json();
//         const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response received";

//         chatContainer.removeChild(typingIndicator);
//         createChatBubble(responseText, false);

//         // Save chat history
//         localStorage.setItem("all-chats", chatContainer.innerHTML);
//     } catch (error) {
//         console.error("Error fetching AI response:", error);
//         chatContainer.removeChild(typingIndicator);
//         createChatBubble("Error fetching response 😔", false);
//     }
// }
async function fetchAIResponse(userText, typingIndicator) {
    try {
        const response = await fetch('/api/fetchAI', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userText })
        });

        if (response.status === 500) {
            chatContainer.removeChild(typingIndicator);
            createChatBubble("Server error 😓. Please try again later.", false);
            return;
        }

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response received";

        chatContainer.removeChild(typingIndicator);
        createChatBubble(responseText, false);

        // Save chat history
        localStorage.setItem("all-chats", chatContainer.innerHTML);
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