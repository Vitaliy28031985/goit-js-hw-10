import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.throttle';

const DEBOUNCE_DELAY = 300;

const refs = {
input: document.querySelector('#search-box'),
list: document.querySelectorAll('.country-list'),
info: document.querySelector('.country-info'),
}

// функції для рендеру розмітки

function countryCardMarkap({ flags, name, capital, population, languages }) {
   return `
     <div class="country-info__container">
       <div class="country-info__wrapper">
         <img class="country-info__flags" src="${flags.svg}" alt="${name.official}" width="50" />
         <h2 class="country-info__name">${name.official}</h2>
       </div>
       <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
       <p class="country-info__population"><span class="country-info__weight">Population:</span> ${population}</p>
       <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
         languages,
       )}</p>
     </div>
   `;
 }

 function countryListMarkup({ flags, name }) {
   return `
   <li class="country-list__item">
     <img class="country-list__flags" src="${flags.svg}" alt="${name.official}" width="25" />
     <h2 class="country-list__name">${name.official}</h2>
   </li>
   `;
 }

 // формування запиту

refs.input.addEventListener('input', debounce(onTaype, DEBOUNCE_DELAY));



function onTaype() {
 const onValue = refs.input.value.trim();
 
 
 if (onValue === '') {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
  return;  
 }

 fetchCountries(onValue)
 .then(countrys => {
   const countrysLength = countrys.length;
   const countrysLengthNorm = 10;
console.log(countrysLength);

    if (countrysLength > countrysLengthNorm) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      refs.list.innerHTML = '';
      refs.info.innerHTML = '';
      return;
    }

    if (countrysLength <= countrysLengthNorm && countrysLength > 1) {
      const listMarkup = countrys.map(country => countryListMarkup(country)).join('');
      refs.list.innerHTML = listMarkup;
      refs.info.innerHTML = '';
      console.log(refs.list);
return;
    }

if (countrysLength === 1) {
   const cardMarkap = countrys.map(country => countryCardMarkap(country));
   refs.list.innerHTML = '';
   refs.info.innerHTML = cardMarkap.join('');
 
}
 })
 .catch(error => {
   Notify.failure('Oops, there is no country with that name');
   refs.countryInfo.innerHTML = '';
   refs.countryList.innerHTML = '';
   return error;
 });
 console.log(refs.list);
}