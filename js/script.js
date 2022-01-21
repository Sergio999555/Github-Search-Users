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
    const searchResults = document.querySelectorAll('.search__title'); 
    if (searchResults.length !== 0) searchResults.forEach((item) => item.remove());
    searchLi.forEach(item => item.classList.add('search__item--hidden'));
};

const saveBookmarksToLocalStorage = (bookmarkData) => {
    let data = [bookmarkData];
    const savedData = JSON.parse(localStorage.getItem('data'));

    if (savedData) {
        data = [...savedData, ...data];
    };
    
    localStorage.setItem('data', JSON.stringify(data))
};

const createElements = (elementTag, elementClass) => {
    const element = document.createElement(elementTag);
    element.classList.add(elementClass);
    return element;
};

const createBookmark = (obj) => {
    const cardDiv = createElements('div', 'bookmarks__content');
    const li = createElements('li', 'bookmarks__item');
    const avatar = createElements('img', 'bookmarks__item--avatar');
    const nameTitle = createElements('p', 'bookmarks__item--name');
    const nameRepo = createElements('p', 'bookmarks__item--login');
    const stars = createElements('p', 'bookmarks__item--stars');
    const closeButton = createElements('button', 'bookmarks__item--close');

    closeButton.textContent = 'Закрыть';
    closeButton.style.fontSize = '16px';
    closeButton.style.fontWeight = '700';

    avatar.src = obj.owner.avatar_url;
    nameTitle.textContent = `name: ${obj.name}`;
    nameRepo.textContent = `login: ${obj.owner.login}`;
    stars.textContent = `stars: ${obj.stargazers_count}`;
    li.id = obj.id;

    cardDiv.append(avatar, nameTitle, nameRepo, stars, closeButton);
    li.append(cardDiv);
    bookmarks.append(li);
};

const clearSearchList = () => {
    searchLi.forEach(item => item.innerHTML = '');
    searchLi.forEach(item => item.classList.add('search__item--hidden'));
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
    result = await sendRequest(value);

    notFoundDelete();

    if (!searchLi[0].classList.contains('search__item--hidden')) clear();
    if (value.length > 0 && result.length > 0) result.forEach((item, index) => createSearchItems(item, index));
    if (result?.length === 0) notFound();
};

searchLi.forEach(item => item.addEventListener('click', () => {
    let target = item.firstElementChild.textContent;
    let targetObj = result.find(item => item.name === target);

    createBookmark(targetObj);
    clearSearchList();
    saveBookmarksToLocalStorage(targetObj);
    
    input.value ='';
}));

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkData = JSON.parse(localStorage.getItem('data'));
    bookmarkData.forEach((item) => {
        createBookmark(item);
    });
});

const deleteBookmark = (event) => {
    if (!event.target.classList.contains('bookmarks__item--close')) return;
    const bookmark = event.target.closest('.bookmarks__item');
    bookmark.remove();

    let localStorageArray = [];
    localStorageArray = JSON.parse(localStorage.getItem('data')).filter(item => (item.id != bookmark.id));
    localStorage.setItem('data', JSON.stringify(localStorageArray));
};

input.addEventListener('input', debounce(inputHandler, 500));
bookmarks.addEventListener('click', deleteBookmark);