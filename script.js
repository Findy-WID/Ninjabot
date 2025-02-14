// Get the button and the body element
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Check if dark mode is already set in localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  themeToggleButton.textContent = 'Dark Mode';
} else {
  body.classList.remove('dark-mode');
  themeToggleButton.textContent = 'Dark Mode';
}

// Toggle dark and light modes
themeToggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  // Save the current theme in localStorage so it persists across sessions
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggleButton.textContent = 'Dark Mode';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggleButton.textContent = 'Dark Mode';
  }
});

  // Check if the browser supports SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // You can change the language
    recognition.interimResults = true; // Show results even while speaking

    const startButton = document.getElementById('start-btn');
    const output = document.getElementById('output');

    startButton.addEventListener('click', () => {
      recognition.start(); // Start speech recognition
    });

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
