<script lang="ts">
  import "tailwindcss/tailwind.css";
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
  import { page } from '$app/stores';

  let user: { id: string; first_name: string; last_name: string; role: string; email: string; department_id?: string } | null = null;
  let loading = true;
  let saving = false;
  let departments: Array<{ id: string; name: string }> = []; // To hold departments
  let selectedDepartmentId: string | null = null; // To store the selected department ID

  // Fetch user details and departments
  onMount(async () => {
    const params = $page.params;
    
    // Fetch user details
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role, department_id')
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('Error fetching user details:', fetchError);
      throw error(404, 'User not found');
    } else {
      user = data;
      selectedDepartmentId = user.department_id || null; // Set selected department if exists
    }
    
    // Fetch all departments
    const { data: departmentData, error: departmentError } = await supabase
      .from('departments')
      .select('id, name');

    if (departmentError) {
      console.error('Error fetching departments:', departmentError);
    } else {
      departments = departmentData;
    }

    loading = false;
  });

  // Save updated profile details
  const saveProfile = async () => {
    if (user) {
      saving = true;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          department_id: selectedDepartmentId // Include selected department
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError.message);
      } else {
        alert('Profile updated successfully!');
      }
      saving = false;
    }
  };
</script>

<div class="hero min-h-screen bg-base-300 overflow-y-auto">
  <div class="hero-content flex flex-col items-center justify-center">
      <div class="max-w-md text-center">
          {#if loading}
              <p class="text-white">Loading...</p>
          {:else if user}
              <h1 class="text-white font-bold text-4xl">Edit Profile</h1>
              <form on:submit|preventDefault={saveProfile} class="mt-4">
                  <div class="mb-4">
                      <label for="first-name" class="text-white">First Name</label>
                      <input id="first-name" type="text" bind:value={user.first_name} class="input input-bordered w-full" />
                  </div>
                  <div class="mb-4">
                      <label for="last-name" class="text-white">Last Name</label>
                      <input id="last-name" type="text" bind:value={user.last_name} class="input input-bordered w-full" />
                  </div>
                  <div class="mb-4">
                      <label for="email" class="text-white">Email</label>
                      <input id="email" type="email" bind:value={user.email} disabled class="input input-bordered w-full bg-gray-100" />
                  </div>
                  <div class="mb-4">
                      <label for="department-select" class="text-white">Select Department</label>
                      <select id="department-select" bind:value={selectedDepartmentId} class="input input-bordered w-full">
                          <option value="">-- Choose a Department --</option>
                          {#each departments as { id, name }}
                              <option value={id}>{name}</option>
                          {/each}
                      </select>
                  </div>
                  <button type="submit" class="btn btn-primary w-full" disabled={saving}>
                      {#if saving}Saving...{:else}Save Profile{/if}
                  </button>
              </form>
          {/if}
      </div>
  </div>
</div>
