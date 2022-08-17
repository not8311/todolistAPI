let data = [];

const APIurl = 'https://todoo.5xcamp.us';
const logInWrap = document.querySelector('.login');
const signUpWrap = document.querySelector('.signup');
const userWrap = document.querySelector('.user');
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
const userGroup = document.querySelector('.user-group');
let token = '';
let userName = '';

// console.log(userGroup.childNodes[3]);

// 切換頁面
signUp.addEventListener('click',(e=>{
    logInWrap.classList.add('d-none');
    signUpWrap.classList.remove('d-none');
}))
logIn.addEventListener('click',(e=>{
    signUpWrap.classList.add('d-none');
    logInWrap.classList.remove('d-none');
}))

logInForm[2].addEventListener('click',callLogIn);

signUpForm[4].addEventListener('click',callSignUp);

userGroup.childNodes[3].addEventListener('click',callLogout);

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
    axios.post(`${APIurl}/users/sign_in`,obj)
        .then((response)=>{
            Swal.fire({
                title:response.data.message,
                icon: 'success'
            });
            token = response.headers.authorization;
            getTodo(token);
            logInForm[0].value = '';
            logInForm[1].value = '';
            userName = response.data.nickname;
        })
        .catch((error)=>{
            Swal.fire({
                title: error.response.data.message,
                icon: 'error'
            });
            console.log(error);
            logInForm[0].value = '';
            logInForm[1].value = '';
        })
}
// 註冊api連接
function callSignUp(){
    for(let i = 0; i < signUpForm.length;i++){
        if(signUpForm[i].value.trim() === ''){
            Swal.fire('請輸入資料','','warning');
            return;
        }
    }
    if(signUpForm[2].value.trim() !== signUpForm[3].value.trim()){
        Swal.fire('密碼不相同，請重新輸入','','warning');
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
    axios.post(`${APIurl}/users`,obj)
        .then((response)=>{
            Swal.fire({
                title:response.data.message,
                text:'請重新登入',
                icon: 'success'
            });
            token = response.headers.authorization;
            logInWrap.classList.remove('d-none');
            signUpWrap.classList.add('d-none');
            signUpForm[0].value = '';
            signUpForm[1].value = '';
            signUpForm[2].value = '';
            signUpForm[3].value = '';
        })
        .catch((error)=>{
            console.log(error.data);
        })
}
// 登出
function callLogout(){
    axios.delete(`${APIurl}/users/sign_out`,{headers:{'Authorization':token}})
        .then(res=>{
            console.log(res);
            document.querySelector('body').setAttribute('class','');
            userWrap.classList.add('d-none');
            logInWrap.classList.remove('d-none');
            Swal.fire({
                title:res.data.message,
                icon: 'success'
            });
        })
        .catch(err=>console.log(err));
}
// 渲染
function render(data){
    document.querySelector('body').setAttribute('class','user-bg');
    if(data.length !== 0){
        let activeTab = tab.querySelector('.active').textContent
        let checkedList = data.filter(item=>{
            if(activeTab === '已完成'){
                return item.completed_at !== null;
            }else if(activeTab === '待完成'){
                return item.completed_at === null;
            }else{
                return item;
            }
        })
        notodo.classList.add('d-none');
        cardList.classList.remove('d-none');
        let src = '';
        checkedList.forEach((item,index)=>{
            item.completed_at !== null? item.state = 'checked' : item.state = '';
            src+=`<li data-id="${item.id}" class="checkbox position-relative w-100 d-block px-4"><input type="checkbox" class="position-absolute top-0 start-0 d-block h-100 w-100 m-0" data-num="${index}" ${item.state}><span class="d-block py-3">${item.content}</span><a href="#" class="btn delete-btn position-absolute translate-middle top-50 end-0 d-block" data-num="${index}">X</a></input></li>`
        })
        list.innerHTML = src;
        let uncheckedNum = data.filter(item=>item.completed_at === null);
        listFooter.children[0].textContent = `${uncheckedNum.length} 個待完成項目`;
    }else{
        notodo.classList.remove('d-none');
        cardList.classList.add('d-none');
    }
}
// 新增
function add(){
    if(txt.value.trim() === ''){
        Swal.fire('請輸入代辦事項','','warning');
        return;
    }
    let obj = {};
    obj.content = txt.value;
    data.push(obj);
    axios.post(`${APIurl}/todos`,obj,{headers:{'Authorization':token}})
        .then(res=>{
            console.log(res);
            Swal.fire({
                title:'新增成功',
                icon: 'success'
            });
            getTodo(token);
        })
        .catch(err=>console.log(err))
    let tabs = document.querySelectorAll('.tab li');
    tabs.forEach((item)=>item.classList.remove('active'));
    tab.childNodes[1].classList.add('active');
    txt.value = '';
}
// 刪除
function deleteItem(e){
    let id = e.target.closest('li').dataset.id;
    // console.log(id);
    axios.delete(`${APIurl}/todos/${id}`,{headers:{'Authorization':token}})
        .then(res=>{
            console.log(res);
            Swal.fire({
                title:res.data.message,
                icon: 'success'
            });
            getTodo(token);
        })
        .catch(err=>console.log(err))
}
// 分類
function switchTab(e){
    let tabs = document.querySelectorAll('.tab li');
    tabs.forEach((item)=>item.classList.remove('active'));
    e.target.classList.add('active');
    getTodo(token);
}
// 更改狀態
function switchState(e){
    let checkId = e.target.closest('li').dataset.id;
    data.forEach(item => {
        if(item.id === checkId){
            axios.patch(`${APIurl}/todos/${item.id}/toggle`,{},{headers:{"Authorization":token}})
            .then(res=>{
                console.log(res);
                getTodo(token);
            })
            .catch(err=>console.log(err))
        }
    });
}
// 刪除已完成
function delAllBtn(e){
    data.forEach(item=>{
        if(item.completed_at !== null){
            axios.delete(`${APIurl}/todos/${item.id}`,{headers:{'Authorization':token}})
                .then(res=>{
                    console.log(res);
                    Swal.fire({
                        title:'已刪除已完成項目',
                        icon: 'success'
                    });
                    getTodo(token);
                    let tabs = document.querySelectorAll('.tab li');
                    tabs.forEach((item)=>item.classList.remove('active'));
                    tab.childNodes[1].classList.add('active');
                })
                .catch(err=>console.log(err))
        }
    })
    
}
// get列表
function getTodo(token){
    axios.get(`${APIurl}/todos`,{headers:{"Authorization":token}})
        .then((response)=>{
            userWrap.classList.remove('d-none');
            logInWrap.classList.add('d-none');
            userGroup.childNodes[1].textContent = `${userName}代辦`;
            data = response.data.todos;
            // console.log(data);
            render(data);
        })
        .catch(error=>console.log(error))
}