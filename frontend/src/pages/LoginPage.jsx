import React from 'react'
import { useState } from 'react'


const LoginPage = () => {
    const [user, setUser] = useState({
        username : '',
        password : '',
        isEventOrganizer : false
    }); // stores user information
    const [newUser, setNewUser] = useState(false); // switch between login and sign up
    const [message, setMessage] = useState(''); // store message about login/signup status

    const handleSubmit = async (e) =>
    {
        e.preventDefault(); // prevent react to re-render

        if(newUser) // create a new account
        {
            const res = await fetch("/api/users", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            }); // send information to server
            const data = await res.json(); // get respond from server
            const m = data.success ? "Account Created Successfully!" : data.message; // generate message
            setMessage(m);
        }
        else
        {
            const res = await fetch("/api/users/login", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            });
            const data = await res.json();
            console.log("client: ", user);
            console.log("server: ", data);
            const m = data.success ? "Login Successfully!" : data.message;
            setMessage(m);
        }
    }


    return (
    <>
        <h1>Login to Your Account</h1><br />

        <form onSubmit={handleSubmit}> 
            <label>Username:{' '}</label>
            <input
                placeholder='Enter Username'
                value={user.username}
                onChange={u => setUser({
                    ...user,
                    username : u.target.value
                })}
            /><br /><br />
            <label>Password:{' '}</label>
            <input
                placeholder='Enter Password'
                value={user.password}
                onChange={u => setUser({
                    ...user,
                    password : u.target.value
                })}
            /> <br /><br />
            <input type="checkbox" onChange={() =>{
                setUser({
                    ...user,
                    isEventOrganizer: !(user.isEventOrganizer)
                })
            }}></input>
            <label>I am an event organizer</label> <br /><br />
            <input type="checkbox" onChange={() => setNewUser(!newUser)}></input>
            <label>Create A New Account</label> <br /><br />
            <button type="submit" >{newUser ? "Sign Up" : "Login"}</button>
        </form>
        <br />
        <h2 color="red">{message}</h2>
    </>
    )
}

export default LoginPage
