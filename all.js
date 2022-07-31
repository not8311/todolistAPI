const logInWrap = document.querySelector('.login');
const signUpWrap = document.querySelector('.signup');
const signUp = document.querySelector('#signUp');
const logIn = document.querySelector('#logIn');

signUp.addEventListener('click',(e=>{
    logInWrap.classList.add('d-none');
    signUpWrap.classList.remove('d-none');
}))
logIn.addEventListener('click',(e=>{
    signUpWrap.classList.add('d-none');
    logInWrap.classList.remove('d-none');
}))