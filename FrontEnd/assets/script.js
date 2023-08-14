const div_gallery = document.querySelector(".gallery");
const div_filters = document.querySelector(".filters");
const url_work =  "http://localhost:5678/api/works";

//Définitiond des fonctions:
async function get_data(url){
    const reponse = await fetch(url);
    const data = await reponse.json();
    return data;    
}




async function get_categories(url_works){
    let works = await get_data(url)
    let categories = new Set();
    for(let w of works){
        categories.add(w.category);
    }
    return categories;
}




async function remplir_div_gallery(div_gallery, works){
    div_gallery_innerHTML = "";
    for(let w of works){
        div_gallery.innerHTML += `
            <figure>
                <img src="${w.imageUrl}" alt="${w.imageUrl}">
                <figcaption>${w.title}</figcaption>
            </figure>`
    } 
    return div_gallery_innerHTML;
}


async function remplir_div_filters(div_filters, catagories){
    div_filters_innerHTML = "";
    for(let c of catagories){
        div_gallery.innerHTML += `
            <input></input>`
    } 
    return div_filters_innerHTML;
}







async function initialisation_travaux(url_work, div_gallery){
    //Récupération des travaux depuis le back-end     
    let all_works = await get_data(url_work);   
    div_gallery.innerHTML = await remplir_div_gallery(div_gallery, all_works);
       
}

async function initialisation_categories(){
    let categories = await get_categories();

}




initialisation(url_work, div_gallery);
