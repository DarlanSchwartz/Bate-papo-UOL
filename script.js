// Add my hub token to every get from axios
axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';
// Login inputfield
const userInputName =  document.querySelector(".login-username");
// Message Inputfield
const userInputMessage = document.querySelector(".input-msg-text");

// Update intervals id's
let statusInterval = null;
let messagesInterval = null;
let usersInterval = null;

// My registered login username
let myUsername = null;

// Visibility of my message
let visibilityState = 'public';

// Who will receive my message
let receivers = 'all';

// Url's of api axios
const msgURL = "https://mock-api.driven.com.br/api/vm/uol/messages";
const loginURL = "https://mock-api.driven.com.br/api/vm/uol/participants";
const statusURL = "https://mock-api.driven.com.br/api/vm/uol/status";


// Check if i pressed enter inside the login inputfield and try login
function CheckLoginEvent(event){

    if(event.key === "Enter")
    {
        TryLogin();
    }
}

function TryLogin()
{
    // Check if the username is valid
    if(userInputName.value === '' || userInputName.value === null)
    {
        return;
    }
    
    // Create a object that the api accepts using the input value of the login inputfield as the "name" attribute of this object
    const loginObj = { name: userInputName.value };
    
    // Show login-in gif and text
    document.querySelector(".loading-gif").classList.remove('hidden');
    document.querySelector(".login-screen p").classList.remove('hidden');

    // Hide inputfield and login button of username
    document.querySelector(".login-btn").classList.add('hidden');
    document.querySelector(".login-username").classList.add('hidden');

    // Ask server if i can login with this object.name
    let answer = axios.post(loginURL,loginObj);
    // If i can login : Login
    answer.then(Login);
    // Else i ask for another name
    answer.catch(LoginError);
}

function Login()
{
    GetServerMessages();
    GetUsers();
    
    // Start updating messages users and send my logged in status
    statusInterval = setInterval(GetUsers, 5000);
    messagesInterval = setInterval(GetServerMessages,3000);
    usersInterval =setInterval(UpdateStatus,10000);

    // Assign my world var to this object below
    myUsername = { name: userInputName.value };
    
    //Clear the user inputfield name value
    userInputName.value = null;

    // Close the login screen
    document.querySelector(".login-screen").classList.add("hidden");
    
    // Show the header messages and send messages UI container
    document.querySelector(".header-container").classList.remove("hidden");
    document.querySelector(".messages-container").classList.remove("hidden");
    document.querySelector(".send-msg-container").classList.remove("hidden");

    // Set the default receiver of the messages to all / Todos
    SetReceiver('all');

    // Set the visibility of my message to default public / message
    SetVisibilityState('public');
}

// Catch login error
function LoginError(error)
{
    // Log the erros on console
    console.log("Status code: " + error.response.status); // Ex: 404
	console.log("Mensagem de erro: " + error.response.data); // Ex: Not Found

    // Hide loggin-in gif and text
    document.querySelector(".loading-gif").classList.add('hidden');
    document.querySelector(".login-screen p").classList.add('hidden');

    // Show login button and inputfield
    document.querySelector(".login-btn").classList.remove('hidden');
    document.querySelector(".login-username").classList.remove('hidden');

    // Ask for another name
    alert('Digite outro nome');
}

function ReturnToLogin(erro)
{
    // Reload page
    window.location.reload();
}

function UpdateStatus()
{
    // Send my current logged in status
    const userStatus = axios.post(statusURL, myUsername);

    // Reload page if i there is and error on updating my connection with the server
    userStatus.catch(ReturnToLogin);
}
function OpenVisibilitySettings()
{
    // Show Sidebar visibility setting on click users button on header and show alpha black background
    document.querySelector(".visibility-settings-window").classList.toggle('open');
    document.querySelector(".modal-background").classList.remove('hidden');
}

function CloseVisibilitySettings()
{
    // Close visibility settings on click on alpha black background
    document.querySelector(".visibility-settings-window").classList.toggle('open');    
    document.querySelector(".modal-background").classList.add('hidden');
}

