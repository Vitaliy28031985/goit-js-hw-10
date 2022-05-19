import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.throttle';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

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

input.addEventListener('input', debounce(onTaype, DEBOUNCE_DELAY));



function onTaype() {
 const onValue = input.value.trim();
 
 
 if (onValue === '') {
  list.innerHTML = '';
  info.innerHTML = '';
  return;  
 }

 fetchCountries(onValue)
 .then(countrys => {
   const countrysLength = countrys.length;
   const countrysLengthNorm = 10;


    if (countrysLength > countrysLengthNorm) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      list.innerHTML = '';
      info.innerHTML = '';
      return;
    }

    if (countrysLength <= countrysLengthNorm && countrysLength > 1) {
      const listMarkup = countrys.map(country => countryListMarkup(country));
      list.innerHTML = listMarkup.join('');
      info.innerHTML = '';
    

    }

if (countrysLength === 1) {
   const cardMarkap = countrys.map(country => countryCardMarkap(country));
   list.innerHTML = '';
   info.innerHTML = cardMarkap.join('');
 
}
 })
 .catch(error => {
   Notify.failure('Oops, there is no country with that name');
   refs.countryInfo.innerHTML = '';
   refs.countryList.innerHTML = '';
   return error;
 });

}