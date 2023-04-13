axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';
const userInputName =  document.querySelector(".login-username");
const userInputMessage = document.querySelector(".input-msg-text");

let statusInterval = null;
let messagesInterval = null;
let usersInterval = null;
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
    answer.then(Login);
    answer.catch(LoginError);
}

function Login()
{
    GetServerMessages();
    GetUsers();
    
    
    statusInterval = setInterval(GetUsers, 10000);
    messages = setInterval(GetServerMessages,3000); //alterado
    usersInterval =setInterval(UpdateStatus,3000);

    myUsername = { name: userInputName.value };
    userInputName.value = null;
    document.querySelector(".login-screen").classList.add("hidden");
    document.querySelector(".header-container").classList.remove("hidden");
    document.querySelector(".messages-container").classList.remove("hidden");
    document.querySelector(".send-msg-container").classList.remove("hidden");

   // if(document.querySelector(".messages-container").lastElementChild != null) /// Alterado
   // {
        document.querySelector(".messages-container").lastElementChild.scrollIntoView({ behavior: "smooth" });
   // }

    SetReceiver('all');
    SetVisibilityState('public');
}

function LoginError(error)
{
    console.log("Status code: " + error.response.status); // Ex: 404
	console.log("Mensagem de erro: " + error.response.data); // Ex: Not Found

    document.querySelector(".loading-gif").classList.add('hidden');
    document.querySelector(".login-screen p").classList.add('hidden');
    document.querySelector(".login-btn").classList.remove('hidden');
    document.querySelector(".login-username").classList.remove('hidden');

    alert('Digite outro nome');
}

function UpdateStatus()
{
    const userStatus = axios.post(statusURL, myUsername);
    //userStatus.then(console.log("loggedin"))
    //userStatus.catch(ReturnToLogin);
}

function ReturnToLogin()
{
    document.querySelector(".login-btn").classList.remove('hidden');
    document.querySelector(".login-username").classList.remove('hidden');
    document.querySelector(".login-screen").classList.remove("hidden");
    document.querySelector(".header-container").classList.add("hidden");
    document.querySelector(".messages-container").classList.add("hidden");
    document.querySelector(".send-msg-container").classList.add("hidden");
    document.querySelector(".messages-container").innerHTML = '';
    document.querySelector(".remittees-container").innerHTML =
        `
            <div data-test="all" onclick="SetReceiver('all')" class="all-users-btn vbtn">
                <ion-icon class="all-users-icon" name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon data-test="check" class="checkmark" name="checkmark-sharp"></ion-icon>
            </div>
        `;
    document.querySelector(".input-msg-text").value = "";
    document.querySelector(".visibility-settings-window").classList.remove('open');    
    document.querySelector(".modal-background").classList.add('hidden');

    clearInterval(statusInterval);
    clearInterval(messagesInterval);
    clearInterval(usersInterval);

    SetReceiver('all');
    SetVisibilityState('public');

    myUsername = null;
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

    if(receivers == 'all')
    {
        document.querySelector(".sending-to-info").innerHTML = 
        `
            Enviando mensagem para (Todos)
        `;
    }
    else
    {
        if(visibilityState == 'public')
        {
            document.querySelector(".sending-to-info").innerHTML = 
            `
                Enviando mensagem para ${receivers} (Publico)
            `;
        }
        else if( visibilityState == 'private')
        {
            document.querySelector(".sending-to-info").innerHTML = 
            `
                Enviando mensagem para ${receivers} (Reservadamente)
            `;
        }
    }

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
        document.querySelector(".sending-to-info").innerHTML = 
        `
            Enviando mensagem para (Todos)
        `;
    }
    else
    {
        const receiverName = receiver.querySelector('p').innerHTML;
        receivers = receiverName;
        if(visibilityState == 'public')
        {
            document.querySelector(".sending-to-info").innerHTML = 
            `
                Enviando mensagem para ${receiverName} (Publico)
            `;
        }
        else if( visibilityState == 'private')
        {
            document.querySelector(".sending-to-info").innerHTML = 
            `
                Enviando mensagem para ${receiverName} (Reservadamente)
            `;
        }
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
    const correctMessageType = receivers == 'all' ? "message" : "private_message";
    const messageType = visibilityState == 'public' ? "message" : correctMessageType;

    console.log(messageType);

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

    allMessages.data.forEach( msg =>{

        const isStatus = msg.type === "status" ? "msg-box status-msg" : "msg-box";

        if(msg.to === "Todos")
        {
            document.querySelector(".messages-container").innerHTML +=
            `
            <div data-test="message" class="${isStatus}">
                <div class="msg-time">${msg.time}</div>
                <div class="msg-username">${msg.from}</div>
                <div class="msg-content">${msg.text}</div>
            </div>
        `;
        }
        else
        {
            if(msg.to === myUsername.name || msg.from === myUsername.name || msg.type === "message")
            {
                let privateMsgFormat = msg.type == "message" ? "para <em>" + msg.to + "</em>: " + msg.text : "reservadamente para <em>" + msg.to + "</em>: " + msg.text;
                let needColorRed = msg.type === "message" ? "" : "private-msg";
                document.querySelector(".messages-container").innerHTML +=
                `
                <div data-test="message" class="msg-box ${needColorRed}">
                    <div class="msg-time">${msg.time}</div>
                    <div class="msg-username">${msg.from}</div>
                    <div class="msg-content">${privateMsgFormat}</div>
                </div>
                `;
            }

        }
    });

    document.querySelector(".messages-container").lastElementChild.scrollIntoView({ behavior: "smooth" });
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
    const hadSelectedUser = receivers!= 'all';
    let keepSelectedUser =false;

    if(!hadSelectedUser)
    {
        document.querySelector(".remittees-container").innerHTML +=
        `
            <div data-test="all" onclick="SetReceiver('all')" class="all-users-btn vbtn">
                <ion-icon class="all-users-icon" name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon data-test="check" class="checkmark" name="checkmark-sharp"></ion-icon>
            </div>
        `;
    }
    else
    {
        document.querySelector(".remittees-container").innerHTML +=
        `
            <div data-test="all" onclick="SetReceiver('all')" class="all-users-btn vbtn">
                <ion-icon class="all-users-icon" name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon data-test="check" class="checkmark hidden" name="checkmark-sharp"></ion-icon>
            </div>
        `;
    }

    serverUsers.forEach ( user =>{

        if(hadSelectedUser == true)
        {
            if(receivers !='all')
            {
                if(receivers == user.name)
                {
                    keepSelectedUser = true;
                }
            }
        }
        
        if(user.name != myUsername.name)
        {
            if(keepSelectedUser == false)
            {
                document.querySelector(".remittees-container").innerHTML +=
                `
                    <div data-test="participant" onclick="SetReceiver(this)" class="user-btn vbtn">
                        <ion-icon name="person-circle"></ion-icon>
                        <p>${user.name}</p>
                        <ion-icon data-test="check" class="checkmark hidden" name="checkmark-sharp"></ion-icon>
                    </div>
                `;
            }
            else if(user.name == receivers)
            {
                document.querySelector(".remittees-container").innerHTML +=
                `
                    <div data-test="participant" onclick="SetReceiver(this)" class="user-btn vbtn">
                        <ion-icon name="person-circle"></ion-icon>
                        <p>${user.name}</p>
                        <ion-icon data-test="check" class="checkmark" name="checkmark-sharp"></ion-icon>
                    </div>
                `;
            }
        }
    });
}