import React from 'react'
import { useState , useEffect} from 'react'
import { useUserStore } from '../store/user';
import { Button, Input, Stack, Field, Heading} from "@chakra-ui/react";
import {PasswordInput } from "../components/ui/password-input";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger,} from "../components/ui/dialog"
import { useDialogStore } from '../store/dialog';
import { Checkbox } from "../components/ui/checkbox"
import { Toaster, toaster } from "../components/ui/toaster"


const LoginPage = () => {
    const [user, setUser] = useState({
        username : '',
        password : '',
        isEventOrganizer : false,
    }); // stores user information

    const [newUser, setNewUser] = useState(false); // switch between login and sign up

    const {createUser} = useUserStore();
    const {userLogin, userLogOut, isLoggedIn, curr_user} = useUserStore();
    const { isLoginOpen, openChange, openLogin, closeLogin} = useDialogStore();
    const handleSubmit = async (e) =>
    {
        e.preventDefault(); // prevent react to re-render

        if(newUser) // create a new account
        {
            const {success, message} = await createUser(user);
            console.log("Success: ", success);
            console.log("Message:", message);
            setNewUser(false);
            toaster.create({
                title: message,
                type: success ? "success" : "error",
            })
        }
        else // user login
        {
            const {success, message} = await userLogin(user);
            console.log("Success: ", success);
            console.log("Message:", message);
            toaster.create({
                title: message,
                type: success ? "success" : "error",
            })
            if (success)
            {
                closeLogin(); // close dialog if login successfully
            }
        }  
    }

    if (isLoggedIn) {
        return null;
    }

    return (
    <>
        <DialogRoot placement="center" open={isLoginOpen} onOpenChange={openChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Login/Sign Up</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Stack gap="4">
                        <Field.Root orientation="horizontal">
                            <Field.Label>Username:</Field.Label>
                            <Input 
                                placeholder='Enter Username'
                                onChange={(e) => setUser({...user, username: e.target.value})}
                            />
                        </Field.Root>
                        <Field.Root orientation="horizontal">
                            <Field.Label>Password:</Field.Label>
                            <PasswordInput 
                                placeholder='Enter Password'
                                onChange={(e) => setUser({...user, password: e.target.value})}
                            />
                        </Field.Root>
                        <Checkbox
                            checked={newUser}
                            onCheckedChange={() => setNewUser(!newUser)}
                        >
                        Create a new account
                        </Checkbox>
                        <Checkbox 
                        disabled={!newUser}
                        checked={user.isEventOrganizer} 
                        onCheckedChange={()=>setUser({
                            ...user, 
                            isEventOrganizer: !(user.isEventOrganizer)})}
                        >
                        Create an event organizer account
                        </Checkbox> 
                    </Stack>
                </DialogBody>
                <DialogFooter>
                    <DialogCloseTrigger asChild />
                    <Button onClick={closeLogin} variant="outline">Cancel</Button>
                    <Button onClick={handleSubmit} variant="solid"> {newUser ? "Sign Up" : "Login"} </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    </>
    )
}

export default LoginPage
