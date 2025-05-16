import { processTask, validateTaskInput } from "./workers.service";
import { api } from "encore.dev/api";

/**
 * API to process a task.
 * This is an internal API, as it is not exposed as a public route.
 * @param taskID - The unique identifier for the task.
 * @returns A message indicating the task's completion.
 */
export const processTaskAPI = api({
    method: "POST",
    path: "/tasks/process",
    expose: false,
},
    async ({ taskID }: { taskID: string }) => {
        console.log(`API called to process task with ID: ${taskID}`);
        return await processTask(taskID);
    });

/**
 * API to validate task input data.
 * This is an internal API, as it is not exposed as a public route.
 * @param inputData - The data to validate.
 * @returns A boolean indicating whether the data is valid.
 */
export const validateTaskInputAPI = api(
    {
        method: "POST",
        path: "/tasks/validate",
        expose: false,
    },
    async ({ inputData }: { inputData: any }) => {
        console.log(`API called to validate input data: ${JSON.stringify(inputData)}`);
        return await validateTaskInput(inputData);
    });