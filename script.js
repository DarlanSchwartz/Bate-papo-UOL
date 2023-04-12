axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';
const userInputName =  document.querySelector(".login-username");
const userInputMessage = document.querySelector(".input-msg-text");

let statusInterval = null;
let messagesInterval = null;
let myUsername = null;

let visibilityState = 'public';
let receivers = 'all';

const msgURL = "https://mock-api.driven.com.br/api/vm/uol/messages";
const loginURL = "https://mock-api.driven.com.br/api/vm/uol/participants";
const statusURL = "https://mock-api.driven.com.br/api/vm/uol/status";

function CheckLoginEvent(event){

    if(event.key === "Enter")
    {
        TryLogin();
    }
}

function TryLogin()
{
    if(userInputName.value === '' || userInputName.value === null)
    {
        return;
    }
    
    const loginObj = { name: userInputName.value };
    
    document.querySelector(".loading-gif").classList.remove('hidden');
    document.querySelector(".login-screen p").classList.remove('hidden');
    document.querySelector(".login-btn").classList.add('hidden');
    document.querySelector(".login-username").classList.add('hidden');

    let answer = axios.post(loginURL,loginObj);
    answer.then (Login);

    answer.catch(ErrorFix);
}

function Login()
{
    myUsername = { name: userInputName.value };
    userInputName.value = null;
    document.querySelector(".login-screen").classList.add("hidden");
    document.querySelector(".header-container").classList.remove("hidden");
    document.querySelector(".messages-container").classList.remove("hidden");
    document.querySelector(".send-msg-container").classList.remove("hidden");
    statusInterval = setInterval(UpdateStatus, 5000);
    messages = setInterval(GetServerMessages,3000);
    GetServerMessages();
    GetUsers();
}

function ErrorFix(error)
{
    console.log("Status code: " + error.response.status); // Ex: 404
	console.log("Mensagem de erro: " + error.response.data); // Ex: Not Found

    document.querySelector(".loading-gif").classList.add('hidden');
    document.querySelector(".login-screen p").classList.add('hidden');
    document.querySelector(".login-btn").classList.remove('hidden');
    document.querySelector(".login-username").classList.remove('hidden');

    alert('Usuário ja se encontra logado e ou seu nome de usuário é inválido!');
}

function UpdateStatus()
{
    axios.post(statusURL, myUsername);
}

function OpenVisibilitySettings()
{
    document.querySelector(".visibility-settings-window").classList.toggle('open');
    document.querySelector(".modal-background").classList.remove('hidden');
}

function CloseVisibilitySettings()
{
    document.querySelector(".visibility-settings-window").classList.toggle('open');    
    document.querySelector(".modal-background").classList.add('hidden');
}

function SetVisibilityState(state)
{
    visibilityState = state;
    const publicBtn = document.querySelector(".public-btn");
    const privateBtn = document.querySelector(".private-btn");

    if(state === "public")
    {
        publicBtn.querySelector('.checkmark').classList.remove('hidden');
        privateBtn.querySelector('.checkmark').classList.add('hidden');
    }
    else if(state === "private")
    {
        publicBtn.querySelector('.checkmark').classList.add('hidden');
        privateBtn.querySelector('.checkmark').classList.remove('hidden');
    }
}

function SetReceiver(receiver)
{
    if(receiver === "all")
    {
        receivers = receiver;
    }
    else
    {
        receivers = receiver.querySelector('p').innerHTML;
    }

    const allBtn = document.querySelector(".all-users-btn");

    if(receiver === "all")
    {
        allBtn.querySelector('.checkmark').classList.remove('hidden');
        const allUsers = document.querySelectorAll(".user-btn");
        allUsers.forEach(user =>{
            user.querySelector('.checkmark').classList.add('hidden');
        });
    }
    else
    {
        allBtn.querySelector('.checkmark').classList.add('hidden');

        const allUsers = document.querySelectorAll(".user-btn");
        allUsers.forEach(user =>{
            user.querySelector('.checkmark').classList.add('hidden');
        });

        receiver.querySelector('.checkmark').classList.remove('hidden');
    }
}

function SendMessageEvent(event)
{
    if(event.key === "Enter")
    {
        SendMessage();
    }
}

function SendMessage()
{
    const msgText = document.querySelector(".input-msg-text").value;

    if(msgText === null || msgText === "")
    {
        return;
    }

    const sendingTo = receivers == 'all' ? 'Todos' : receivers;
    const messageType = visibilityState == 'public' ? "message" : "private_message";

    const msgObject = 
    {
        from: myUsername.name,
        to: sendingTo,
        text: msgText,
        type: messageType
    }

    const SendMessagePromise = axios.post(msgURL,msgObject);

    document.querySelector(".input-msg-text").value = '';

    SendMessagePromise.then(GetServerMessages);
}

function GetServerMessages()
{
    const messages = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    messages.then(UpdateMessages);
}

function UpdateMessages(allMessages)
{
    document.querySelector(".messages-container").innerHTML = '';
    
    console.log(allMessages);

    allMessages.data.forEach( msg =>{

        const isStatus = msg.type === "status" ? "msg-box status-msg" : "msg-box";

        if(msg.to === "Todos")
        {
            document.querySelector(".messages-container").innerHTML +=
            `
            <div class="${isStatus}">
                <div class="msg-time">${msg.time}</div>
                <div class="msg-username">${msg.from}</div>
                <div class="msg-content">${msg.text}</div>
            </div>
        `;
        }
        else
        {
            if(msg.to === myUsername.name || msg.from === myUsername.name)
            {
                let privateMsgFormat = "reservadamente para <em>" + msg.to + "</em>: " + msg.text;
                document.querySelector(".messages-container").innerHTML +=
                `
                <div class="msg-box private-msg">
                    <div class="msg-time">${msg.time}</div>
                    <div class="msg-username">${msg.from}</div>
                    <div class="msg-content">${privateMsgFormat}</div>
                </div>
                `;
            }
        }
    });

    const div = document.querySelector(".messages-container");
    const lastChild = div.lastElementChild;
    lastChild.scrollIntoView();
}

function GetUsers()
{
    const users = axios.get(loginURL);
    users.then(UpdateUsers);
}

function UpdateUsers(data)
{
    const serverUsers = data.data;
    document.querySelector(".remittees-container").innerHTML = '';


    document.querySelector(".remittees-container").innerHTML +=
    `
        <div onclick="SetReceiver('all')" class="all-users-btn vbtn">
            <ion-icon class="all-users-icon" name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
        </div>
    `;

    serverUsers.forEach ( user =>{

        document.querySelector(".remittees-container").innerHTML +=
        `
            <div onclick="SetReceiver(this)" class="user-btn vbtn">
                <ion-icon name="person-circle"></ion-icon>
                <p>${user.name}</p>
                <ion-icon class="checkmark hidden" name="checkmark-sharp"></ion-icon>
            </div>
        `;
    });
}