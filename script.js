const chatBox = document.getElementById("chatBox");
const BACKEND_URL = "https://soy-candle-bot1.vercel.app/api/chat";

/* ---------- INIT ---------- */
addMsg("Hello! I can help you order soy wax candles 🕯️", "bot");

/* ---------- CORE ---------- */
function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  input.value = "";
  sendToBot(msg);
}

function sendToBot(text) {
  addMsg(text, "user");
  addMsg("Typing...", "bot");

  fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .then(res => res.json())
  .then(data => {
    chatBox.removeChild(chatBox.lastChild);
    addMsg(data.reply, "bot");
  })
  .catch(() => {
    chatBox.removeChild(chatBox.lastChild);
    addMsg("❌ Server error. Please try again.", "bot");
  });
}

/* ---------- BUTTONS ---------- */
function whySoyWax() {
  sendToBot("Why should I use soy wax candles?");
}

function placeOrder() {
  sendToBot("I want to place an order");
}

