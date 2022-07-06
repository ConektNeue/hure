let accountsURL = 'https://entpp.conekt.repl.co/accounts.json';
let postsURL = 'https://entpp.conekt.repl.co/posts.json';
let jsonData = null;
let badges;
let realPassword;
let accounts;
let posts;
let accountNumber;
let accountsContent;
let accountAvatarUrl;
let accountBannerUrl;
let administrador;

let usernamefield = document.getElementById('email');
let passwordfield = document.getElementById('password');

function findProp(obj, prop, defval) {
    if (typeof defval == 'undefined') defval = null;
    prop = prop.split('.');
    for (var i = 0; i < prop.length; i++) {
        if (typeof obj[prop[i]] == 'undefined')
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
        let localProps = 'accounts';
        // let propName = 'accounts.' + props + '.name';
        // let propAvatar = 'accounts.' + props + '.avatar';
        // let propBanner = 'accounts.' + props + '.banner';
        // let propBadge = 'accounts.' + props + '.badge';
        // findProp(jsonData, propName);
        if (option === 'password') {
            for (let i = 0; i < jsonData.accounts.length; i++) {
                if (jsonData.accounts[i].name === props) {
                    realPassword = jsonData.accounts[i].password;
                    accountNumber = i;
                    accountsContent = jsonData.accounts;
                }
            }
            alert('realPassword: ' + realPassword);
        } else if (option === 'userpage') {
            console.log(page);
            for (let i = 0; i < jsonData.accounts.length; i++) {
                if (i === accountNumber) {
                    document.querySelector('.' + page + '>.avatar').style.backgroundImage = 'url(' + jsonData.accounts[i].avatar_url + ')';
                    if (findProp(jsonData, jsonData.accounts[i].banner_url) !== null) {
                        document.querySelector('.' + page + '>.banner').style.backgroundImage = 'url(' + findProp(jsonData, jsonData.accounts[i].banner_url) + ')';
                        document.querySelector('.' + page + '>.banner').style.backgroundPosition = 'center';
                        document.querySelector('.' + page + '>.banner').style.backgroundSize = 'cover';
                        document.querySelector('.' + page + '>.banner').style.backgroundRepeat = 'no-repeat';
                        document.querySelector('.' + page + '>.banner').style.height = '120px';
                    } else {
                        document.querySelector('.' + page + '>.banner').style.background = 'black';
                        document.querySelector('.' + page + '>.banner').style.height = '60px';
                    }
                    document.querySelector('.' + page + '>.content>.username').innerText = jsonData.accounts[i].name;
                    // console.log(jsonData.accounts[i].);
                    if (page === 'user-home') {
                        createBtnSeenews();
                    }
                    // badges = findProp(jsonData, propBadge);
                    // badges.forEach(function (badge) {
                    //     let div = document.createElement('DIV');
                    //     div.classList.add('badge-item');
                    //     div.classList.add(badge);
                    //     document.querySelector('.' + page + '>.content>.badges').appendChild(div);
                    //     if (badge === 'administrador' && page === 'user-home') {
                    //         setAdminaccount();
                    //     }
                    // });
                }
            }
            setTimeout(function () { btnActionFounding(); }, 800);
        } else if (option === 'userlist') {
            document.querySelector('.second>.content').style.paddingTop = '10px';
            accounts = findProp(jsonData, props);
            for (let account in accounts) {
                let value = accounts[account];
                let userItem = document.createElement('DIV');
                userItem.classList.add('user-item');
                userItem.setAttribute('data-user', value.name);
                userItem.innerHTML = '<div class="avatar" style="background-image: url(' + value.avatar + ')"></div><div class="username">' + value.name + '</div>';
                document.querySelector('.second>.content').appendChild(userItem);
            }
        } else if (option === 'newslist') {
            // !Pas de titre pour tous les posts.
            document.querySelector('.second>.content').style.paddingTop = '0';
            posts = findProp(jsonData, props);
            for (let post in posts) {
                let value = posts[post];
                let postItem = document.createElement('DIV');
                postItem.classList.add('news');
                document.querySelector('.second>.content').appendChild(postItem);
                postItem.classList.add(`${value.id}`);
                let postHeader = document.createElement('DIV');
                postHeader.classList.add('header');
                document.querySelector(`.second>.content>.${value.id}`).appendChild(postHeader);
                let postHeaderAvatar = document.createElement('DIV');
                postHeaderAvatar.classList.add('avatar');
                postHeaderAvatar.style.backgroundImage = 'url(' + value.avatar + ')';
                document.querySelector(`.second>.content>.${value.id}>.header`).appendChild(postHeaderAvatar);
                let postHeaderRight = document.createElement('DIV');
                postHeaderRight.classList.add('right');
                document.querySelector(`.second>.content>.${value.id}>.header`).appendChild(postHeaderRight);
                let postHeaderRightAuthor = document.createElement('DIV');
                postHeaderRightAuthor.classList.add('author');
                postHeaderRightAuthor.innerText = value.author;
                document.querySelector(`.second>.content>.${value.id}>.header>.right`).appendChild(postHeaderRightAuthor);
                let postHeaderRightDate = document.createElement('DIV');
                postHeaderRightDate.classList.add('date');
                postHeaderRightDate.innerText = value.date;
                document.querySelector(`.second>.content>.${value.id}>.header>.right`).appendChild(postHeaderRightDate);
                if (value.istitle === "true") {
                    let postTitle = document.createElement('DIV');
                    postTitle.classList.add('title');
                    postTitle.innerText = value.title;
                    document.querySelector(`.second>.content>.${value.id}`).appendChild(postTitle);
                }
                let postContent = document.createElement('DIV');
                postContent.classList.add('content');
                postContent.innerHTML = value.content;
                document.querySelector(`.second>.content>.${value.id}`).appendChild(postContent);
                if (value.isimage === "true") {
                    let postImage = document.createElement('IMG');
                    postImage.src = value.image;
                    document.querySelector(`.second>.content>.${value.id}`).appendChild(postImage);
                }
            }
            document.querySelector('.second>.content').firstElementChild.style.marginTop = '-1.5px';
            document.querySelector('.second>.content').lastElementChild.style.borderBottom = 'none';
        }
        // } else {
        //     alert('ok');
        // }
    }
}

