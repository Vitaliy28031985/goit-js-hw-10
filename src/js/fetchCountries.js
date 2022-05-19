export async function fetchCountries(name) {
   const url = 'https://restcountries.com/v3.1/name/';
   const filter = '?fields=name,capital,population,flags,languages';
   const response = await fetch(`${url}${name}${filter}`);
   if (!response.ok) {
      throw new Error(response.status);
   }
   return await response.json();
 }