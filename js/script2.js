const input = document.querySelector('.search__input');
const searchLi = document.querySelectorAll('.search__item');
const bookmarks = document.querySelector('.bookmarks__result');

const sendRequest = (value) => {
    return fetch(`https://api.github.com/search/repositories?q=${value}&sort=stars&per_page=5`)
        .then(res => res.json())
        .then(res => res.items);
};

const createSearchItems = (item, index) => { 
    const searchTitle = document.createElement('h3');
    searchTitle.textContent = item.name;
    searchTitle.id = item.id;
    searchTitle.classList.add('search__title');
    searchLi[index].append(searchTitle);
    searchLi[index].classList.remove('search__item--hidden');
};

const notFound = () => {
    const notFoundSpan = document.querySelector('.notfound');
    notFoundSpan.classList.remove('notfound--hidden');
};

const notFoundDelete = () => {
    const notFoundSpan = document.querySelector('.notfound');
    notFoundSpan.classList.add('notfound--hidden');
};

const clear = () => {
    let searchResults = document.querySelectorAll('.search__title'); 
    if (searchResults.length !== 0) searchResults.forEach((item) => item.remove());
};

const createBookmark = (obj) => {
    const cardDiv = document.createElement('div');
    const li = document.createElement('li');
    const avatar = document.createElement('img');
    const nameTitle = document.createElement('p');
    const nameRepo = document.createElement('p');
    const stars = document.createElement('p');
    const closeButton = document.createElement('button');

    cardDiv.classList.add('bookmarks__content');
    li.classList.add('bookmarks__item');
    avatar.classList.add('bookmarks__item--avatar');
    nameTitle.classList.add('bookmarks__item--name');
    nameRepo.classList.add('bookmarks__item--login');
    stars.classList.add('bookmarks__item--stars');
    closeButton.classList.add('bookmarks__item--close');

    closeButton.textContent = 'Закрыть';
    closeButton.style.fontSize = '16px';
    closeButton.style.fontWeight = '700';

    avatar.src = obj.owner.avatar_url;
    nameTitle.textContent = `name: ${obj.name}`;
    nameRepo.textContent = `login: ${obj.owner.login}`;
    stars.textContent = `stars: ${obj.stargazers_count}`;

    cardDiv.append(avatar, nameTitle, nameRepo, stars, closeButton);
    li.append(cardDiv);
    bookmarks.append(li);
};

const clearSearchList = () => {
    const searchResult = document.querySelectorAll('.search__item'); 
    searchResult.forEach(item => item.textContent = '');
    searchResult.forEach(item => item.classList.add('search__item--hidden'));
};

const debounce = (fn, debounceTime) => {
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime);
    }
};

const inputHandler = async (event) => {
    const value = event.target.value; 
    const result = await sendRequest(value);

    notFoundDelete();

    if (!searchLi[0].classList.contains('search__item--hidden')) {
        searchLi.forEach(item => item.classList.add('search__item--hidden'));
        clear();
    };

    if (value.length > 0) result.forEach((item, index) => createSearchItems(item, index));
    if (result.length === 0) notFound();

    searchLi.forEach(item => item.addEventListener('click', () => {
        const target = item.firstElementChild.textContent;
        const targetObj = result.find((item) => item.name === target);
        createBookmark(targetObj);
        input.value ='';
        clearSearchList();
    }));
    localStorage.setItem('input', input.value);
};

window.onload = () => {
    input.value = localStorage.getItem('input');
};

const deleteBookmark = (event) => {
    if (!event.target.classList.contains('bookmarks__item--close')) return;
    const bookmark = event.target.closest('.bookmarks__item');
    bookmark.remove();
};

input.addEventListener('input', debounce(inputHandler, 500));
bookmarks.addEventListener('click', deleteBookmark);