<script lang="ts">
    import "tailwindcss/tailwind.css";  

    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';

    export let data: { supabase: typeof import('$lib/supabaseClient').supabase, session: any };
    let session = data.session; // Use let to allow reassignment
    let loading = true; // State for loading

    console.log("Session on load: ", session);

    const checkSessionAndInsertUser = async () => {
        if (!session) return; // Early exit if there's no session

        const user = session.user;

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error && error.code === "PGRST116") {
                // User doesn't exist, insert new profile
                const { error: insertError } = await supabase
                    .from("profiles")
                    .insert([{ id: user.id, email: user.email, role: "user" }]);

                if (insertError) {
                    console.error("Error adding to profiles table: ", insertError.message);
                } else {
                    console.log("User added to profiles table");
                }
            } else if (data) {
                console.log("User already exists. Role: ", data.role);
            }

            goto('/dashboard'); 
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching user role:", error.message);
            } else {
                console.error("Error fetching user role:", error);
            }
        }
    };

    onMount(() => {
        // Subscribe to authentication state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            session = newSession; // Update the session variable in real-time
            console.log("Auth state changed:", event, "New session:", newSession); // Log the auth state change

            if (!newSession) {
                console.log("No active session, redirecting to login.");
                goto('/'); // Redirect to login if no active session
            } else {
                checkSessionAndInsertUser(); // Check the session and insert user if necessary
            }
        });

        // Cleanup listener on unmount
        return () => {
            authListener.subscription.unsubscribe();
        };
    });

   
</script>

<div class="hero min-h-screen bg-base-300">
    <div class="hero-content">
        <div class="max-w-md text-center">
                <h1 class="text-white font-bold text-4xl">Welcome to EuCorp</h1>
                <p class="py-6">Create your own account with magic link</p>
                <a href="/login" class="btn btn-primary">Login</a>
        </div>
    </div>
</div>
