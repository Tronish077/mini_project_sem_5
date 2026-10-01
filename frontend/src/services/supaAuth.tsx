import { supabase } from "../utils/supabaseClient";

export async function HandleLogin(event: React.BaseSyntheticEvent) {
    event.preventDefault();

    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

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

export async function HandleRegister(event: React.BaseSyntheticEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const confirmedPass = form.confirmPassword.value;

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

export async function HandlePasswordReset(event: React.BaseSyntheticEvent) {
    event.preventDefault();

    const email = (event.target as HTMLFormElement).email.value;

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

export async function HandlePasswordResetUpdate(event: React.BaseSyntheticEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const newPassword = form.password.value;
    const confirmPass = form.confirmPassword.value;

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