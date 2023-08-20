

//Définitiond des fonctions:
async function get_data(url){
    const reponse = await fetch(url);
    const data = await reponse.json();
    return data;    
}

async function get_categories(url_categories){
    let categories = await get_data(url_categories);
    let set_categories = new Set();
    for(let c of categories){
        set_categories.add(c.name);
    }
    return set_categories;
}

async function filter_works_by_category(all_works, category){
    const works = all_works.filter((work) => work.category.name == category);


    
    return works;
}


async function remplir_div_gallery(works){
    div_gallery_innerHTML = "";
    for(let w of works){
        div_gallery_innerHTML += `
            <figure>
                <img src="${w.imageUrl}" alt="${w.imageUrl}">
                <figcaption>${w.title}</figcaption>
            </figure>`
    } 
    return div_gallery_innerHTML;
}


async function remplir_div_filters(catagories){
    div_filters_innerHTML = `<button id="btn_filtre_Tous" class="filters__btn filters__btn--selected">Tous</button>`;
    for(let c of catagories){
        div_filters_innerHTML += `<button id="btn_filtre_${c}" class="filters__btn">${c}</button>`;        
    } 
    return div_filters_innerHTML;
}

function change_selected_bouton(btn){
    let ancien_selected_btn = document.querySelector(".filters__btn--selected");
    ancien_selected_btn.classList.remove("filters__btn--selected");
    btn.classList.add("filters__btn--selected");

}

async function initialisation(url_work, div_gallery, div_filters){
    //Récupération des travaux depuis le back-end     
    let all_works = await get_data(url_work);   
    div_gallery.innerHTML = await remplir_div_gallery(all_works);
    //let categories = await get_categories(url_work);
    let categories =  await get_categories(url_categories);
    div_filters.innerHTML = await remplir_div_filters(categories);
    for(let c of categories){
        let btn_filter_c = document.getElementById(`btn_filtre_${c}`);
        btn_filter_c.addEventListener('click', async function(){
            let filter_works = await filter_works_by_category(all_works, c);
            div_gallery.innerHTML = await remplir_div_gallery(filter_works);
            change_selected_bouton(btn_filter_c);
        });
    }
    let btn_filter_tous = document.getElementById(`btn_filtre_Tous`);
        btn_filter_tous.addEventListener('click', async function(){
            div_gallery.innerHTML = await remplir_div_gallery(all_works);
            change_selected_bouton(btn_filter_tous);
        });   
    a_login.addEventListener('click', function(){
        let userId = localStorage.getItem("userId");
        if(userId != ''){
            localStorage.setItem("userId", '');
            localStorage.setItem("token", '');
        }
    });    
}

function show_login_logout(a_login, userId){    
    if(userId == ''){
        a_login.textContent = "Login";
    }
    else{
        a_login.textContent = "Logout";
    }
    
}


function show_edition_mode(header_edition, div_edition, userId){    
    if(userId == ''){
        header_edition.style.display = 'none';
        div_edition.style.visibility = 'hidden';
    }
    else{
        header_edition.style.display = "flex";
        div_edition.style.visibility = 'visible';
    }
    
}

const div_gallery = document.querySelector(".gallery");
const div_filters = document.querySelector(".filters");
const a_login = document.querySelector("#a_login");
const url_work =  "http://localhost:5678/api/works";
const url_categories =  "http://localhost:5678/api/categories";
const header_edition = document.querySelector(".header_edition");
const div_edition = document.querySelector(".div_edition");

initialisation(url_work, div_gallery, div_filters, url_categories);
let userId = localStorage.getItem("userId");
show_login_logout(a_login, userId);
show_edition_mode(header_edition, div_edition, userId);





