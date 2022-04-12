let accountsURL = 'https://entpp.conekt.repl.co/accounts.json';
let jsonData = null;
let badges;

function findProp(obj, prop, defval){
    if (typeof defval == 'undefined') defval = null;
    prop = prop.split('.');
    for (var i = 0; i < prop.length; i++) {
        if(typeof obj[prop[i]] == 'undefined')
            return defval;
        obj = obj[prop[i]];
    }
    return obj;
}

function sendRequest(url, accountName, field) {
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;
        // return jsonData[accountName][data];
        let props = 'eloandenefle.avatar';
        let propstwo = 'eloandenefle.banner';
        let propsthree = 'eloandenefle.name';
        let propfour = 'eloandenefle.badge';
        document.querySelector('.user-home>.avatar').style.backgroundImage = 'url(' + findProp(jsonData, props) + ')';
        document.querySelector('.user-home>.banner').style.backgroundImage = 'url(' + findProp(jsonData, propstwo) + ')';
        document.querySelector('.user-home>.content>.username').innerText = findProp(jsonData, propsthree);
        console.log(findProp(jsonData, propfour));
        badges = findProp(jsonData, propfour);
        badges.forEach(function (badge) {
            let div = document.createElement('DIV');
            div.classList.add('badge-item');
            div.classList.add(badge);
            document.querySelector('.user-home>.content>.badges').appendChild(div);
        });
        // document.querySelector('.user-home>.content>.badge'). = findProp(jsonData, propfour);
    }
}

let email = document.getElementById('email');
let password = document.getElementById('password');

document.getElementById('btn-submit').addEventListener('click', function () {
    if (localStorage.getItem('user') !== null && localStorage.getItem('password') !== null) {
        initializeSession(localStorage.getItem('user'));
    } else if (email.value === '' || password.value === '') {
        alert('Veuillez remplir tous les champs.');
    } else {
        login();
    }
});

function login() {
    if (email.value === 'a' && password.value === 'b') {
        localStorage.setItem('user', 'a');
        localStorage.setItem('password', 'b');
        initializeSession('a');
    } else {
        alert('Email ou mot de passe incorrect.');
    }
}

function initializeSession(name) {
    if (name === 'a') {
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.user-home').style.display = 'block';
        // let ho = sendRequest(accountsURL, 'eloandenefle', 'name');
        sendRequest(accountsURL, 'username');
    }
}