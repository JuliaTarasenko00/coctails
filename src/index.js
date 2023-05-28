import Notiflix from 'notiflix';
import { CoctailsAPI } from './script/CoctailsAPI';

const refs = {
  formEl: document.getElementById('form'),
  ulCategories: document.getElementById('categories-list'),
  ulCoctails: document.getElementById('coctails-list'),
  backdrop: document.querySelector('.backdrop'),
  modal: document.querySelector('.modal'),
  toCollection: document.querySelector('.to_collection'),
  loader: document.querySelector('.loader'),
  inputCheckbox: document.querySelector('.input_checkbox'),
  toTop: document.querySelector('.to_top'),
};

const savedSettings = localStorage.getItem('settings');
const parsedSettings = JSON.parse(savedSettings);

let coctailsCollections = parsedSettings || [];

let clickToCollection = false;

const api = new CoctailsAPI();
api.getCategories().then(res => markupCategoies(res));

function markupCategoies(data) {
  const markup = data
    .map(
      categorie =>
        `<li class="li_markupCategoies">${categorie.strCategory}</li>`
    )
    .join('');
  refs.ulCategories.innerHTML = markup;
}

refs.ulCategories.addEventListener('click', onClickCategories);

async function onClickCategories(ev) {
  clickToCollection = false;
  if (ev.target.nodeName !== 'LI') return;
  const categoriesValue = ev.target.textContent;
  refs.loader.classList.remove('visually-hidden');
  try {
    const res = await api.getCoctails(categoriesValue);
    markupCoctails(res);
  } catch (err) {
    console.log(err);
  } finally {
    refs.loader.classList.add('visually-hidden');
  }
}

function markupCoctails(data) {
  const markupCoctails = data
    .map(
      coctail => `<li id="${coctail.idDrink}">
   <img src="${coctail.strDrinkThumb}" alt="${coctail.strDrink}" loading="lazy" width="300"/>
   <h2>${coctail.strDrink}</h2>
   </li>`
    )
    .join('');
  refs.ulCoctails.innerHTML = markupCoctails;
}

refs.formEl.addEventListener('submit', onSubmitForm);

function onSubmitForm(ev) {
  ev.preventDefault();
  clickToCollection = false;
  const value = ev.currentTarget.elements.input.value.trim();
  // console.log(value);
  if (value === '') {
    Notiflix.Notify.failure('Введіть значення');
    return;
  }
  api.getByLetter(value).then(res => {
    if (!res) {
      Notiflix.Notify.warning('Введіть 1 літеру');
      return;
    }
    markupLetter(res);
  });
}

let ingredients = [];
let strMeasure = [];
for (let i = 1; i <= 15; i += 1) {
  ingredients.push(`strIngredient${i}`);
  strMeasure.push(`strMeasure${i}`);
}
// console.log(ingredients);
function markupLetter(data) {
  const marLetter = data
    .map(coctail => {
      const filteredIngredients = ingredients.filter(
        ingredient => coctail[ingredient]
      );
      return `<li id="${coctail.idDrink}">
    <img src="${coctail.strDrinkThumb}" alt="${
        coctail.strDrink
      }" loading="lazy" width="300"/>
    <h2>${coctail.strDrink}</h2>
    <p class="markup_letter_category">Category: ${coctail.strCategory}</p>
    <p class="markup_letter_glass">Glass: ${coctail.strGlass}</p>
    <ul class="coctail_ingredient">${filteredIngredients
      .map(
        ingredient => `<li class="markup_letter_item">${coctail[ingredient]}
    </li>`
      )
      .join('')}
    </ul>
    </li>`;
    })
    .join('');
  refs.ulCoctails.innerHTML = marLetter;
}

refs.ulCoctails.addEventListener('click', onClickCoctails);

