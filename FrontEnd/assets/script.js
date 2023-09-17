

//Définitiond des fonctions:
async function get_data(url){
    const reponse = await fetch(url);
    const data = await reponse.json();
    return data;    
}

async function delete_data(url, id){
    const token = localStorage.getItem("token");
    let reponse =  await fetch(url + '/' + id, { method: 'DELETE',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
        }        
    }); 
    return reponse;
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
            <figure id="gallery_photo_${w.id}">
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
            <figure id="modal_window_figure_${w.id}">            
                <div >
                    <svg id="modal_window_photo_${w.id}"  work-id="${w.id}" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
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
async function delete_work(works_url, id_work){
    let response = await delete_data(works_url, id_work);
    return response;


}

function add_event_listenerer_to_modal_window_photo(works, works_url){
    for(let w of works){
        let modal_window_photo = document.querySelector(`#modal_window_photo_${w.id}`);
        modal_window_photo.addEventListener('click', async function(event){
            event.preventDefault();
            let response = await delete_work(works_url, w.id);
            if(response.ok){                
                alert(`La photo ID ${w.id} supprimée avec succès`);
                let figure = this.parentElement.parentElement;
                figure.remove();
                let gallery_photo_figure = document.getElementById(`gallery_photo_figure_${w.id}`);    
                gallery_photo_figure.remove();
            } 
        });
    }       
} 

async function modal_window_go_to_add_photo(){
    let gallery = document.querySelector(".photos-gallery");
    let add_photo = document.querySelector(".new-photo");
    gallery.style.display = 'none';
    add_photo.style.display = 'block';
    let input_category = document.querySelector("#input_category");
    let categories = await get_data(url_categories);
    input_category.innerHTML = `<option value="0"></option>`
    for(let c of categories){
        input_category.innerHTML += `<option value="${c.id}">${c.name}</option>`
    }
}

function modal_window_go_to_gallery(){
    let add_photo = document.querySelector(".new-photo");
    let gallery = document.querySelector(".photos-gallery");
    add_photo.style.display = 'none';
    gallery.style.display = 'block';
}

async function modal_window_remove_gallery(works_url){
    let works = await get_data(url_work);
    for(let w of works){
        delete_work(works_url, w.id);        
    }
    alert('Gallery supprimée avec succès.');
    gallery_list = document.querySelector(".photos-gallery__list");
    gallery_list.innerHTML = "";
}

async function open_modal_window(){
    gallery_list = document.querySelector(".photos-gallery__list");  
    let current_works = await get_data(url_work);
    gallery_list.innerHTML = await fill_div_gallery_modal_window(current_works);
    add_event_listenerer_to_modal_window_photo(current_works, url_work);
    let btn_add_photo = document.querySelector(".photos-gallery__add");
    btn_add_photo.addEventListener('click', modal_window_go_to_add_photo);
    let btn_new_photo_back = document.querySelector(".new-photo-back");
    btn_new_photo_back.addEventListener('click', modal_window_go_to_gallery);  
    let modal_window = document.querySelector(".modal-window");
    let gallery = document.querySelector(".photos-gallery");
    modal_window.style.display = 'block';
    gallery.style.display = 'block';
    let btn_remove_gallery = document.querySelector(".photos-gallery__remove");
    btn_remove_gallery.addEventListener('click', function(){
        modal_window_remove_gallery(url_work);

    });
}

function close_modal_window(){
    let modal_window = document.querySelector(".modal-window");
    let gallery = document.querySelector(".photos-gallery");
    let add_photo = document.querySelector(".new-photo");
    modal_window.style.display = 'none';
    gallery.style.display = 'none';
    add_photo.style.display = 'none';
    location.reload();
}

function browse_photo(){
    let imgage_file = btn_browse_photo.files[0];
    console.log(imgage_file);
    if (imgage_file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imgage_file);
        console.log(fileReader);
        fileReader.addEventListener("load", function () {
            new_photo_img.style.display = 'inline';
            new_photo_img.style.visibility = 'visible';
            new_photo_img.setAttribute('src', this.result);
        });    
        svg_empty_image.style.display = 'none';
        label_add_photo.style.display = 'none';
        btn_browse_photo.style.display = 'none';
        photo_format.style.display = 'none';
        new_photo_validate.disable = false;
        new_photo_validate.classList.add('new-photo__validate--enabled');        
    }    
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
const btn_browse_photo = document.querySelector("#div-browse-photo__btn-add-photo");
const new_photo_img = document.querySelector(".div-browse-photo__new-photo-img");
const new_photo_title = document.querySelector("#input_title");
const new_photo_category = document.querySelector("#input_category");
const new_photo_validate = document.querySelector("#new-photo__validate");
const svg_empty_image = document.querySelector('.div-browse-photo__svg-empty-image');
const label_add_photo = document.querySelector('.div-browse-photo__label-add-photo');
const photo_format = document.querySelector('.div-browse-photo__photo-format');
const form_new_photo = document.querySelector("#form-new-photo");
initialisation(url_work, div_gallery, div_filters, url_categories);
let userId = localStorage.getItem("userId");
show_login_logout(a_login, userId);
show_hide_edition_mode(header_edition, div_edition_intro, div_edition_projects, div_filters, userId);
div_edition_intro.addEventListener('click', open_modal_window);
div_edition_projects.addEventListener('click', open_modal_window);
exit_photos_gallery.addEventListener('click', close_modal_window);
exit_add_photo.addEventListener('click', close_modal_window);
btn_browse_photo.addEventListener('change', browse_photo);

form_new_photo.addEventListener('submit', async function(ev){
    let form_data = new FormData(form_new_photo);
    let selectedImage = btn_browse_photo.files[0];
    form_data.append('image', selectedImage);
    form_data.append('title', input_title.value);
    form_data.append('category', input_category.value);    
    let req = new XMLHttpRequest();
    req.open("POST", url_work, true);
    req.onload =  function(load_ev){
        if(req.status == 201){
            alert(`Photo de Gallerie crée avec succès`);  
            //transform the response to JSON          
            let  res = JSON.parse(req.response);   
            //Update the Gallery
            gallery_list = document.querySelector(".photos-gallery__list");              
            gallery_list.innerHTML += `<figure id="modal_window_figure_${res.id}">            
                                            <div >
                                                <svg id="modal_window_photo_${res.id}"  work-id="${res.id}" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                                            </div>                
                                            <img src="${res.imageUrl}" alt="${res.imageUrl}">
                                            <figcaption>éditer</figcaption>
                                        </figure>`
    
        }
        else{
            alert(`Erreur ${req.status} lors de l'envoie de la gallerie`);
        }
    };
    let token = localStorage.getItem('token');    
    req.setRequestHeader('Authorization', `Bearer ${token}`);
    req.send(form_data);
    ev.preventDefault();
    //Remove selection
    
    svg_empty_image.style.display = 'inline';
    label_add_photo.style.display = 'inline';
    btn_browse_photo.style.display = 'inline';
    btn_browse_photo.style.visibility = 'hidden';
    photo_format.style.display = 'inline';
    new_photo_validate.disable = true;
    new_photo_img.style.display = 'none';
    new_photo_validate.classList.remove('new-photo__validate--enabled');  
    modal_window_go_to_gallery();
});






 





