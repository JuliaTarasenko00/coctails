import axios from "axios";
const URL = 'https://www.thecocktaildb.com/api/json/v1/1';
export class CoctailsAPI {

async getCategories(){
const endpoint = 'list.php?c=list';
const urlCoctails = `${URL}/${endpoint}`;
try{
    const {data} = await axios(urlCoctails);
    return data.drinks;
}catch(err){
    console.log(err);
}
};

async getCoctails(categorie){
    const endpoint = `filter.php?c=${categorie}`;
    const urlCoctails = `${URL}/${endpoint}`;
    try{
        const {data} = await axios(urlCoctails);
        return data.drinks;
    }catch(err){
        console.log(err);
    }
    };

    async getByLetter(letter){
        const endpoint = `search.php?f=${letter}`;
        const urlCoctails = `${URL}/${endpoint}`;
        try{
            const {data} = await axios(urlCoctails);
            return data.drinks;
        }catch(err){
            console.log(err);
        }
        };
        
    async getById(id){
        const endpoint = `lookup.php?i=${id}`;
        const urlCoctails = `${URL}/${endpoint}`;
        try{
            const {data} = await axios(urlCoctails);
            return data.drinks;
        }catch(err){
            console.log(err);
        }
        };
}