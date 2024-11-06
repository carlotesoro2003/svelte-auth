export async function evaluateGoal(target: string, evaluation: string): Promise<string> {
    try {
        const response = await fetch("http://localhost:5173/evaluate-goal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ target, evaluation }), // Ensure 'target' and 'evaluation' are used here
        });

        if (!response.ok) {
            throw new Error("Failed to evaluate goal.");
        }

        const data = await response.json();
        return data.aiEvaluation;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
