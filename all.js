let data = [];

const APIurl = 'https://todoo.5xcamp.us/users';
const logInWrap = document.querySelector('.login');
const signUpWrap = document.querySelector('.signup');
const signUp = document.querySelector('#signUp');
const logIn = document.querySelector('#logIn');
const logInForm = document.querySelector('#logInForm');
const signUpForm = document.querySelector('#signUpForm');
const textWarning = document.querySelector('.text-warning');
const cardInput = document.querySelector('.input');
const txt = document.querySelector('.txt');
const notodo = document.querySelector('.notodo');
const cardList = document.querySelector('.card-list');
const tab = document.querySelector('.tab');
const list = document.querySelector('.list');
const listFooter = document.querySelector('.list-footer');
const delAll = document.querySelector('.delAll');
let token = '';

// console.log(delAll);

// 切換頁面
signUp.addEventListener('click',(e=>{
    logInWrap.classList.add('d-none');
    signUpWrap.classList.remove('d-none');
}))
logIn.addEventListener('click',(e=>{
    signUpWrap.classList.add('d-none');
    logInWrap.classList.remove('d-none');
}))

logInForm[2].addEventListener('click',callLogIn)

signUpForm[4].addEventListener('click',callSignUp);

cardInput.addEventListener('click',(e)=>{
    if(e.target.nodeName === 'IMG'){
        add();
    }
});
txt.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        add();
    }
})
list.addEventListener('click',(e)=>{
    if(e.target.nodeName === 'A'){
        deleteItem(e);
    }else if(e.target.nodeName === 'INPUT'){
        switchState(e);
    }
})
tab.addEventListener('click',(e)=>switchTab(e));

delAll.addEventListener('click',(e)=>delAllBtn(e));

// 登入api連接
function callLogIn(){
    let obj = {
        "user":{
            "email" : logInForm[0].value,
            "password" : logInForm[1].value
        }
    };
    if(logInForm[0].value.trim() === '' || logInForm[1].value.trim() === ''){
        textWarning.textContent = '此欄位不可為空';
        return;
    }
    axios.post(`${APIurl}/sign_in`,obj)
        .then((response)=>{
            alert(response.data.message);
        })
        .catch((error)=>{
            console.log(error);
        })
}
// 註冊api連接
function callSignUp(){
    for(let i = 0; i < signUpForm.length;i++){
        if(signUpForm[i].value.trim() === ''){
            alert('請輸入資料');
            return;
        }
    }
    if(signUpForm[2].value.trim() !== signUpForm[3].value.trim()){
        alert('密碼不相同，請重新輸入');
        signUpForm[2].value = '';
        signUpForm[3].value = '';
        return;
    }
    let obj = {
        "user":{
            "email" : signUpForm[0].value,
            "nickname" : signUpForm[1].value,
            "password" : signUpForm[2].value,
        }
    };
    console.log(obj);
    axios.post(`${APIurl}`,obj)
        .then((response)=>{
            alert(response.data.message);
            token = response.headers.authorization;
        })
        .catch((error)=>{
            console.log(error.data);
        })
}
// 渲染
function render(){
    document.querySelector('body').setAttribute('class','user-bg');
    if(data.length !== 0){
        let activeTab = tab.querySelector('.active').textContent
        let checkedList = data.filter(item=>{
            if(activeTab === '已完成'){
                return item.state === 'checked';
            }else if(activeTab === '待完成'){
                return item.state === '';
            }else{
                return item;
            }
        })
        notodo.classList.add('d-none');
        cardList.classList.remove('d-none');
        let src = '';
        checkedList.forEach((item,index)=>{
            src+=`<li data-id="${item.id}" class="checkbox position-relative w-100 d-block px-4"><input type="checkbox" class="position-absolute top-0 start-0 d-block h-100 w-100 m-0" data-num="${index}" ${item.state}><span class="d-block py-3">${item.content}</span><a href="#" class="btn delete-btn position-absolute translate-middle top-50 end-0 d-block" data-num="${index}">X</a></input></li>`
        })
        list.innerHTML = src;
        let uncheckedNum = data.filter(item=>item.state === '');
        listFooter.children[0].textContent = `${uncheckedNum.length} 個待完成項目`;
    }else{
        notodo.classList.remove('d-none');
        cardList.classList.add('d-none');
    }
}
// 新增
function add(){
    if(txt.value.trim() === ''){
        alert('請輸入代辦事項');
        return;
    }
    let id = new Date().getTime();
    let obj = {};
    obj.id = id;
    obj.content = txt.value;
    obj.state = "";
    data.push(obj);
    let tabs = document.querySelectorAll('.tab li');
    tabs.forEach((item)=>item.classList.remove('active'));
    tab.childNodes[1].classList.add('active');
    render(data);
    txt.value = '';
}
// 刪除
function deleteItem(e){
    let num = e.target.getAttribute('data-num');
    data.splice(num,1);
    render(data);
}
// 分類
function switchTab(e){
    let tabs = document.querySelectorAll('.tab li');
    tabs.forEach((item)=>item.classList.remove('active'));
    e.target.classList.add('active');
    render(data);
}
// 更改狀態
function switchState(e){
    let checkId = parseInt(e.target.closest('li').dataset.id);
    data.forEach(item => {
        if(item.id === checkId){
            if(item.state === 'checked' ){
                item.state = '';
            }else{
                item.state = 'checked';
            }
        }
    });
    render(data);
}
// 刪除已完成
function delAllBtn(e){
    data = data.filter(item=>item.state === '')
    render(data);
}
render(data);