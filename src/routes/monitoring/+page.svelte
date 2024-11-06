<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { writable, get } from 'svelte/store';
    import axios from 'axios';

    // Store for goals
    let goals = writable<{ id: number; goal: string; evaluation: string; achieved: string | null }[]>([]);

    // Function to handle AI evaluation and update the achieved status
    async function evaluateGoal(id: number, goal: string, evaluation: string) {
        try {
            const response = await axios.post('http://localhost:5173/evaluate-goal', {
                goal, // Ensure you're using 'target'
                evaluation
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const achieved = response.data.aiEvaluation.includes("achieved") ? 'Achieved' : 'Not Achieved';

            // Update the specific goal with the achieved status
            goals.update(currentGoals => currentGoals.map(g => g.id === id ? { ...g, achieved } : g));
        } catch (error) {
            console.error('Error evaluating goal:', error);
            goals.update(currentGoals => currentGoals.map(g => g.id === id ? { ...g, achieved: 'Error' } : g));
        }
    }

    // Function to evaluate all goals using Gemini AI
    async function evaluateAllGoals() {
        const allGoals = get(goals);
        for (const goal of allGoals) {
            if (goal.goal && goal.evaluation) {
                await evaluateGoal(goal.id, goal.goal, goal.evaluation);
            }
        }
    }

    // Function to handle text input changes directly in the table
    function handleInput(id: number, field: 'goal' | 'evaluation', value: string) {
        goals.update(currentGoals =>
            currentGoals.map(g => g.id === id ? { ...g, [field]: value } : g)
        );
    }

    // Add a new empty row
    const addGoalRow = () => {
        goals.update(currentGoals => [
            ...currentGoals,
            { id: Date.now(), goal: '', evaluation: '', achieved: null }
        ]);
    };

    // Function to delete a goal
    const deleteGoal = (id: number) => {
        goals.update(currentGoals => currentGoals.filter(goal => goal.id !== id));
    };

    // Initial empty row
    $: if (get(goals).length === 0) addGoalRow();
</script>

<div class="min-h-screen bg-base-300 p-8">
    <h1 class="text-2xl font-bold mb-4">Monitoring Page</h1>

    <!-- Button to add a new row -->
    <button on:click={addGoalRow} class="btn btn-primary mb-4">Add New Goal</button>
    
    <!-- Button to evaluate all goals using Gemini AI -->
    <button on:click={evaluateAllGoals} class="btn btn-secondary mb-4">Evaluate All Goals with Gemini AI</button>

    <!-- Editable Table for Goals and Evaluations -->
    <table class="table-auto w-full shadow-lg rounded-lg overflow-hidden">
        <thead>
            <tr class="bg-gray-200 text-gray-600 uppercase text-sm">
                <th class="px-6 py-3">Goal</th>
                <th class="px-6 py-3">Evaluation</th>
                <th class="px-6 py-3">Achieved</th>
                <th class="px-6 py-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each $goals as { id, goal, evaluation, achieved }}
                <tr class="border-b">
                    <td class="px-6 py-4">
                        <input
                            type="text"
                            class="w-full border border-gray-300 rounded px-2 py-1"
                            value={goal}
                            on:input={(e) => handleInput(id, 'goal', (e.target as HTMLInputElement).value)}
                        />
                    </td>
                    <td class="px-6 py-4">
                        <input
                            type="text"
                            class="w-full border border-gray-300 rounded px-2 py-1"
                            value={evaluation}
                            on:input={(e) => handleInput(id, 'evaluation', (e.target as HTMLInputElement).value)}
                        />
                    </td>
                    <td class="px-6 py-4">{achieved || 'Pending'}</td>
                    <td class="px-6 py-4">
                        <button on:click={() => deleteGoal(id)} class="btn btn-error btn-sm">
                            Delete
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .btn-primary {
        background-color: #3b82f6;
        color: white;
    }
    
    .btn-secondary {
        background-color: #4ade80; /* Green color for the secondary button */
        color: white;
    }

    .btn-error {
        background-color: #ef4444;
        color: white;
    }

    input[type="text"] {
        border: 1px solid #d1d5db;
        padding: 0.5rem;
        border-radius: 0.375rem;
        width: 100%;
    }
</style>
