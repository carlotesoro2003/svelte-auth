<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  export let data: { supabase: typeof import('$lib/supabaseClient').supabase, session: any };
  let { session } = data;

  let loading = true;
  let loggingOut = false;

  console.log("Initial session:", session); // Log the initial session state

  onMount(() => {
      loading = false;

      // Set up an auth state listener to monitor session changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          session = newSession; // Update the session variable in real-time
          console.log("Auth state changed:", event, "New session:", newSession); // Log the auth state change

          if (!session) {
              console.log("No active session, redirecting to login.");
              goto('/login'); // Redirect to login if no active session
          }
      });

      return () => {
          authListener.subscription.unsubscribe(); // Cleanup listener on unmount
      };
  });

  async function logout() {
      loggingOut = true;
      console.log("Logging out...");

      const { error } = await supabase.auth.signOut();
      loggingOut = false;

      if (error) {
          console.error("Error logging out:", error.message);
      } else {
          console.log("Logged out successfully. Checking session...");
      }
  }
</script>

{#if loading}
<div class="flex items-center justify-center min-h-screen bg-base-300">
  <div class="loader">
    <span class="loading loading-spinner loading-sm"></span>
    Loading...
  </div>
</div>
{:else}
<div class="bg-base-100 justify-between fixed top-0 left-0 right-0">
  <div class="navbar max-w-3xl mx-auto justify-between">
    <!-- Left side of navbar -->
    <div>
      {#if session !== null}
        <a href="/dashboard" class="btn btn-ghost">Dashboard</a>
        <a href="/profile" class="btn btn-ghost">Profile</a>   
        <a href="/monitoring" class="btn btn-ghost">Monitoring</a> 
        <a href="/users" class="btn btn-ghost">Users</a> 
        {:else}
        <a href="/" class="btn btn-ghost text-xl">EuCorp</a>
      {/if}
    </div>
    
    <!-- Right side of navbar -->
    <div>
      {#if session === null}
        <button on:click={() => goto("/login")} class="btn btn-ghost">Login</button>
      {:else}
        <span class="text-white text-lg ml-2">{session.user.email}</span>
        {#if loggingOut}
          <div class="loader">Logging out...</div> <!-- Display during logout -->
        {:else}
          <button on:click={logout} class="btn btn-ghost">Logout</button>
        {/if}
      {/if}
    </div>
  </div>
</div>

<slot />
{/if}

<style>
.loader {
  font-size: 1.25rem;
  font-weight: bold;
  color: white; /* Adjust color as needed */
}
</style>
