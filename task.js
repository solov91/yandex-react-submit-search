const form = document.querySelector('.search__form');
const resultsContainer = document.querySelector('.search__findings-list');
const countContainer = document.querySelector('.search__findings');
const errorContainer = document.querySelector('.search__error');
const xhr = new XMLHttpRequest()




const renderError = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            Произошла ошибка...
        </p>
  `;
  countContainer.innerHTML = '';
};

const renderEmptyResults = () => {
  errorContainer.innerHTML = `
        <img src="https://code.s3.yandex.net/web-code/entrance-test/search.svg" alt="" class="search__error-icon" />
        <p class="search__error-message">
            По вашему запросу ничего не найдено, попробуйте уточнить запрос
        </p>
  `;
  countContainer.innerHTML = '';
};

const renderCount = count => {
  countContainer.innerHTML = `
      Найдено <span class="search__findings-amount">${count.toLocaleString(
        'ru-RU'
      )}</span> результатов
  `;
};

const onSubmitStart = () => {
  countContainer.innerHTML = `Загрузка...`;
  resultsContainer.innerHTML = '';
  errorContainer.innerHTML = '';
};

function template(item) {
  const newElement = document.createElement('li');
  newElement.classList.add('search__finding-item');
  newElement.innerHTML = 
      `<a href="${item.html_url}" class="search__finding-link">${item.full_name}</a>
      <span class="search__finding-description">${item.description}</span>`;
  return newElement;
}


form.addEventListener('submit', async function onSubmit(e) {
  e.preventDefault()

  let linkU = `https://api.nomoreparties.co/github-search?q=${form[0].value}`

  sendRequest('GET', linkU)
  .then(onSubmitStart())
  .then(data => {
    if(data.total_count > 0) {
        renderCount(data.total_count)
        data.items.forEach(a => resultsContainer.append(template(a)))
      }
    if(data.total_count < 1) renderEmptyResults()
     })
  .catch(err => renderError())
})

function sendRequest (method, url){
  return new Promise((resolve, reject) => {
    xhr.open(method, url)

    xhr.responseType = 'json'
  
    xhr.onload =() => {
      if(xhr.status >= 400){
        reject(renderError())
      }
      resolve(xhr.response)
    }
    xhr.onerror = () => {
      reject(renderError())
    }
    xhr.send()
  })
}
