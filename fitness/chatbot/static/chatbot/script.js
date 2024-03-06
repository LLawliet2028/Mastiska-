const chatInput = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector(".delete-btn");
const themeButton = document.querySelector(".theme-btn");

const API_KEY = "AIzaSyDGpvfeJqypX7FPFF-LjHrmYerU8KL1ps";
let userText = null;

const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("themecolor");
    document.body.classList.toggle("light-mode", themeColor === "light");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "Dark Mode" : "Light Mode";

    const defaultText = <div class="default-text"><h1>Palm Bot</h1></div>;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
};

const getChatResponse = async (inChatDiv) => {
    const API_ENDPOINT = https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=${API_KEY};

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: {
                content: "",
                examples: [],
                messages: [
                    {
                        content: userText,
                    },
                ],
            },
            temperature: 0.25,
            top_k: 40,
            top_p: 0.95,
            candidate_count: 1,
        }),
    };
    try {
        const response = await fetch(API_ENDPOINT, requestOptions);
        const data = await response.json();

        if (data.filters && data.filters.length > 0 && data.filters[0].reason === "OTHER") {
            inChatDiv.querySelector(".typing-animation").remove();
            const errorMessage = "Sorry, I can't assist with this.";
            const errorElement = document.createElement("p");
            errorElement.textContent = errorMessage;
            inChatDiv.querySelector(".chat-details").appendChild(errorElement);
        } else if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            inChatDiv.querySelector(".typing-animation").remove();
            const message = data.candidates[0].content;
            const messageElement = document.createElement("p");
            messageElement.textContent = message;
            inChatDiv.querySelector(".chat-details").appendChild(messageElement);
        } else {
            throw new Error("API call failed");
        }
    } catch (error) {
        inChatDiv.querySelector(".typing-animation").remove();
        const errorElement = document.createElement("p");
        errorElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
        inChatDiv.querySelector(".chat-details").appendChild(errorElement);
    }
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
});

themeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light-mode");
    localStorage.setItem("themecolor", isLightMode ? "light" : "dark");
    themeButton.innerText = isLightMode ? "Dark Mode" : "Light Mode";
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = ${chatInput.scrollHeight}px;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = 'auto';

    const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="./img/user.png" alt="user-img">
        <p>${userText}</p>
    </div>
    </div>`;

    const outChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(() => getChatResponse(outChatDiv), 500);
};

sendButton.addEventListener("click", handleOutgoingChat);

loadDataFromLocalStorage();
