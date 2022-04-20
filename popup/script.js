let accountsURL = 'https://entpp.conekt.repl.co/accounts.json';
let jsonData = null;
let badges;
let realPassword;
let accounts;

let email = document.getElementById('email');
let password = document.getElementById('password');

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

function sendRequest(url, props, option, page = 'user-home') {
    console.log('props: ' + props);
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;
        let localProps = 'accounts.' + props;
        let propName = 'accounts.' + props + '.name';
        let propAvatar = 'accounts.' + props + '.avatar';
        let propBanner = 'accounts.' + props + '.banner';
        let propBadge = 'accounts.' + props + '.badge';
        // findProp(jsonData, propName);
        if (option === 'password') {
            realPassword = findProp(jsonData, localProps);
        } else if (option === 'userpage') {
            console.log(page);
            document.querySelector('.' + page + '>.avatar').style.backgroundImage = 'url(' + findProp(jsonData, propAvatar) + ')';
            if (findProp(jsonData, propBanner) !== null) {
                document.querySelector('.' + page + '>.banner').style.backgroundImage = 'url(' + findProp(jsonData, propBanner) + ')';
                document.querySelector('.' + page + '>.banner').style.backgroundPosition = 'center';
                document.querySelector('.' + page + '>.banner').style.backgroundSize = 'cover';
                document.querySelector('.' + page + '>.banner').style.backgroundRepeat = 'no-repeat';
                document.querySelector('.' + page + '>.banner').style.height = '120px';
            } else {
                document.querySelector('.' + page + '>.banner').style.background = 'black';
                document.querySelector('.' + page + '>.banner').style.height = '60px';
            }
            document.querySelector('.' + page + '>.content>.username').innerText = findProp(jsonData, propName);
            console.log(findProp(jsonData, propBadge));
            badges = findProp(jsonData, propBadge);
            badges.forEach(function (badge) {
                let div = document.createElement('DIV');
                div.classList.add('badge-item');
                div.classList.add(badge);
                document.querySelector('.' + page + '>.content>.badges').appendChild(div);
                if (badge === 'administrador' && page === 'user-home') {
                    setAdminaccount();
                }
            });
        } else if (option === 'userlist') {
            accounts = findProp(jsonData, props);
            for (let account in accounts) {
                let value = accounts[account];
                let userItem = document.createElement('DIV');
                userItem.classList.add('user-item');
                userItem.setAttribute('data-user', value.name);
                userItem.innerHTML = '<div class="avatar" style="background-image: url(' + value.avatar + ')"></div><div class="username">' + value.name + '</div>';
                document.querySelector('.second>.content').appendChild(userItem);
            }
            // accounts.forEach(function (account) {
            //     let userItem = document.createElement('DIV');
            //     userItem.classList.add('user-item');
            //     userItem.innerHTML = '<div class="avatar" style="background-image: url(' + account.avatar + ')"></div><div class="username">' + account.name + '</div>';
            //     document.querySelector('.second>.content').appendChild(userItem);
            // });
        } else {
            alert('ok');
        }
    }
}

document.getElementById('btn-submit').addEventListener('click', function () {
    if ((localStorage.getItem('user') !== null && localStorage.getItem('password') !== null) && (email.value === '' || password.value === '')) {
        initializeSession(localStorage.getItem('user'));
    } else if (email.value === '' || password.value === '') {
        alert('Veuillez remplir tous les champs.');
    } else {
        login();
    }
});

function login() {
    let props = email.value + '.password';
    sendRequest(accountsURL, props, 'password');
    if (realPassword === password.value) {
        localStorage.setItem('user', email.value);
        localStorage.setItem('password', password.value);
        initializeSession(email.value);
    // }
        } else {
        alert('Email ou mot de passe incorrect.');
        // alert(email.value + ' ' + password.value);
        // alert(realPassword);
    }
}

function initializeSession(name) {
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.user-home').style.display = 'block';
    sendRequest(accountsURL, name, 'userpage');
}

function setAdminaccount() {
    let adminWhitness = document.createElement('DIV');
    adminWhitness.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 20px; margin: 0; padding: 0; background: linear-gradient(90deg, black, rgba(0, 0, 0, .5)); text-indent: 5px; color: white;';
    adminWhitness.innerText = 'Administrateur';
    document.querySelector('.user-home').appendChild(adminWhitness);
    let btnactSeeusers = document.createElement('DIV');
    btnactSeeusers.classList.add('btn-action');
    btnactSeeusers.setAttribute('id', 'btn-seeusers');
    btnactSeeusers.setAttribute('onclick', 'seeUser()');
    btnactSeeusers.innerText = 'Voir les utilisateurs';
    document.querySelector('.user-home>.content').appendChild(btnactSeeusers);
}

function seeUser() {
    document.querySelector('.user-home').style.display = 'none';
    document.querySelector('.second').style.display = 'block';
    sendRequest(accountsURL, 'accounts', 'userlist');
    setTimeout('btnUseritemFounding()', 1000);
    setTimeout('console.log("Founded.")', 1000);
}

document.getElementById('btn-close-second').addEventListener('click', function () {
    document.querySelector('.second>.content').innerHTML = '';
    document.querySelector('.second').style.display = 'none';
    document.querySelector('.user-home').style.display = 'block';
});

document.getElementById('btn-close-third').addEventListener('click', function () {
    document.querySelector('.third>.content>.content>.badges').innerHTML = '';
    document.querySelector('.third').style.display = 'none';
    document.querySelector('.second').style.display = 'block';
});

let btnUseritem = document.getElementsByClassName("user-item");

function btnUseritemFounding() {
    for (var i = 0; i < btnUseritem.length; i++) {
        btnUseritem[i].addEventListener("click", function () {
        document.querySelector('.second').style.display = 'none';
        document.querySelector('.third').style.display = 'block';
        let localProps = this.getAttribute('data-user');
        localProps.toString();
        sendRequest(accountsURL, localProps, 'userpage', 'third>.content');
        });
    }
}

// for (var i = 0; i < btnUseritem.length; i++) {
//     btnUseritem[i].addEventListener("click", function () {
//         console.log(this.innerHTML);
//     });
// }

// setInterval("btnUseritemFounding()", 1000);