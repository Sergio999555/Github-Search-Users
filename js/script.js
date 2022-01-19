const input = document.querySelector('.search__input');
const searchLi = document.querySelectorAll('.search__item');
const bookmarks = document.querySelector('.bookmarks__result');
let result;

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
    searchLi.forEach(item => item.classList.add('search__item--hidden'));
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

    cardDiv.append(avatar);
    cardDiv.append(nameTitle);
    cardDiv.append(nameRepo);
    cardDiv.append(stars);
    cardDiv.append(closeButton);
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
    input.value ='';
    clearSearchList();
}));


const deleteBookmark = (event) => {
    if (!event.target.classList.contains('bookmarks__item--close')) return;
    const bookmark = event.target.closest('.bookmarks__item');
    bookmark.remove();
};

input.addEventListener('input', debounce(inputHandler, 500));
bookmarks.addEventListener('click', deleteBookmark);