import { Outlet } from "react-router-dom";

export function Layout(){
    return(<div className="App">
        <div className="page">
            <Outlet></Outlet>
        </div>
    </div>)
}