<script lang="ts">
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    let email = '';
    let message = '';
    let isLoading = false;

    async function sendMagicLink() {
        isLoading = true;
        const { error } = await supabase.auth.signInWithOtp({ email });
        isLoading = false;
        if (error) {    
            console.error('Error sending magic link:', error.message);
            message = `Failed to send magic link. ${error.message}`;
        } else {
            message = 'Check your email for the magic link!';
        }
    }
</script>

<div class="hero min-h-screen bg-base-300">
    <div class="hero-content">
        <div class="max-w-md text-center">
            <h1 class="text-white font-bold text-4xl">Login with Magic Link</h1>
            <p class="py-6">Enter your email to receive a magic link.</p>
            <form on:submit|preventDefault={sendMagicLink}>
                <input type="email" bind:value={email} placeholder="Enter your email" required class="input input-bordered" />
                <button type="submit" class="btn btn-primary" disabled={isLoading}>
                    {#if isLoading}
                        <span class="loading loading-spinner loading-sm"></span> <!-- You can style this as needed -->
                    {/if}
                    <span>{isLoading ? 'Sending...' : 'Send Magic Link'}</span>
                </button>
            </form>
            {#if message}
                <p class="mt-4">{message}</p>
            {/if}
        </div>
    </div>
</div>
