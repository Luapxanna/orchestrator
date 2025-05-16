/**
 * Processes a task by performing some computation or external API call.
 * @param taskID - The unique identifier for the task.
 * @returns A message indicating the task's completion.
 */
export async function processTask(taskID: string): Promise<string> {
    // Simulate task processing (e.g., data transformation or API call)
    console.log(`Processing task with ID: ${taskID}`);
    
    // Simulate a delay for task processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a success message
    return `Task ${taskID} processed successfully.`;
}

/**
 * Validates input data for a task.
 * @param inputData - The data to validate.
 * @returns A boolean indicating whether the data is valid.
 */
export async function validateTaskInput(inputData: any): Promise<boolean> {
    console.log(`Validating input data: ${JSON.stringify(inputData)}`);
    
    // Simulate validation logic
    const isValid = inputData && typeof inputData === "object" && "taskID" in inputData;

    return isValid;
}

/**
 * Performs a mathematical operation on two numbers.
 * @param operation - The mathematical operation to perform (e.g., "add", "subtract", "multiply", "divide").
 * @param a - The first number.
 * @param b - The second number.
 * @returns The result of the mathematical operation.
 */
export async function mathWorker({ operation, a, b }: { operation: string, a: number, b: number }) {
    if (operation === "divide" && b === 0) throw new Error("Division by zero");
    switch (operation) {
        case "add": return a + b;
        case "subtract": return a - b;
        case "multiply": return a * b;
        case "divide": return a / b;
        default: throw new Error("Unknown math operation");
    }
}

/**
 * Performs a text transformation action on a given string.
 * @param action - The action to perform on the text (e.g., "uppercase", "reverse").
 * @param text - The text to transform.
 * @returns The transformed text.
 */
export async function textWorker({ action, text }: { action: string, text: string }) {
    switch (action) {
        case "uppercase": return text.toUpperCase();
        case "reverse": return text.split("").reverse().join("");
        default: throw new Error("Unknown text action");
    }
}

/**
 * Simulates fetching external data from a given URL.
 * @param url - The URL to fetch data from.
 * @returns The fetched data.
 */
export async function externalDataWorker({ url }: { url: string }) {
    // Simulate random error
    if (Math.random() < 0.3) throw new Error("Random external data fetch error");
    // Simulate fetching data
    return { data: `Fetched from ${url}` };
}

export const WorkerService = { mathWorker, textWorker, externalDataWorker };