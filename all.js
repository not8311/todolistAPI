const apiUrl = `https://todoo.5xcamp.us`;
let token = "";

function signUp(email,nickname,pwd){
    axios.post(`${apiUrl}/users`,{
        "user": {
            "email": email,
            "nickname": nickname,
            "password": pwd
        }
    })
    .then(res=>console.log(res))
    .catch(error=>console.log(error.response))
}

function logIn(email,pwd){
    axios.post(`${apiUrl}/users/sign_in`,{
        "user": {
            "email": email,
            "password": pwd
        }
    })
    .then(res=>{
        // 一次性存入header的Authorization裡
        axios.defaults.headers.common['Authorization'] = res.headers.authorization;
    })
    .catch(error=>console.log(error.response))
}

function getTodo(){
    axios.get(`${apiUrl}/todos`)
    .then(res=>console.log(res))
    .catch(error=>console.log(error.response))
}

function addTodo(todo){
    axios.post(`${apiUrl}/todos`,{
        "todo":{
            "content": todo
        }
    })
    .then(res=>console.log(res))
    .catch(error=>console.log(error.response))
}

function editTodo(todo,todoId){
    axios.put(`${apiUrl}/todos/${todoId}`,{
        "todo":{
            "content": todo
        }
    })
    .then(res=>console.log(res))
    .catch(error=>console.log(error.response))
}

function deleteTodo(todoId){
    axios.delete(`${apiUrl}/todos/${todoId}`)
    .then(res=>console.log(res))
    .catch(err=>console.log(err.response))
}

function checkTodo(todoId){
    // axios.patch(url,data,config)
    axios.patch(`${apiUrl}/todos/${todoId}/toggle`,{})
    .then(res=>console.log(res))
    .catch(err=>console.log(err.response))
}
