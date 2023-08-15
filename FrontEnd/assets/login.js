const btnConnect = document.querySelector(".seConnecterBtn");
const inputEmail = document.querySelector("#input_email");
const inputPassword = document.querySelector("#input_password");
const url_login = 'http://localhost:5678/api/users/login';


async function post_data(url, data){
    const reponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    const reponse_body = await reponse.json();
    const reponse_status =  reponse.status;
    return {"status": reponse_status, "body": reponse_body};    
}

async function authentification(url_login, user){
    let reponse = await post_data(url_login, user);
    return reponse;

}


async function  initialisation(btn, url_login){
   
    btn.addEventListener('click', async function(){
        let utilisateur = {
            "email": `${inputEmail.value}`,
            "password": `${inputPassword.value}`
        };
        let reponse =  await authentification(url_login, utilisateur);
        if(reponse.status == 200){
            localStorage.setItem("token", reponse.body.token);
            localStorage.setItem("userId", reponse.body.userId);
            window.location.href = "./index.html";
           

        }else{
            alert(`Erreur d'authentification. \n Message d'erreur: "${reponse.body.message}"`);
        }

    });

}

initialisation(btnConnect, url_login);