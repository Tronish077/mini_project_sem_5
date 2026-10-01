import { supabase } from "../utils/supabaseClient";

export async function HandleLogin(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return {
            success: false,
            message: error.message
        };
    }

    return {
        success: true
    };
}

export async function  HandleRegister(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmedPass = event.target.confirmPassword.value;

    if(password !== confirmedPass){
        console.error("Passwords do not match")
        return {
            success:false,
            message:"Passwords do not match"
        }
    }

    const {error} = await supabase.auth.signUp({ email, password });

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    // Sign in immediately so a session exists for ProtectedRoute
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
        return{
            success:false,
            message: signInError.message
        }
    }

    return {
        success:true
    }
    
}

export async function HandlePasswordReset(event) {
    event.preventDefault();

    const email = event.target.email.value;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    return{
        success:true
    }
}

export async function HandlePasswordResetUpdate(event) {
    event.preventDefault();

    const newPassword = event.target.password.value;
    const confirmPass = event.target.confirmPassword.value;

    if(newPassword !== confirmPass){
        return false;
    }

    const {error} = await supabase.auth.updateUser({
        password: newPassword
    })

    if(error){
        return false
    }
    
    return true;
}

export async function getCurrentUser() {
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
}

export function Logout(){
    supabase.auth.signOut();

}