<!-- Dashboard.svelte -->
<script lang="ts">
    // Define the props for the Dashboard component
    export let firstName: string;
    export let lastName: string;
    export let role: string;
</script>

<div class="dashboard p-4 bg-base-200 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold">Department Dashboard</h1>
    <div class="user-info mt-4">
        <p class="text-lg"><strong>First Name:</strong> {firstName}</p>
        <p class="text-lg"><strong>Last Name:</strong> {lastName}</p>
        <p class="text-lg"><strong>Role:</strong> {role}</p>
    </div>
</div>

<style>
    .dashboard {
        max-width: 400px;
        margin: auto;
    }
</style>
