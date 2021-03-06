import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import './Home.scss';

export function Home(){

    const [ todos, setTodos ] = useState([]);
    const [ lists, setLists ] = useState([]);

    let list: any = localStorage.getItem("list") || null;
    localStorage.setItem("list", list);

    useEffect(() => {
        console.log(list);
        
        if(list === "null"){
            console.log("NULL");
        } else {
            console.log(list);
            getList(list);
        }
        
        fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                setLists(data);                
            }
        })
    }, [list])
    
    const [ todo, setTodo ] = useState([]);
    const [ emptyList, setEmptyList ] = useState("");

    const todoObject = Object.values(todo);

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        let name = e.target.name;
        setTodo({...todo, [name]: e.target.value});
    }

    const [ listBtn, setListBtn ] = useState(false);
    function getList(list: any){
        setListBtn(true);
        let getList = [{list: list}];
        localStorage.setItem("list", list);
        fetch("http://localhost:3000/users/list", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(getList)
        })
        .then(res => res.json())
        .then(data => {
            if(data.length === 0){
                let emptyList = "Listan är tom..";
                setEmptyList(emptyList);
                console.log("LIST", list);
                setTodos([]);
            }
            for (let i = 0; i < data.length; i++) {
                setTodos(data);
                setEmptyList("");           
            }
        })
    }

    function save(list: any){
        let saveToList = [{list: list}, todo];
        console.log(saveToList);
        
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(saveToList)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })

        window.location.reload();
    }

    function done(list: any, delTodo: any){
        let todoToDelete = [{list: list}, {todo: delTodo}];
        
        fetch('http://localhost:3000/users/delete', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(todoToDelete)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        window.location.reload();
    }

    let lis = todos.map((todo, i) => {
        return (
        <li key={i}>
            <h3>{todo} <FontAwesomeIcon className="icon" icon={faCircleXmark} onClick={() => done(list, todo)}></FontAwesomeIcon></h3>
        </li>)
    })

    let dropDownMenu = lists.map((list, i) => {
        return (
            <button key={i} onClick={() => getList(list)}>{list}</button>
        )
    })

    const [ newListBtn, setNewListBtn ] = useState(false);
    function newList(){
        fetch("http://localhost:3000/users/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(todo)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        getList(todoObject[0]);
        window.location.reload();
    }

    function deleteList(name: string){
        fetch("http://localhost:3000/users/delete/" + name, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        localStorage.removeItem("list");
        window.location.reload();
    }

    const [ displayLists, setDisplayLists ] = useState(false);
    function showLists(){
        console.log("HEJ");
        setDisplayLists(!displayLists);
    }

    return (<>
        <header>
            <h1>Listify</h1>
        </header>

        <div className="todos">
            <div className="dropdown">
                <h2 className="droplist" onClick={showLists}>My lists ▾</h2>
                {displayLists && <div className="dropdownlists">{dropDownMenu}</div>}
            </div>

            <button className="newList" onClick={() => setNewListBtn(!newListBtn)}>+ New list</button>
            {listBtn && !newListBtn && <><form>
                <input type="text" name="todo" placeholder={`add to ${list}`} onChange={handleChange}/>
                <button type="button" onClick={() => save(list)}>Add</button>
            </form>

            <h2>{list}:</h2>
            <ul>{lis}</ul>
            <p>{emptyList}</p>
            <div className="delete">
                <button onClick={() => deleteList(list)}>Delete list</button>
            </div>
            </>}

            {newListBtn && <>
                <form>
                    <input type="text" name="list" placeholder="Name" onChange={handleChange}/>
                    <button type="button" onClick={newList}>Create</button>
                </form></>}
        </div>
    </>)
}