let accountsURL = 'https://entpp.conekt.repl.co/accounts.json';
let postsURL = 'https://operator.conekt.repl.co/brandon.json';
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

var newXHR = null;
function sendXHR(type, url, data, callback) {
  newXHR = new XMLHttpRequest() || new window.ActiveXObject("Microsoft.XMLHTTP");
  newXHR.open(type, url, true);
  newXHR.send(data);
  newXHR.onreadystatechange = function() {
    if (this.status === 200 && this.readyState === 4) {
      callback(this.response);
    }
  };
}

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

        let btnActionSeeNews = document.createElement('DIV');
        btnActionSeeNews.classList.add('btn-action');
        btnActionSeeNews.setAttribute('data-action', 'seeNews');
        btnActionSeeNews.setAttribute('id', 'btnActionSeeNews');
        btnActionSeeNews.innerHTML = '<div><p class="title">Voir les informations</p><p class="subtitle">Consultez les posts de vos ami·es</p></div><svg width="8" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.63933 6.88208L2.13901 1.17591C1.65578 0.674598 0.859869 0.674598 0.376637 1.17591C-0.106595 1.67723 -0.106595 2.50293 0.376637 3.00425L4.98156 7.79624L0.362424 12.5882C-0.120808 13.0896 -0.120808 13.9153 0.362424 14.4166C0.60404 14.6672 0.930933 14.7999 1.24361 14.7999C1.5705 14.7999 1.88318 14.6672 2.1248 14.4166L7.62512 8.71041C8.12257 8.20909 8.12257 7.38339 7.63933 6.88208Z" fill="#666666"></path></svg>';
        document.querySelector('.user-home>.content').appendChild(btnActionSeeNews);

        if (administrador === true) {
            let adminWhitness = document.createElement('DIV');
            adminWhitness.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 20px; margin: 0; padding: 0; background: linear-gradient(90deg, black, rgba(0, 0, 0, .5)); text-indent: 5px; color: white;';
            adminWhitness.innerText = 'Administrateur';
            document.querySelector('.user-home').appendChild(adminWhitness);
            let btnactSeeUsers = document.createElement('DIV');
            btnactSeeUsers.classList.add('btn-action');
            btnactSeeUsers.setAttribute('data-action', 'seeUser');
            btnactSeeUsers.setAttribute('id', 'btnActionSeeUsers');
            btnactSeeUsers.innerHTML = '<div><p class="title">Voir les utilisateurices</p><p class="subtitle">Accédez à l\'ensemble des comptes</p></div><svg width="8" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.63933 6.88208L2.13901 1.17591C1.65578 0.674598 0.859869 0.674598 0.376637 1.17591C-0.106595 1.67723 -0.106595 2.50293 0.376637 3.00425L4.98156 7.79624L0.362424 12.5882C-0.120808 13.0896 -0.120808 13.9153 0.362424 14.4166C0.60404 14.6672 0.930933 14.7999 1.24361 14.7999C1.5705 14.7999 1.88318 14.6672 2.1248 14.4166L7.62512 8.71041C8.12257 8.20909 8.12257 7.38339 7.63933 6.88208Z" fill="#666666"></path></svg>';
            document.querySelector('.user-home>.content').appendChild(btnactSeeUsers);
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
            // userItem.innerHTML = '<div class="avatar" style="background-image: url(' + account['avatar_url'] + ')"></div><div class="username">' + account['username'] + '</div>';
            userItem.innerHTML = '<div class="username">' + account['username'] + '</div>';
            document.querySelector('.second>.content').appendChild(userItem);
        });
    }

    setTimeout(() => {
        btnUseritemFounding();
    }, 200);
}

