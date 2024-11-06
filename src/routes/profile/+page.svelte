<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { supabase } from '$lib/supabaseClient'; 
    import AdminDashboard from "$lib/components/administrator/AdminDashboard.svelte";
    import DepartmentDashboard from "$lib/components/departments/DepartmentDashboard.svelte";

    export let data: { session: any };
    const { session } = data;

    let profile: { first_name?: string; last_name?: string; role?: string; profile_pic?: string; email? : string } | null = null;
    let loading = true;
    let saving = false;
    let profilePicFile: File | null = null;

    // Fetch the user's profile details
    const fetchUserProfile = async () => {
        if (session) {
            const { user } = session;
            const { data, error } = await supabase
                .from("profiles")
                .select("first_name, last_name, email, role, profile_pic")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error.message);
            } else {
                profile = data;
            }
        }
        loading = false; 
    };

    // Save updated profile details, including profile picture if uploaded
    const saveProfile = async () => {
        if (profile && session) {
            saving = true;
            const { user } = session;

            // Upload profile picture if a new file is selected
            let profilePicUrl = profile.profile_pic;
            if (profilePicFile) {
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from("profile-pictures")
                    .upload(`public/${user.id}/${profilePicFile.name}`, profilePicFile, {
                        cacheControl: "3600",
                        upsert: true
                    });

                if (uploadError) {
                    console.error("Error uploading profile picture:", uploadError.message);
                } else if (uploadData) {
                    profilePicUrl = supabase.storage.from("profile-pictures").getPublicUrl(uploadData.path).data.publicUrl;
                }
            }

            // Update profile details in the database
            const { error } = await supabase
                .from("profiles")
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    profile_pic: profilePicUrl
                })
                .eq("id", user.id);

            if (error) {
                console.error("Error updating profile:", error.message);
            } else {
                alert("Profile updated successfully!");
            }
            saving = false;
        }
    };

    // Handle profile picture selection
    const handleProfilePicChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        profilePicFile = target.files ? target.files[0] : null;
    };

    fetchUserProfile();
</script>

<div class="hero min-h-screen bg-base-300 overflow-y-auto">
    <div class="hero-content flex flex-col items-center justify-center">
        <div class="max-w-md text-center">
            {#if loading}
                <span class="loading loading-spinner loading-sm"></span>
                <p class="text-white">Loading...</p>
            {:else if session !== null && profile}
                <h1 class="text-white font-bold text-4xl">Edit Profile</h1>
                {#if profile.profile_pic}
                    <img src={profile.profile_pic} alt="Profile Picture" class="rounded-full w-32 h-32 mx-auto mb-4" />
                {/if}
                <form on:submit|preventDefault={saveProfile} class="mt-4">
                    <div class="mb-4">
                        <label for="profile-pic" class="text-white">Profile Picture</label>
                        <input id="profile-pic" type="file" accept="image/*" on:change={handleProfilePicChange} class="block w-full text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none" />
                    </div>
                    <div class="mb-4">
                        <label for="first-name" class="text-white">First Name</label>
                        <input id="first-name" type="text" bind:value={profile.first_name} placeholder="Enter first name" class="input input-bordered w-full" />
                    </div>
                    <div class="mb-4">
                        <label for="last-name" class="text-white">Last Name</label>
                        <input id="last-name" type="text" bind:value={profile.last_name} placeholder="Enter last name" class="input input-bordered w-full" />
                    </div>
                    <div class="mb-4">
                        <label class="text-white">Role</label>
                        <input type="text" value={profile.role} disabled class="input input-bordered w-full bg-gray-100" />
                    </div>
                    <button type="submit" class="btn btn-primary w-full" disabled={saving}>
                        {#if saving}Saving...{:else}Save Profile{/if}
                    </button>
                </form>
            {/if}
        </div>
    </div>
</div>
