
const chatBox = document.getElementById("chatBox");

loadHistory();

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  saveHistory();

  if (cls === "bot") speak(text);
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  addMsg(msg, "user");
  input.value = "";

  addMsg("Typing... ✨", "bot");

  fetch("https://YOUR-VERCEL-APP.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg
    })
  })
    .then(res => res.json())
    .then(data => {
      chatBox.removeChild(chatBox.lastChild);
      addMsg(data.reply, "bot");
    })
    .catch(err => {
      chatBox.removeChild(chatBox.lastChild);
      addMsg("❌ Server error. Please try again.", "bot");
      console.error(err);
    });
}

/* 🎤 Voice Input */
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.onresult = e => {
    document.getElementById("userInput").value = e.results[0][0].transcript;
  };
  recognition.start();
}

/* 🔊 Voice Output */
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";
  window.speechSynthesis.speak(msg);
}

/* 💾 Chat History */
function saveHistory() {
  localStorage.setItem("chatHistory", chatBox.innerHTML);
}

function loadHistory() {
  const h = localStorage.getItem("chatHistory");
  if (h) chatBox.innerHTML = h;
  else addMsg("Hello! I can help you order soy wax candles 🕯️", "bot");
}
