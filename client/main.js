import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.lenght) {
      element.innerHTML += text.charAt(index);
      index++; 
    }else {
      clearInterval(interval)
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}}`
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper" ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img 
              src=${isAi ? bot : user}
          </div>
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    `
  )
}

async function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch("API", {
    method: 'POST',
    headers: {
      'Content-type': "application/json"
    },
    body: JSON.stringify({
      prompt: data.get("prompt")
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data= data.bot.trim();

    typeText(messageDiv, parsedData);
  }else  {
    const error =  await response.text();

    messageDiv.innerHTML  =  "Something went wrong!"
    alert(error)
  }
}

form.addEventListener("submit", handleSubmit)
form.addEventListener("keyup", function(e){
  if(e.keyCode === 13) {
    handleSubmit(e)
  }
})