document.getElementById('btn-submit').addEventListener('click', function () {
    if (email.value === '' || password.value === '') {
        alert('Veuillez remplir tous les champs.');
    }
});

window.onload = function () {
    if (window.location.search !== null) {
        console.log(window.location.search);
        localStorage.setItem('username', window.location.search.split('=')[1].split('&')[0]);
        localStorage.setItem('password', window.location.search.split('=')[2]);
        initializeSession();
        // let username = window.location.search.split('=')[1];
        // let password = window.location.search.split('=')[2];
    }
}

let username, password;

function initializeSession() {
    username = localStorage.getItem('username');
    password = localStorage.getItem('password');
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.user-home').style.display = 'block';
    checkExtistanceForLoginProtocole();
}

function checkExtistanceForLoginProtocole() {
    let request = new XMLHttpRequest();
    request.open('GET', accountsURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;
        console.log(jsonData);
        let i = 0;
        let authenticated = false;
        jsonData.forEach(account => {
            if (jsonData[i]['username'] === username) {
                // alert(username + ' / ' + jsonData[i]['username']);
                if (jsonData[i]['password'] === password) {
                    // alert(password + ' / ' + jsonData[i]['password']);
                    authenticated = true;
                    accountNumber = i;
                    if (jsonData[i]['administrador'] === 'true') {
                        administrador = true;
                    }
                }
            }
            i++;
        });

        if (authenticated) {
            initializeUserHome();
        } else {
            alert('Veuillez vérifier vos identifiants.');
        }
    }
}

function initializeUserHome() {
    let request = new XMLHttpRequest();
    request.open('GET', accountsURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;
        accountAvatarUrl = jsonData[accountNumber]['avatar'];
        accountBannerUrl = jsonData[accountNumber]['banner_url'];

        if (accountBannerUrl !== undefined) {
            document.querySelector('.user-home>.banner').style.backgroundImage = 'url(' + jsonData[accountNumber]['banner_url'] + ')';
        } else {
            document.querySelector('.user-home>.banner').style.background = 'black';
            document.querySelector('.user-home>.banner').style.height = '60px';
        }
        document.querySelector('.user-home>.avatar').style.backgroundImage = 'url(' + jsonData[accountNumber]['avatar_url'] + ')';
        document.querySelector('.user-home>.content>.username').textContent = jsonData[accountNumber]['username'];

        let btnActionSeeUser = document.createElement('DIV');
        btnActionSeeUser.classList.add('btn-action');
        btnActionSeeUser.setAttribute('data-action', 'seeNews');
        btnActionSeeUser.setAttribute('id', 'btnActionSeeNews');
        btnActionSeeUser.textContent = 'Voir les informations';
        document.querySelector('.user-home>.content').appendChild(btnActionSeeUser);

        if (administrador === true) {
            let adminWhitness = document.createElement('DIV');
            adminWhitness.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 20px; margin: 0; padding: 0; background: linear-gradient(90deg, black, rgba(0, 0, 0, .5)); text-indent: 5px; color: white;';
            adminWhitness.innerText = 'Administrateur';
            document.querySelector('.user-home').appendChild(adminWhitness);
            let btnactSeeusers = document.createElement('DIV');
            btnactSeeusers.classList.add('btn-action');
            btnactSeeusers.setAttribute('data-action', 'seeUser');
            btnactSeeusers.setAttribute('id', 'btnActionSeeUsers');
            btnactSeeusers.innerText = 'Voir les utilisateurs';
            document.querySelector('.user-home>.content').appendChild(btnactSeeusers);
        }

        btnActionFounding();
    }
}

