const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

function addMessageToChat(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.innerText = `${sender}: ${message}`;
  chatBody.appendChild(messageElement);
}

sendButton.addEventListener("click", async () => {
  const message = chatInput.value;
  addMessageToChat(message, "user");

  const response = await fetch("your_chatbot_backend_url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (response.ok) {
    const reply = await response.json();
    addMessageToChat(reply, "bot");
  } else {
    addMessageToChat("Error occurred. Please try again.", "bot");
  }

  chatInput.value = "";
});
```

请注意，将 `your_chatbot_backend_url` 替换为实际的聊天机器人后端服务的URL。