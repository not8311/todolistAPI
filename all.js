const APIurl = 'https://todoo.5xcamp.us/users';
const logInWrap = document.querySelector('.login');
const signUpWrap = document.querySelector('.signup');
const signUp = document.querySelector('#signUp');
const logIn = document.querySelector('#logIn');
const logInForm = document.querySelector('#logInForm');
const textWarning = document.querySelector('.text-warning');

// console.log(`${APIurl}/sign_in`);

signUp.addEventListener('click',(e=>{
    logInWrap.classList.add('d-none');
    signUpWrap.classList.remove('d-none');
}))
logIn.addEventListener('click',(e=>{
    signUpWrap.classList.add('d-none');
    logInWrap.classList.remove('d-none');
}))

logInForm[2].addEventListener('click',(e)=>{
    callLogIn();
})

function callLogIn(){
    let user = {};
    user.email = logInForm[0].value;
    user.password = logInForm[1].value;
    if(user.email.trim() === '' || user.password.trim() === ''){
        textWarning.textContent = '此欄位不可為空';
        return;
    }
    axios.post(`${APIurl}/sign_in`,user)
        .then((response)=>{
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
}