function SetVisibilityState(state)
{
    // Set the visibility stat on click button of the visibility settings window
    visibilityState = state;

    // Get the public and private buttons of the visibility setting window
    const publicBtn = document.querySelector(".public-btn");
    const privateBtn = document.querySelector(".private-btn");

    // Update the text informing the user to wich person the message will go and for who else it will appear
    if(receivers == 'all')
    {
        // If the receivers are all update to this below
        document.querySelector(".sending-to-info").innerHTML = 
        `
            Enviando mensagem para (Todos)
        `;
    }
    else
    {
        // If the receivers are no all and the visibility is set to public
        if(visibilityState == 'public')
        {
            // If the visibility is set to public update to this below
            document.querySelector(".sending-to-info").innerHTML = 
            `
                Enviando mensagem para ${receivers} (Publico)
            `;
        }
        else if( visibilityState == 'private')
        {
            // If the visibility is set to private update to this below
            document.querySelector(".sending-to-info").innerHTML = 
            `
                Enviando mensagem para ${receivers} (Reservadamente)
            `;
        }
    }

    // Update checkmarks of the visibility state changes on click
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

// Check send message event on press enter inside the inputfield of input-message-text
function SendMessageEvent(event)
{
    if(event.key === "Enter")
    {
        SendMessage();
    }
}

// Try to send message
function SendMessage()
{
    // Get the message text from the input field of the input-message-text
    const msgText = document.querySelector(".input-msg-text").value;

    // Return if the message is empty or null
    if(msgText === null || msgText === "")
    {
        return;
    }

    // Get the corret receivers
    const sendingTo = receivers == 'all' ? 'Todos' : receivers;

    // Get the visibility of the message (public / private)
    const correctMessageType = receivers == 'all' ? "message" : "private_message";

    // If the message if public continues as a normal message else set as resevated message
    const messageType = visibilityState == 'public' ? "message" : correctMessageType;

    // Create message object
    const msgObject = 
    {
        from: myUsername.name,
        to: sendingTo,
        text: msgText,
        type: messageType
    }

    // Send and save message axios promise
    const SendMessagePromise = axios.post(msgURL,msgObject);

    // Clear the inputfield text
    document.querySelector(".input-msg-text").value = '';

    // Update messages if the send was sucessfull
    SendMessagePromise.then(GetServerMessages);
    
    // Return to login if there was an error
    SendMessagePromise.catch(ReturnToLogin);
}

function GetServerMessages()
{
    // Get messages from server and update if sucess or return to login if error
    const messages = axios.get(msgURL);
    messages.then(UpdateMessages);
    messages.catch(ReturnToLogin);
}

function UpdateMessages(allMessages)
{
    // Clear all messages
    document.querySelector(".messages-container").innerHTML = '';

    // Foreach message i receive back from the server
    allMessages.data.forEach( msg =>{

        // Check if it is and status message to add gray background
        const isStatus = msg.type === "status" ? "msg-box status-msg" : "msg-box";
        
        // If the message is for Todos just render it on the chat
        if(msg.to === "Todos")
        {
            // If the message is status just render the message
            if(msg.type == "status")
            {
                document.querySelector(".messages-container").innerHTML +=
                `
                <div data-test="message" class="${isStatus}">
                    <div>
                        <span style = "color: rgba(170, 170, 170, 1);font-weight: 400;font-size: 14px;">(${msg.time})</span><span class="msg-username" style = "padding-left: 8px;font-weight: 400;font-size: 14px;"><em>${msg.from} </em></span><span style = "font-size: 14px;">${msg.text}</span>
                    </div>
                </div>
                `;

            } // If the message is not status add the receiver on it , in this case para Todos <em>
            else
            {

                document.querySelector(".messages-container").innerHTML +=
                `
                <div data-test="message" class="${isStatus}">
                    <div>
                        <span style = "color: rgba(170, 170, 170, 1);font-weight: 400;font-size: 14px;">(${msg.time})</span><span class="msg-username" style = "padding-left: 8px;font-size: 14px;"><em>${msg.from} </em> para <em>Todos:</em> </span><span style = "font-size: 14px;">${msg.text}</span>
                    </div>
                </div>
                `;
            }
        }
        else
        {
            // If the message is not for Todos but the sender or reiver or the type of the message is public 
            if(msg.to === myUsername.name || msg.from === myUsername.name || msg.type === "message")
            {
                // Format the message text to show it to only me or everyone
                let privateMsgFormat = msg.type == "message" ? "para <em>" + msg.to + "</em>: " + msg.text : "reservadamente para <em>" + msg.to + "</em>: " + msg.text;

                // Check if the message is for only me and color it red and render it
                let needColorRed = msg.type === "message" ? "" : "private-msg";

                document.querySelector(".messages-container").innerHTML +=
                `
                <div data-test="message" class="msg-box ${needColorRed}">
                    <div>
                        <span style = "color: rgba(170, 170, 170, 1);font-weight: 400;font-size: 14px;">(${msg.time})</span><span class="msg-username" style = "padding-left: 8px; font-size: 14px;"><em>${msg.from} </em></span><span style = "font-size: 14px;">${privateMsgFormat}</span>
                    </div>
                </div>
                `;
            }
        }
    });

    // Smooth scrool to new messages
    document.querySelector(".messages-container").lastElementChild.scrollIntoView({ behavior: "smooth" });
}

// Ask the server for users
function GetUsers()
{
    const users = axios.get(loginURL);
    // If i get the users sucessfully update the render on visibility window else return to login
    users.then(UpdateUsers);
    users.catch(ReturnToLogin);
}

function UpdateUsers(data)
{
    // Assing users data thos this var
    const serverUsers = data.data;
    // Clear the users from the visibility setting widnow
    document.querySelector(".remittees-container").innerHTML = '';
    // Check if i had a selected user previously
    const hadSelectedUser = receivers!= 'all';
    // Create this var to try to keep the selected user after the users refresh
    let keepSelectedUser = false;

    // If i didnt had a selected user just render the Todos button normally without checkmark on the right
    if(hadSelectedUser == false)
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
        // If i had a selected user render the todos button with checkmark hidden
        document.querySelector(".remittees-container").innerHTML +=
        `
            <div data-test="all" onclick="SetReceiver('all')" class="all-users-btn vbtn">
                <ion-icon class="all-users-icon" name="people"></ion-icon>
                <p>Todos</p>
                <ion-icon data-test="check" class="checkmark hidden" name="checkmark-sharp"></ion-icon>
            </div>
        `;
    }

    // Foreach user if get on the server data
    serverUsers.forEach ( user =>{

        // If i had a selected user
        if(hadSelectedUser == true)
        {
            // If the current receivers are not all (i dont know why i check this again)
            if(receivers !='all')
            {
                // If this user.name is the same i had selected keep the selected user after update
                if(receivers == user.name)
                {
                    keepSelectedUser = true;
                }
            }
        }
        
        // If this user.name is not myself
        if(user.name != myUsername.name)
        {
            // If the selected user i had selected !!! DIT NOT !!! stayed on the room after the update
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
            }  // If the selected user i had selected !! STAYED !! on the room after the update keep the checkmark on it
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

    // If the selected user i had selected !!! DIT NOT !!! stayed on the room after the update reset the default selected user to TODOS
    if(hadSelectedUser && keepSelectedUser == false)
    {
        SetReceiver('all');
    }
}