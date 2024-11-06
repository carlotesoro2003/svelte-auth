<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';

    let users: Array<{ id: number; first_name: string; last_name: string; role: string; department_id: number | null; department_name: string | null }> = [];
    let departments: Array<{ id: number; name: string }> = [];
    let selectedDepartment: number | null = null; // Default is null for showing all departments

    // Fetch all users from the profiles table, including department names
    onMount(async () => {
        // Fetch departments
        const { data: deptData, error: deptError } = await supabase
            .from('departments')
            .select('id, name');

        if (deptError) {
            console.error('Error fetching departments:', deptError);
        } else {
            departments = deptData;
        }

        // Fetch users and map department names
        const { data, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role, department_id');

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            users = data.map(user => ({
                ...user,
                department_name: departments.find(department => department.id === user.department_id)?.name || null
            }));
        }
    });

    // Navigate to user details on role click
    const viewUserDetails = (id: number) => {
        goto(`/users/${id}`);
    };

    // Filter users based on the selected department
    const filteredUsers = () => {
        return selectedDepartment
            ? users.filter(user => user.department_id === selectedDepartment)
            : users;
    };
</script>

<div class="min-h-screen bg-base-300 p-8">
    <h1 class="text-2xl font-bold mb-4">User List</h1>

    <!-- Department Filter Dropdown -->
    <div class="mb-4">
        <label for="department-filter" class="text-white">Filter by Department:</label>
        <select id="department-filter" bind:value={selectedDepartment} class="input input-bordered w-full">
            <option value="">All Departments</option>
            {#each departments as { id, name }}
                <option value={id}>{name}</option>
            {/each}
        </select>
    </div>

    <table class="table-auto w-full shadow-lg rounded-lg overflow-hidden">
        <thead>
            <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
                <th class="px-6 py-3">First Name</th>
                <th class="px-6 py-3">Last Name</th>
                <th class="px-6 py-3">Role</th>
                <th class="px-6 py-3">Department</th>
                <th class="px-6 py-3"></th>
            </tr>
        </thead>
        <tbody>
            {#each filteredUsers() as { id, first_name, last_name, role, department_name }}
                <tr class="border-b">
                    <td class="px-6 py-4">{first_name}</td>
                    <td class="px-6 py-4">{last_name}</td>
                    <td class="px-6 py-4">{role}</td>
                    <td class="px-6 py-4">{department_name || 'N/A'}</td>
                    <td class="px-6 py-4">
                        <button on:click={() => viewUserDetails(id)} class="btn btn-primary">
                            View
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
