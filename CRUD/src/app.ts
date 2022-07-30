import fs from 'fs'
const DESTINATION:string="./data/users.json"
interface User<T>{
    name:string,
    email:string,
    id:T
}
interface GotUser{
    status:string,
    result:User<number>|string|User<number>[]
}


const createUser = (name : string, email : string):number=>{
    const isExist:true|false = fs.existsSync(DESTINATION)
    let existingUsers:string = isExist?fs.readFileSync(DESTINATION, 'utf-8'):'[]'
    if(!isExist) {
        fs.writeFileSync(DESTINATION, JSON.stringify([]))
    }else{
        if(existingUsers.trim() === ''){
            fs.writeFileSync(DESTINATION, JSON.stringify([]))
        }
    }
    let usersList : User<number>[] = JSON.parse(existingUsers)
    const greatestId : number = usersList.reduce((acc, curr)=>{
        return Math.max(acc, curr.id)
    },0)

    usersList.push({name, email, id:greatestId+1})
    fs.writeFileSync(DESTINATION, JSON.stringify(usersList, null, 4))
    console.log(usersList)
    return 1
}

const getUsers = (id:number|null=null):GotUser=>{
    const usersList: User<number>[] = JSON.parse(fs.readFileSync(DESTINATION, 'utf-8'))
    if(id === null){
        return {status:"failed", result:usersList}
    }
    const user:User<number>|undefined = usersList.find((user:User<number>)=> user.id===id)
    if(!user){
        return {status:"failed", result:"user does not exist"}
    }
    return {status:"success", result:user}
}

const updateUser = (id:number|null=null, name:string|undefined=undefined, email:string|undefined=undefined):GotUser => {
    if(id === null) return {status:"failed", result:"please enter the corresponding id"};
    // const {name, email} = updateTo;
    if(!(name && email)) return {status:"failed", result:"update keywords missing"};
    let usersList: User<number>[] = JSON.parse(fs.readFileSync(DESTINATION, 'utf-8'));
    let newList = usersList.map((user:User<number>)=>{
        if(user.id===id){
            return name&&email? {...user, name,email} : name&&!email? {...user, name} : {...user, email}
        }
        return user;
    })
    fs.writeFileSync(DESTINATION, JSON.stringify(newList))
    return {status:"success", result:"updated"}
}

const deleteUser = (id:number|null=null):GotUser =>{
    if(id === null) return {status:"failed", result:"please enter the corresponding id"};
    let usersList: User<number>[] = JSON.parse(fs.readFileSync(DESTINATION, 'utf-8'));
    const index:number = usersList.findIndex((user:User<number>)=> user.id === id)
    if(index === -1) return {status:"failed", result:"id does not exist"};
    usersList.splice(index, 1)
    fs.writeFileSync(DESTINATION, JSON.stringify(usersList))
    return {status:"failed", result:"deletion success"};
}


console.log(deleteUser(2))