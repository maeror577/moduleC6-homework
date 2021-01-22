const echoURL = "wss://echo.websocket.org/";
const mapsURL = "https://www.openstreetmap.org/#map=18/";

// Устанавливаем соединение при открытии страницы.
const websocket = new WebSocket(echoURL);

// Меняем состояние статуса собеседника в чате в зависимости
// от состояния соединения.
const statusNode = document.querySelector(".status-offline");
websocket.onopen = (event) => {
  statusNode.classList.toggle("status-online");
  statusNode.textContent = "Server is online"
}
websocket.onmessage = (event) => {
  // Ничего лучше, чем проверять не начинается ли ответ сервера
  // со ссылки на карты, не придумал.
  if (!event.data.startsWith(mapsURL)) {
    showMessageInChat(event.data, false);
  }
}
websocket.onerror = (event) => {
  showMessageInChat("Error: " + event.data, false);
}
websocket.onclose = (event) => {
  statusNode.classList.toggle("status-online");
  statusNode.textContent = "Server is offline";
}



// Находим DOM-элементы каждой кнопки, поля ввода и чата.
const inputNode = document.querySelector(".input-wrapper__input");
const buttonSendNode = document.querySelector(".button-send");
const buttonGeolocationNode = document.querySelector(".button-geolocation");
const buttonSendIconNode = document.querySelector(".button-send-icon");
const buttonGeolocationIconNode =
  document.querySelector(".button-geolocation-icon");
const buttonClearIconNode = document.querySelector(".button-clear-icon");
const chatNode = document.querySelector(".chat-wrapper");

// Восстанавливаем содержимое чата из localStorage и автоматически
// проматываем в конец истории.
chatNode.innerHTML = localStorage.getItem("chatHistory");
chatNode.scrollTop = chatNode.scrollHeight;



// Функция добавления карточки сообщения в окно чата.
function showMessageInChat(message, isClient, link = null) {
  const messageCard = document.createElement("div");

  messageCard.classList.add("chat-wrapper__message");
  messageCard.classList.add(isClient ? "client-message" : "server-message");
  if (link) {
    const linkMessage = document.createElement("a");
    linkMessage.classList.add("link-content");
    linkMessage.textContent = message;
    linkMessage.href = link;
    messageCard.appendChild(linkMessage);
  } else {
    const textMessage = document.createElement("p");
    textMessage.classList.add("text-content");
    textMessage.textContent = message;
    messageCard.appendChild(textMessage);
  }

  // К каждому сообщению добавляем время отправки.
  const timestamp = document.createElement("p");
  const currentTime = new Date();
  timestamp.classList.add("timestamp");
  timestamp.textContent = currentTime.toLocaleTimeString();
  messageCard.appendChild(timestamp);

  chatNode.appendChild(messageCard);
  chatNode.scrollTop = chatNode.scrollHeight;

  // Обновляем содержимое localStorage.
  localStorage.setItem("chatHistory", chatNode.innerHTML);
}



buttonSendNode.addEventListener("click", () => {
  const message = inputNode.value;

  // Отправляем сообщение в чат и собеседнику только в том случае,
  // если сообщение не пустое.
  if (message) {
    showMessageInChat(message, true);
    // Перед отправкой сообщения серверу, проверяем статус соединения.
    // Если канал закрыт, то сообщение просто не отправляется.
    if (websocket.readyState) {
      websocket.send(message);
    }
  }
  // После любой попытки отправки, удачной или неудачной, очищаем поле ввода.
  inputNode.value = null;
});



buttonGeolocationNode.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not compatible with your browser");
  } else {

    // В ожидании определения местоположения кнопки будут пульсировать.
    buttonGeolocationNode.classList.toggle("pulse");
    buttonGeolocationIconNode.classList.toggle("pulse");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const mapLink = mapsURL + "/" + latitude + "/" + longitude;
        showMessageInChat("My location", true, mapLink);
        websocket.send(mapLink);

        buttonGeolocationNode.classList.toggle("pulse");
        buttonGeolocationIconNode.classList.toggle("pulse");
      },
      () => {
        alert("Sorry, we're unable to find your location");
        
        buttonGeolocationNode.classList.toggle("pulse");
        buttonGeolocationIconNode.classList.toggle("pulse");
      });
  }
});



// Кнопки с иконками повторяют события кнопок с надписями.
buttonSendIconNode.addEventListener("click", () => {
  buttonSendNode.click();
});



buttonGeolocationIconNode.addEventListener("click", () => {
  buttonGeolocationNode.click();
});



buttonClearIconNode.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this dialog?")) {
    chatNode.innerHTML = null;
    localStorage.removeItem("chatHistory");
  }
});



inputNode.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    buttonSendNode.click();
  }
});



// Нажатие Escape в поле ввода очищает его.
inputNode.addEventListener("keyup", function(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    inputNode.value = null;
  }
});
