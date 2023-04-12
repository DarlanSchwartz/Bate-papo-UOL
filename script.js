axios.defaults.headers.common['Authorization'] = 'sI7b4Z8QE5opnAc5PF2Xgwuz';
const userInputName =  document.querySelector(".login-username");
let statusInterval = null;
let myUsername = null;

let visibilityState = 'public';
let receivers = 'all';

function CheckLoginEvent(event){

    if(event.key === "Enter")
    {
        TryLogin();
    }
}

function TryLogin()
{
    const loginObj = { name: userInputName.value };
    let answer = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants ",loginObj);
    answer.then (Login);
    answer.catch(ErrorFix);
    console.log(answer);
}

function Login(data)
{
    myUsername = { name: userInputName.value };
    userInputName.value = null;
    document.querySelector(".login-screen").classList.add("hidden");
    document.querySelector(".header-container").classList.remove("hidden");
    document.querySelector(".messages-container").classList.remove("hidden");
    document.querySelector(".send-msg-container").classList.remove("hidden");
    statusInterval = setInterval(UpdateStatus, 5000);
    console.log(data);
    //document.querySelector(".visibility-settings-window").classList.remove("hidden");
}

function ErrorFix(error)
{
    console.log("Status code: " + error.response.status); // Ex: 404
	console.log("Mensagem de erro: " + error.response.data); // Ex: Not Found
}

function UpdateStatus()
{
    const status = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", myUsername);
    status.then (LogStatus);
}


function LogStatus(data)
{
    console.log(data);
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

    console.log(visibilityState);

}
