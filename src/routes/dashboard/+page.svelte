    <script lang="ts">
        import "tailwindcss/tailwind.css";
        import { goto } from '$app/navigation';
        import { supabase } from '$lib/supabaseClient'; 
        import AdminDashboard from "$lib/components/administrator/AdminDashboard.svelte";
        import DepartmentDashboard from "$lib/components/departments/DepartmentDashboard.svelte";

        export let data: { session: any };
        const { session } = data;

        // Define the profile object, including profile_pic for the profile picture URL
        let profile: { first_name?: string; last_name?: string; role?: string; profile_pic?: string } | null = null;
        let loading = true;

        // Fetch the user's profile details, including the profile_pic field
        const fetchUserProfile = async () => {
            if (session) {
                const { user } = session;
                const { data, error } = await supabase
                    .from("profiles")
                    .select("first_name, last_name, role, profile_pic")
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching user profile:", error.message);
                } else {
                    profile = data;
                }
            }
            loading = false; // Set loading to false after the fetch
        };

        fetchUserProfile();

        
    </script>

    <div class="min-h-screen bg-base-300 p-8">
        <div class="flex flex-col items-center justify-center">
            <div class="max-w-3xl text-centerr">
                {#if loading}
                    <span class="loading loading-spinner loading-sm"></span>
                    <p class="text-white">Loading...</p> <!-- Show loading state -->
                {:else if session !== null && profile}
                    <h1 class="text-white font-bold text-4xl">Welcome, {profile.first_name} {profile.last_name}</h1>
                    {#if profile.role === 'admin'}
                        <AdminDashboard 
                        />
                    {:else}
                        <DepartmentDashboard 
                            firstName={profile.first_name ?? ''} 
                            lastName={profile.last_name ?? ''} 
                            role={profile.role ?? ''} 
                        />
                    {/if}
                {/if}
            </div>
        </div>
    </div>
