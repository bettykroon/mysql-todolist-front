import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import './Home.scss';

export function Home(){

    const [ todos, setTodos ] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:3000/users")
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                setTodos(data)              
            }
        })
    }, []);
    
    const [ todo, setTodo ] = useState([]);

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        let name = e.target.name;
        setTodo({...todo, [name]: e.target.value});
    }

    function save(){
        console.log(todo);
        
        fetch("http://localhost:3000/users", {
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

        window.location.reload();
    }

    function done(delTodo: any){
        let todoToDelete = [{todo: delTodo}];
        
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
            <h3>{todo} <FontAwesomeIcon className="icon" icon={faCircleXmark} onClick={() => done(todo)}></FontAwesomeIcon></h3>
        </li>)
    })

    return (<>
        <header>
            <h1>My todolist</h1>
        </header>

        <div className="todos">
            <form>
                <input type="text" name="todo" placeholder="Todo" onChange={handleChange}/>
                <button type="button" onClick={save}>Save</button>
            </form>

            <h2>Todos:</h2>
            <ul>{lis}</ul>
        </div>
    </>)
}