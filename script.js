const chatBox = document.getElementById("chatBox");
const optionsDiv = document.getElementById("options");

let fragrance = null;
let size = null;

// CHANGE THESE
const AI_URL = "https://YOUR-VERCEL-APP.vercel.app/api/chat";
const SHEET_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

function addMsg(text, cls) {
  const d = document.createElement("div");
  d.className = cls;
  d.innerText = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showButtons(btns) {
  optionsDiv.innerHTML = "";
  btns.forEach(b => {
    const btn = document.createElement("button");
    btn.innerText = b.text;
    btn.onclick = b.onClick;
    optionsDiv.appendChild(btn);
  });
}

function start() {
  addMsg("Hello! I can help you order soy wax candles 🕯️", "bot");
  showButtons([
    { text: "🛒 Place Order", onClick: startOrder },
    { text: "🌿 Why Soy Wax?", onClick: askAI }
  ]);
}
start();

function askAI() {
  addMsg("Why should I use soy wax candles?", "user");
  fetchAI("Why should I use soy wax candles?");
}

function startOrder() {
  addMsg("I want to place an order", "user");
  addMsg("Please choose a fragrance:", "bot");
  showButtons([
    { text: "Rose", onClick: () => selectFragrance("Rose") },
    { text: "Lavender", onClick: () => selectFragrance("Lavender") },
    { text: "Ocean", onClick: () => selectFragrance("Ocean") }
  ]);
}

function selectFragrance(f) {
  fragrance = f;
  addMsg(f, "user");
  addMsg("Select size:", "bot");
  showButtons([
    { text: "50 ml – ₹299", onClick: () => selectSize("50 ml") },
    { text: "100 ml – ₹499", onClick: () => selectSize("100 ml") }
  ]);
}

function selectSize(s) {
  size = s;
  addMsg(s, "user");
  addMsg("Please enter your name and address.", "bot");
  optionsDiv.innerHTML = "";
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, "user");
  input.value = "";

  if (fragrance && size) {
    saveOrder(text);
    addMsg("✅ Order saved! We’ll contact you soon.", "bot");
  } else {
    fetchAI(text);
  }
}

function fetchAI(msg) {
  fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  })
  .then(r => r.json())
  .then(d => addMsg(d.reply, "bot"))
  .catch(() => addMsg("AI error", "bot"