function onClickCoctails(event) {
  const elementId = event.target.closest('li').id;
  refs.backdrop.classList.remove('is-hidden');
  api.getById(elementId).then(res => {
    markupById(res);
    const closeModal = document.querySelector('.backdrop-btn');
    const addCollection = document.querySelector('.add_collection');
    const resCoctail = res[0];
    if (
      coctailsCollections.find(
        coctail => coctail.idDrink === resCoctail.idDrink
      )
    ) {
      addCollection.textContent = 'Remove from collection';
    } else {
      addCollection.textContent = 'Add to collection';
    }
    addCollection.addEventListener('click', onClickAddCollection);
    closeModal.addEventListener('click', onClickModalBtn);
    function onClickAddCollection() {
      if (addCollection.textContent === 'Remove from collection') {
        const coctailIndex = coctailsCollections.findIndex(
          coctail => coctail.idDrink === resCoctail.idDrink
        );
        coctailsCollections.splice(coctailIndex, 1);
        localStorage.setItem('settings', JSON.stringify(coctailsCollections));
        addCollection.textContent = 'Add to collection';
      } else {
        coctailsCollections.push(resCoctail);
        localStorage.setItem('settings', JSON.stringify(coctailsCollections));
        addCollection.textContent = 'Remove from collection';
      }
      if (clickToCollection) {
        markupLetter(coctailsCollections);
      }
    }
    refs.backdrop.addEventListener('click', ev => {
      if (ev.target === ev.currentTarget) {
        onClickModalBtn();
      }
    });
    document.addEventListener('keydown', onEsc);
  });
}

function onEsc(ev) {
  console.log(ev.key);
  if (ev.key === 'Escape') {
    onClickModalBtn();
    document.removeEventListener('keydown', onEsc);
  }
}

function onClickModalBtn() {
  refs.backdrop.classList.add('is-hidden');
}

function markupById(data) {
  const marId = data
    .map(coctail => {
      const filteredById = ingredients.filter(
        ingredient => coctail[ingredient]
      );
      const filterMeasure = strMeasure.filter(measure => coctail[measure]);
      return `<div class="markup_by_id" id="${coctail.idDrink}">
    <button class="backdrop-btn" type="button">X</button>
    <img src="${coctail.strDrinkThumb}" alt="${
        coctail.strDrink
      }" loading="lazy" width="300"/>
    <h2>${coctail.strDrink}</h2>
    <p class="markup_by_category">Category: ${coctail.strCategory}</p>
    <p class="markup_by_glass">Glass: ${coctail.strGlass}</p>
    <p class="markup_by_ingredient">Instructions: ${
      coctail.strInstructions
    }</p><div class="markup_by_id_div">
    <ul class="markup_by_coctail_ingredient">${filteredById
      .map(
        ingredient => `<li>${coctail[ingredient]}
    </li>`
      )
      .join('')}
    </ul>
    <ul class="markup_by_coctail_measure">${filterMeasure
      .map(
        measure => `<li>${coctail[measure]}
    </li>`
      )
      .join('')}
    </ul></div>
    <button class="add_collection" type="button">Add to collection</button>
    </div>`;
    })
    .join('');
  refs.modal.innerHTML = marId;
}

refs.toCollection.addEventListener('click', onClickToCollection);

function onClickToCollection() {
  clickToCollection = true;
  if (coctailsCollections.length === 0) {
    refs.ulCoctails.innerHTML = `<p>Sorry</p>`;
  } else {
    markupLetter(coctailsCollections);
  }
}

refs.inputCheckbox.addEventListener('change', ev => {
  if (ev.target.checked) {
    document.body.classList.add('dark');
    document.body.classList.remove('white');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.add('white');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'white');
  }
});

if (localStorage.getItem('theme') === 'dark') {
  refs.inputCheckbox.checked = true;
  document.body.classList.add('dark');
  document.body.classList.remove('white');
}

refs.toTop.addEventListener(
  'click',
  () => (document.documentElement.scrollTop = 0)
);