function seeNews() {
    document.querySelector('.user-home').style.display = 'none';
    document.querySelector('.second').style.display = 'block';
    document.querySelector('.second>.content').style.paddingTop = '0';
    document.getElementById('btnCreateNews').style.display = 'flex';
        // let request = new XMLHttpRequest();
        // request.open('GET', postsURL);
        // request.responseType = 'json';
        // request.setRequestHeader('Content-type', 'application/json');
        // request.send();

        // request.onload = function () {
        //     jsonData = request.response;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", postsURL, true);
        
        xhr.setRequestHeader("Accept", "application/json");
        
        xhr.onreadystatechange = function () {
           if (xhr.readyState === 4) {
              console.log(xhr.status);
              console.log(xhr.responseText);
           }};
        
    xhr.send();
    
    xhr.onload = function () {
        jsonData = JSON.parse(xhr.responseText);
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

document.getElementById('btnCreateNews').addEventListener('click', function () {
    openNewsCreationPanel();
});

function openNewsCreationPanel() {
    document.querySelector('body').style.width = '600px';
    document.querySelector('.second').style.left = 'calc(50% - 300px)';
    document.querySelector('.second').style.width = '600px';
    document.querySelector('.second').appendChild(document.querySelector('.message-writing-screen'));
    document.querySelector('.message-writing-screen').style.display = 'block';
    document.querySelector('.second>.content').style.width = '300px';
    document.querySelector('.second>.content').style.marginLeft = '300px';
}

document.getElementById('btn-close-second').addEventListener('click', function () {
    document.querySelector('.second>.content').innerHTML = '';
    document.querySelector('.second').style.display = 'none';
    document.querySelector('.user-home').style.display = 'block';
    document.getElementById('btnCreateNews').style.display = 'none';
});

document.getElementById('btn-close-third').addEventListener('click', function () {
    document.querySelector('.third>.content>.content>.badges').innerHTML = '';
    document.querySelector('.third').style.display = 'none';
    document.querySelector('.second').style.display = 'block';
    document.querySelector('.third>.content>.avatar').style.backgroundImage = '';
    document.querySelector('.third>.content>.content>.username').textContent = '';
    document.querySelector('.third>.content>.banner').style.background = 'black';
    if (document.getElementById('admin-whitness-consulted')) {
        document.getElementById('admin-whitness-consulted').remove();
    }
});

let btnUseritem = document.getElementsByClassName("user-item");
let btnAction = document.getElementsByClassName("btn-action");

function btnUseritemFounding() {
    for (var i = 0; i < btnUseritem.length; i++) {
        btnUseritem[i].addEventListener("click", function () {
            consultingUserFromUserItem(this);
        });
    }
}

function consultingUserFromUserItem(element) {
    document.querySelector('.second').style.display = 'none';
    document.querySelector('.third').style.display = 'block';
    let consultedAccountName = element.getAttribute('data-user');
    consultedAccountName.toString();

    let request = new XMLHttpRequest();
    request.open('GET', accountsURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        jsonData = request.response;

        let consultedAccountAvatarUrl;
        let consultedAccountBannerUrl;
        let consultedAccountBadgesUrl;
        let consultedAccountAdministrador;

        jsonData.forEach(account => {
            if (account['username'] === consultedAccountName) {
                consultedAccountAvatarUrl = account['avatar_url'];
                consultedAccountBannerUrl = account['banner_url'];
                if (account['administrador']) {
                    consultedAccountAdministrador = true;
                }
            }
        });

        if (consultedAccountBannerUrl !== undefined) {
            document.querySelector('.third>.content>.banner').style.backgroundImage = 'url(' + consultedAccountBannerUrl + ')';
            document.querySelector('.third>.content>.banner').style.backgroundPosition = 'center';
            document.querySelector('.third>.content>.banner').style.backgroundSize = 'cover';
            document.querySelector('.third>.content>.banner').style.backgroundRepeat = 'no-repeat';
            document.querySelector('.third>.content>.banner').style.height = '120px';
        } else {
            document.querySelector('.third>.content>.banner').style.background = 'black';
            document.querySelector('.third>.content>.banner').style.height = '60px';
        }
        document.querySelector('.third>.content>.avatar').style.backgroundImage = 'url(' + consultedAccountAvatarUrl + ')';
        document.querySelector('.third>.content>.content>.username').textContent = consultedAccountName;

        if (consultedAccountAdministrador) {
            let adminWhitness = document.createElement('DIV');
            adminWhitness.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 20px; margin: 0; padding: 0; background: linear-gradient(90deg, black, rgba(0, 0, 0, .5)); text-indent: 5px; color: white;';
            adminWhitness.innerText = 'Administrateur';
            adminWhitness.id = 'admin-whitness-consulted';
            document.querySelector('.third>.content').appendChild(adminWhitness);
        } else {
            if (document.getElementById('admin-whitness-consulted')) {
                document.getElementById('admin-whitness-consulted').remove();
            }
        }
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

document.getElementById('redactingPost').onkeydown = function (e) {
    let redactingPostLetterNumber = document.getElementById('redactingPost').value.length;
    document.getElementById('redactingPostLetterNumber').textContent = redactingPostLetterNumber;

    if (redactingPostLetterNumber < 20) {
        document.querySelector('.redacting-post-validity-indicator').style.borderColor = 'red';
        document.querySelector('.redacting-post-validity-indicator>p').style.color = 'red';
        document.querySelector('#redactingPostValidityIndicator').textContent = 'est trop court';
    } else if (redactingPostLetterNumber < 200) {
        document.querySelector('.redacting-post-validity-indicator').style.borderColor = 'greenyellow';
        document.querySelector('.redacting-post-validity-indicator>p').style.color = 'greenyellow';
        document.querySelector('#redactingPostValidityIndicator').textContent = 'est valide';
    } else {
        document.querySelector('.redacting-post-validity-indicator').style.borderColor = 'red';
        document.querySelector('.redacting-post-validity-indicator>p').style.color = 'red';
        document.querySelector('#redactingPostValidityIndicator').textContent = 'est trop long';
    }
}

document.getElementById('btnSendRedactedPost').onclick = function () {
    let redactingPostLetterNumber = document.getElementById('redactingPost').value.length;

    if (redactingPostLetterNumber < 20) {
        document.querySelector('.redacting-post-validity-indicator>p').style.textDecoration = 'underline';
    } else if (redactingPostLetterNumber < 200) {
        let postContent = document.getElementById('redactingPost').value;

        let request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:8000/testing/?postcontent=' + postContent + '<br><br>&postauthor=' + localStorage.getItem('username'));
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send('postContent=' + postContent);
    } else {
        document.querySelector('.redacting-post-validity-indicator>p').style.textDecoration = 'underline';
    }
}