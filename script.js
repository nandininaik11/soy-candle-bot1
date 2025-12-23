const chatBox = document.getElementById("chatBox");
const BACKEND_URL = "https://soy-candle-bot1.vercel.app/api/chat";

// =======================
// GLOBAL VARIABLES
// =======================
const chatBox = document.getElementById("chatBox");
const optionsDiv = document.getElementById("options");

let selectedFragrance = null;
let selectedSize = null;

// =======================
// BASIC CHAT FUNCTIONS
// =======================
function addMsg(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearButtons() {
  optionsDiv.innerHTML = "";
}

function showButtons(buttons) {
  clearButtons();
  buttons.forEach(btn => {
    const button = document.createElement("button");
    button.innerText = btn.text;
    button.onclick = btn.onClick;
    optionsDiv.appendChild(button);
  });
}

// =======================
// INITIAL GREETING
// =======================
function startChat() {
  addMsg("Hello! I can help you order soy wax candles 🕯️", "bot");

  showButtons([
    { text: "🛒 Place Order", onClick: startOrder },
    { text: "🌿 Why Soy Wax?", onClick: explainSoyWax }
  ]);
}

startChat();

// =======================
// INFO FLOW
// =======================
function explainSoyWax() {
  addMsg("Why should I use soy wax candles?", "user");

  addMsg(
    "Soy wax candles are eco-friendly 🌱, non-toxic, burn longer, and are safer for children and pets.",
    "bot"
  );

  showButtons([
    { text: "🛒 Place Order", onClick: startOrder }
  ]);
}

// =======================
// ORDER FLOW
// =======================
function startOrder() {
  addMsg("I want to place an order", "user");

  addMsg("Great! 😊 Please choose a fragrance:", "bot");

  showButtons([
    { text: "🌹 Rose", onClick: () => selectFragrance("Rose") },
    { text: "💜 Lavender", onClick: () => selectFragrance("Lavender") },
    { text: "🌊 Ocean", onClick: () => selectFragrance("Ocean") }
  ]);
}

function selectFragrance(frag) {
  selectedFragrance = frag;
  addMsg(frag, "user");

  addMsg("Nice choice! Please select a size 📦", "bot");

  showButtons([
    { text: "50 ml – ₹299", onClick: () => selectSize("50 ml – ₹299") },
    { text: "100 ml – ₹499", onClick: () => selectSize("100 ml – ₹499") }
  ]);
}

function selectSize(size) {
  selectedSize = size;
  addMsg(size, "user");

  addMsg(
    `Perfect! ✅\n\nFragrance: ${selectedFragrance}\nSize: ${selectedSize}\n\nPlease enter your name and delivery address.`,
    "bot"
  );

  clearButtons();
}

// =======================
// TEXT INPUT HANDLING
// =======================
function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  addMsg(msg, "user");
  input.value = "";

  // Simple confirmation logic
  if (selectedFragrance && selectedSize) {
    addMsg(
      "Thank you! 😊 Your order has been noted. We will contact you shortly for confirmation and payment details.",
      "bot"
    );
  } else {
    addMsg(
      "Please use the buttons above to place your order.",
      "bot"
    );
  }
}
