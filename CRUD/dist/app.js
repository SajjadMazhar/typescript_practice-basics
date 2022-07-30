"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const DESTINATION = "./data/users.json";
const createUser = (name, email) => {
    const isExist = fs_1.default.existsSync(DESTINATION);
    let existingUsers = isExist ? fs_1.default.readFileSync(DESTINATION, 'utf-8') : '[]';
    if (!isExist) {
        fs_1.default.writeFileSync(DESTINATION, JSON.stringify([]));
    }
    else {
        if (existingUsers.trim() === '') {
            fs_1.default.writeFileSync(DESTINATION, JSON.stringify([]));
        }
    }
    let usersList = JSON.parse(existingUsers);
    const greatestId = usersList.reduce((acc, curr) => {
        return Math.max(acc, curr.id);
    }, 0);
    usersList.push({ name, email, id: greatestId + 1 });
    fs_1.default.writeFileSync(DESTINATION, JSON.stringify(usersList, null, 4));
    console.log(usersList);
    return 1;
};
const getUsers = (id = null) => {
    const usersList = JSON.parse(fs_1.default.readFileSync(DESTINATION, 'utf-8'));
    if (id === null) {
        return { status: "failed", result: usersList };
    }
    const user = usersList.find((user) => user.id === id);
    if (!user) {
        return { status: "failed", result: "user does not exist" };
    }
    return { status: "success", result: user };
};
const updateUser = (id = null, name = undefined, email = undefined) => {
    if (id === null)
        return { status: "failed", result: "please enter the corresponding id" };
    // const {name, email} = updateTo;
    if (!(name && email))
        return { status: "failed", result: "update keywords missing" };
    let usersList = JSON.parse(fs_1.default.readFileSync(DESTINATION, 'utf-8'));
    let newList = usersList.map((user) => {
        if (user.id === id) {
            return name && email ? Object.assign(Object.assign({}, user), { name, email }) : name && !email ? Object.assign(Object.assign({}, user), { name }) : Object.assign(Object.assign({}, user), { email });
        }
        return user;
    });
    fs_1.default.writeFileSync(DESTINATION, JSON.stringify(newList));
    return { status: "success", result: "updated" };
};
const deleteUser = (id = null) => {
    if (id === null)
        return { status: "failed", result: "please enter the corresponding id" };
    let usersList = JSON.parse(fs_1.default.readFileSync(DESTINATION, 'utf-8'));
    const index = usersList.findIndex((user) => user.id === id);
    if (index === -1)
        return { status: "failed", result: "id does not exist" };
    usersList.splice(index, 1);
    fs_1.default.writeFileSync(DESTINATION, JSON.stringify(usersList));
    return { status: "failed", result: "deletion success" };
};
console.log(deleteUser(2));
