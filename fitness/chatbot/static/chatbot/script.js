const chatINput = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-btn");
const chatcontainer = document.querySelector(".chat-container");
const deletebutton = document.querySelector("delete-btn");
const themebutton = document.querySelector("theme-btn");

const API_KEY = "AIzaSyDGpvfeJqypX7FPFF-Lj4HrmYerU8KL1ps"
let UserText = null;

const loadDataFromLocalStorage = () =>{
    const themeColor = localStorage.getItem("themecolor");
    document.body.classList.toggle("light-mode", themeColor === "light mode");
    themebutton.innerText = document.body.classList.contains("light-mode") ? "dark mode" : "light mode";

    const defaultText = <div class ="default-text">
        <h1>Palm Bot</h1>
    </div>
    chatcontainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
};

const createchathelement =(content,classname) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat",classname);
    chatDiv.innerHTML=content;
    return chatDiv;
};
const getchatresponse = async(inchatdiv) => {
    const API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=" + API_KEY;

    const requestOption = {
        method: "POST",
        header:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            prompt:{
                content:"",
                examples:[],
                messages:[
                    {
                        content: UserText,
                    },
                ],
            },
            tempreture: 0.25,
            top_k: 40,
            top_p: 0.95,
            candidate_count: 1,
        }),
    };
    try{
        const response = await fetch (API_ENDPOINT, requestOptions);
        const data = await response.json();

        if (
            data.filters &&
            data.filters.length>0&&
            data.filters[0].reason === "OTHER"
        ){
            inchatdiv.querySelector(".typing-animation").removed();
            const errormessages = "Sorry, I can't assist you with this.";
            const errorElement = document.createElement("p");
            errorElement.textContent = errorMessage;
            inchatdiv.querySelector(".chat-details").appendChild(errorElement);

        } else if (
            data.candidates && 
            data.candidates.length>0&&
            data.candidates[0].content
        ){
            inchatdiv.querySelector(".typing-animation").remove();
            const message = data.ca [0].content;
            const messageElement = document.createElement("p");
            messageElement.textContent = message;
            inchatdiv.querySelector(".chat-details").appendChild(messageElement);
    
        } else {
            throw new Error("Api call failed");
        }
    } catch (error) {
        inchatdiv.querySelector(".typing-animation").remove();
        const errorElement = document.createElement("p");
        errorElement.textContent = "Oops ! something went wrong while retrieving the response. Please try again";
        inchatdiv.querySelector(".chat-details").appendChild(errorElement);

    }
    localStorage.serItem("all-chats, chatContainer.innerHTML");
    chatcontainer.scrollTo(0,chatcontainer.scrollHeight);
};
const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "Done";
    setTimeout(() => (copyBtn.textContent = " content_copy"), 1000);
};

const showTypingAnimation = () => {
    const html = < div class = "chat-content">
        <div class = "chat-details"> 
           <img src ="./img/robot.png" alt ="chatbot-img"></img>
           <div class = "typing animation">
               <div class = "typing dot" style="--delay:0.2s"></div>
               <div class = "typing dot" style="--delay:0.2s"></div>
               <div class = "typing dot" style="--delay:0.2s"></div>
            </div>
        </div>
        <span onclick = "copyresponse(this)" class ="material-symbols-rounded">content_copy</span> 
    </div>;

    const inchatdiv = createchathelement(html, "incoming");
    chatcontainer.appendChild(inchatdiv);
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
    getchatresponse(inchatdiv);
};
const handleoutgoingchat = () => {
    UserText = chatINput.value.trim();
    if(!UserText) return;

    chatINput.value = "";
    chatINput.style.height = '${initialinputHeight}px' ;

    const html = <div class = "chat-content">
    <div class = "chat-details">
        <img src = "./img/user.png" alt = "user-img"></img>
        <p>${UserText}</p>
    </div>
    </div>;

    const outchatDiv = createchathelement (html, "outgoing");
    chatcontainer.querySelector(".default-text")?.remove();
    chatcontainer.appendChild(outchatDiv);
    chatcontainer.scrollTo(0,chatcontainer,scrollHeight);
    setTimeout(showTypingAnimation, 500);
    getchatresponse(outchatDiv);
};

deletebutton.addEventListener("click", () => {
    if(confirm("Are you sure you want to delete all chats ?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
});

themebutton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themecolor",themebutton.innerText);
    themebutton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialinputHeight = chatINput.scrollHeight;

chatINput.addEventListener("input", () => {
    chatINput.style.height = '${initialinputHeight}';
    chatINput.style.height  = '${chatInput.scrollHeight}px';
});

chatINput.addEventListener("keydown",(e) => {
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleoutgoingchat();
    }
});

loadDataFromLocalStorage();
sendButton.addEventListener("click",handleoutgoingchat);