function setAdminaccount() {
    let adminWhitness = document.createElement('DIV');
    adminWhitness.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 20px; margin: 0; padding: 0; background: linear-gradient(90deg, black, rgba(0, 0, 0, .5)); text-indent: 5px; color: white;';
    adminWhitness.innerText = 'Administrateur';
    document.querySelector('.user-home').appendChild(adminWhitness);
    let btnactSeeusers = document.createElement('DIV');
    btnactSeeusers.classList.add('btn-action');
    btnactSeeusers.setAttribute('id', 'btn-seeusers');
    btnactSeeusers.setAttribute('data-action', 'seeUser');
    btnactSeeusers.innerText = 'Voir les utilisateurs';
    document.querySelector('.user-home>.content').appendChild(btnactSeeusers);
}

function seeUser() {
    document.querySelector('.user-home').style.display = 'none';
    document.querySelector('.second').style.display = 'block';
    document.querySelector('.second>.content').style.paddingTop = '10px';

    let request = new XMLHttpRequest();
    request.open('GET', accountsURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;
        console.log(jsonData);

        jsonData.forEach(account => {
            let userItem = document.createElement('DIV');
            userItem.classList.add('user-item');
            userItem.setAttribute('data-user', account['username']);
            userItem.innerHTML = '<div class="avatar" style="background-image: url(' + account['avatar_url'] + ')"></div><div class="username">' + account['username'] + '</div>';
            document.querySelector('.second>.content').appendChild(userItem);
        });
    }
}

function seeNews() {
    document.querySelector('.user-home').style.display = 'none';
    document.querySelector('.second').style.display = 'block';
    document.querySelector('.second>.content').style.paddingTop = '0';

    let request = new XMLHttpRequest();
    request.open('GET', postsURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;
        console.log(jsonData);

        let i = 0;
        jsonData.forEach(post => {
            let postItem = document.createElement('DIV');
            postItem.classList.add('news');
            document.querySelector('.second>.content').appendChild(postItem);
            postItem.classList.add(jsonData[i]['id']);
            let postHeader = document.createElement('DIV');
            postHeader.classList.add('header');
            postItem.appendChild(postHeader);
            let postHeaderAvatar = document.createElement('DIV');
            postHeaderAvatar.classList.add('avatar');
            postHeaderAvatar.style.backgroundImage = 'url(' + jsonData[i]['avatar'] + ')';
            postHeader.appendChild(postHeaderAvatar);
            let postHeaderRight = document.createElement('DIV');
            postHeaderRight.classList.add('right');
            postHeader.appendChild(postHeaderRight);
            let postHeaderRightAuthor = document.createElement('DIV');
            postHeaderRightAuthor.classList.add('author');
            postHeaderRightAuthor.innerText = jsonData[i]['author'];
            postHeaderRight.appendChild(postHeaderRightAuthor);
            let postHeaderRightDate = document.createElement('DIV');
            postHeaderRightDate.classList.add('date');
            postHeaderRightDate.innerText = jsonData[i]['date'];
            postHeaderRight.appendChild(postHeaderRightDate);
            let postContent = document.createElement('DIV');
            postContent.classList.add('content');
            postContent.innerHTML = jsonData[i]['content'];
            postItem.appendChild(postContent);
            if (jsonData[i]['image'] !== undefined) {
                let postImage = document.createElement('IMG');
                postImage.src = jsonData[i]['image'];
                postItem.appendChild(postImage);
            };
            i++;
        });
        document.querySelector('.second>.content').firstElementChild.style.marginTop = '-1.5px';
        document.querySelector('.second>.content').lastElementChild.style.borderBottom = 'none';

    }
    // setTimeout(function () { btnNewsitemFounding(); }, 800);
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
let btnAction = document.getElementsByClassName("btn-action");

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

function btnActionFounding() {
    for (var i = 0; i < btnAction.length; i++) {
        btnAction[i].addEventListener("click", function () {
            console.log(this.getAttribute('data-action'));
            if (this.getAttribute('data-action') === 'seeUser') {
                seeUser();
            } else if (this.getAttribute('data-action') === 'seeNews') {
                seeNews();
            }
        });
    }
}

// for (var i = 0; i < btnUseritem.length; i++) {
//     btnUseritem[i].addEventListener("click", function () {
//         console.log(this.innerHTML);
//     });
// }

// setInterval("btnUseritemFounding()", 1000);

function showHint(str) {
    if (str.length == 0) {
        document.getElementById("usernameTrend").innerHTML = "";
        return;
    } else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("usernameTrend").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET", "https://ajax.conekt.repl.co/index.php?q=" + str, true);
        xmlhttp.send();
    }
}

// document.getElementById('email').autocomplete = 'off';