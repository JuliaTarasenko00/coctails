import Notiflix from 'notiflix';
import { CoctailsAPI } from "./script/CoctailsAPI";

const refs = { 
formEl: document.getElementById('form'),
ulCategories: document.getElementById('categories-list'),
ulCoctails: document.getElementById('coctails-list'),
};

const api = new CoctailsAPI();
api.getCategories().then(res => markupCategoies(res));

function markupCategoies(data){
const markup =  data.map((categorie) =>`<li class="li_markupCategoies">${categorie.strCategory}</li>`).join('');
refs.ulCategories.innerHTML = markup;
};

refs.ulCategories.addEventListener('click', onClickCategories);

function onClickCategories(ev){
if(ev.target.nodeName !== 'LI') return;
const  categoriesValue = ev.target.textContent;
api.getCoctails(categoriesValue).then(res => markupCoctails(res));
}

function markupCoctails(data){
   const markupCoctails = data.map(coctail => `<li id="${coctail.idDrink}">
   <img src="${coctail.strDrinkThumb}" alt="${coctail.strDrink}" loading="lazy" width="300"/>
   <h2>${coctail.strDrink}</h2>
   </li>`).join('');
   refs.ulCoctails.innerHTML = markupCoctails;
};

refs.formEl.addEventListener('submit', onSubmitForm);

function onSubmitForm(ev){
    ev.preventDefault();
    const value = ev.currentTarget.elements.input.value.trim();
    // console.log(value);
    if(value === ''){
        Notiflix.Notify.failure('Введіть значення');
        return
    }
   api.getByLetter(value).then(res => {
    if(!res){
        Notiflix.Notify.warning('Введіть 1 літеру');
        return
    }
    markupLetter(res)
});
}

let ingredients = []; 
let strMeasure = []
for(let i = 1; i <= 15; i +=1){
    ingredients.push(`strIngredient${i}`);
    strMeasure.push(`strMeasure${i}`);
}
// console.log(ingredients);
function markupLetter(data){
    const marLetter = data.map(coctail =>{
    const filteredIngredients = ingredients.filter((ingredient) => coctail[ingredient]) 
    return  `<li id="${coctail.idDrink}">
    <img src="${coctail.strDrinkThumb}" alt="${coctail.strDrink}" loading="lazy" width="300"/>
    <h2>${coctail.strDrink}</h2>
    <p class="markup_letter_category">Category: ${coctail.strCategory}</p>
    <p class="markup_letter_glass">Glass: ${coctail.strGlass}</p>
    <ul class="coctail_ingredient">${filteredIngredients.map((ingredient) => `<li class="markup_letter_item">${coctail[ingredient]}
    </li>`).join('')}
    </ul>
    </li>`}).join('')
    refs.ulCoctails.innerHTML = marLetter;
};

refs.ulCoctails.addEventListener('click', onClickCoctails);

function onClickCoctails(event){
const elementId = event.target.closest('li').id;
api.getById(elementId).then(res => markupById(res));
}

function markupById(data){
    const marId = data.map(coctail =>{
    const filteredById = ingredients.filter((ingredient) => coctail[ingredient]); 
    const filterMeasure = strMeasure.filter((measure) => coctail[measure]);
    return  `<li class="markup_by_id" id="${coctail.idDrink}">
    <img src="${coctail.strDrinkThumb}" alt="${coctail.strDrink}" loading="lazy" width="300"/>
    <h2>${coctail.strDrink}</h2>
    <p class="markup_by_category">Category: ${coctail.strCategory}</p>
    <p class="markup_by_glass">Glass: ${coctail.strGlass}</p>
    <p class="markup_by_ingredient">Instructions: ${coctail.strInstructions}</p><div class="markup_by_id_div">
    <ul class="markup_by_coctail_ingredient">${filteredById.map((ingredient) => `<li>${coctail[ingredient]}
    </li>`).join('')}
    </ul>
    <ul class="markup_by_coctail_measure">${filterMeasure.map((measure) => `<li>${coctail[measure]}
    </li>`).join('')}
    </ul></div>
    </li>`}).join('')
    refs.ulCoctails.innerHTML = marId;
};