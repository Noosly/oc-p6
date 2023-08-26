

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


async function fill_div_gallery(works){
    div_gallery_innerHTML = "";
    for(let w of works){
        div_gallery_innerHTML += `
            <figure>
                <img src="${w.imageUrl}" alt="${w.title}">
                <figcaption>${w.title}</figcaption>
            </figure>`
    } 
    return div_gallery_innerHTML;
}

async function fill_div_gallery_modal_window(works){
    div_gallery_innerHTML = "";
    for(let w of works){
        div_gallery_innerHTML += `
            <figure>            
                <div>
                    <svg id="modal_window_photo_${w.id}" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                </div>                
                <img src="${w.imageUrl}" alt="${w.imageUrl}">
                <figcaption>éditer</figcaption>
            </figure>`
    } 
    return div_gallery_innerHTML;
}



async function fill_div_filters(catagories){
    div_filters_innerHTML = `<button id="btn_filter_Tous" class="filters__btn filters__btn--selected">Tous</button>`;
    for(let c of catagories){
        div_filters_innerHTML += `<button id="btn_filter_${c}" class="filters__btn">${c}</button>`;        
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
    div_gallery.innerHTML = await fill_div_gallery(all_works);
    //Récupérer les catégories
    let categories =  await get_categories(url_categories);
    div_filters.innerHTML = await fill_div_filters(categories);
    for(let c of categories){
        let btn_filter_c = document.getElementById(`btn_filter_${c}`);
        btn_filter_c.addEventListener('click', async function(){
            let filter_works = await filter_works_by_category(all_works, c);
            div_gallery.innerHTML = await fill_div_gallery(filter_works);
            change_selected_bouton(btn_filter_c);
        });
    }
    let btn_filter_tous = document.getElementById(`btn_filter_Tous`);
        btn_filter_tous.addEventListener('click', async function(){
            div_gallery.innerHTML = await fill_div_gallery(all_works);
            change_selected_bouton(btn_filter_tous);
        });   
    
    a_login.addEventListener('click', function(){
        let userId = localStorage.getItem("userId");
        if(userId != ''){
            localStorage.setItem("userId", '');
            localStorage.setItem("token", '');
        }
    });   
    return all_works; 
}

function show_login_logout(a_login, userId){    
    if(userId == ''){
        a_login.textContent = "Login";
    }
    else{
        a_login.textContent = "Logout";
    }
    
}


function show_hide_edition_mode(header_edition,  div_edition_intro, div_edition_projects, div_filters, userId){    
    if(userId == ''){
        header_edition.style.display = 'none';
        div_edition_intro.style.display = 'none';
        div_edition_projects.style.display = 'none';
        div_filters.style.display = 'block';
    }
    else{
        header_edition.style.display = "flex";
        div_edition_intro.style.display = 'block';
        div_edition_projects.style.display = 'block';
        div_filters.style.display = 'none';
    }
    
}
function delete_work(id_work){
    alert(`delete work ${id_work}`)


}

async function add_event_listenerer_to_modal_window_photo(works){
    for(let w of works){
        let modal_window_photo = document.querySelector(`#modal_window_photo_${w.id}`);
        modal_window_photo.addEventListener('click', async function(){
            delete_work(w.id);                
        });
    
    }   
    
} 

function modal_window_go_to_add_photo(){
    let gallery = document.querySelector(".photos-gallery");
    let add_photo = document.querySelector(".new-photo");
    gallery.style.display = 'none';
    add_photo.style.display = 'block';
}

function modal_window_go_to_gallery(){
    let add_photo = document.querySelector(".new-photo");
    let gallery = document.querySelector(".photos-gallery");
    add_photo.style.display = 'none';
    gallery.style.display = 'block';
}

async function open_modal_window(){
    let modal_window = document.querySelector(".modal-window");
    let gallery = document.querySelector(".photos-gallery");
    modal_window.style.display = 'block';
    gallery.style.display = 'block';
    gallery_list = document.querySelector(".photos-gallery__list");
    //let current_works = localStorage.getItem("currentWorks");    
    let current_works = await get_data(url_work);
    gallery_list.innerHTML = await fill_div_gallery_modal_window(current_works);
    await add_event_listenerer_to_modal_window_photo(current_works);
    let btn_add_photo = document.querySelector(".photos-gallery__add");
    btn_add_photo.addEventListener('click', modal_window_go_to_add_photo);
    let btn_new_photo_back = document.querySelector(".new-photo-back");
    btn_new_photo_back.addEventListener('click', modal_window_go_to_gallery);
    
}

function close_modal_window(){
    let modal_window = document.querySelector(".modal-window");
    let gallery = document.querySelector(".photos-gallery");
    let add_photo = document.querySelector(".new-photo");

    modal_window.style.display = 'none';
    gallery.style.display = 'none';
    add_photo.style.display = 'none';

}

const div_gallery = document.querySelector(".gallery");
const div_filters = document.querySelector(".filters");
const a_login = document.querySelector("#a_login");
const url_work =  "http://localhost:5678/api/works";
const url_categories =  "http://localhost:5678/api/categories";
const header_edition = document.querySelector(".header_edition");
const div_edition_intro = document.querySelector(".div-edition-introduction");
const div_edition_projects = document.querySelector(".div-edition-projects");
const exit_photos_gallery = document.querySelector("#exit-photos-gallery");
const exit_add_photo = document.querySelector("#exit-new-photo");

initialisation(url_work, div_gallery, div_filters, url_categories);
let userId = localStorage.getItem("userId");
show_login_logout(a_login, userId);
show_hide_edition_mode(header_edition, div_edition_intro, div_edition_projects, div_filters, userId);
div_edition_intro.addEventListener('click', open_modal_window);
div_edition_projects.addEventListener('click', open_modal_window);
//localStorage.setItem("currentWorks", current_works);
exit_photos_gallery.addEventListener('click', close_modal_window);
exit_add_photo.addEventListener('click', close_modal_window);





 





