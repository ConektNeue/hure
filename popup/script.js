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
    if (email.value === 'Desarollador' && password.value === 'bumbum@78!') {
        localStorage.setItem('user', 'Desarollador');
        localStorage.setItem('password', 'bumbum@78!');
        initializeSession('developer');
    } else {
        alert('Email ou mot de passe incorrect.');
    }
}

function initializeSession(name) {
    alert('bang!');
}