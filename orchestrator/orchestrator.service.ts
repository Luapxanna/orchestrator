import { api } from "encore.dev/api";
import { logStep } from "../logger/logger.service";
import { tracingMiddleware } from "../shared/middleware";
import { WorkerService } from "../workers/workers.service";
import { TaskStep } from "../shared/type";


const MAX_RETRIES = 3;

// Map of taskID to worker function
const workerMap: { [key: string]: (params: any) => Promise<any> } = {
    mathWorker: WorkerService.mathWorker,
    textWorker: WorkerService.textWorker,
    externalDataWorker: WorkerService.externalDataWorker,
};

async function callWorkerWithRetry(taskID: string, params: any, traceId: string) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.debug(`[DEBUG] traceId=${traceId} - Calling worker ${taskID} with params: ${JSON.stringify(params)}`);
            const result = await workerMap[taskID](params);
            await logStep(taskID, `Success on attempt ${attempt} [traceId: ${traceId}]`, "success");
            console.debug(`[DEBUG] traceId=${traceId} - Worker ${taskID} succeeded with result: ${JSON.stringify(result)}`);
            return result;
        } catch (error: any) {
            console.error(`[DEBUG] traceId=${traceId} - Worker ${taskID} failed on attempt ${attempt}: ${error.message}`);
            await logStep(taskID, `Attempt ${attempt} failed: ${error.message} [traceId: ${traceId}]`, "error");
            if (attempt === MAX_RETRIES) throw new Error(`Task ${taskID} failed after ${MAX_RETRIES} attempts`);
        }
    }
}

/**
 * API endpoint to execute a sequence of tasks.
 * Accepts a list of tasks with parameters, calls worker services in order,
 * and passes output between steps.
 * Uses tracingMiddleware to add a traceId to each call.
 * Only returns last task's result
 */
export const runTaskSequence = api({
    method: "POST",
    path: "/workflow/run-sequence",
    expose: false, // Internal endpoint
}, async ({task_sequence, req }: {task_sequence: TaskStep[], req: any }) => {
    let lastOutput: any = undefined;
    // Get traceId from middleware context, fallback if missing
    const traceId = (req as typeof req & { context?: { traceId?: string } }).context?.traceId ?? "no-trace";

    for (const step of task_sequence) {
        // Merge previous output and traceId into current params if needed
        const params = { ...step.params, previousOutput: lastOutput, traceId };

        // Call the worker service for this task with retry logic
        if (!workerMap[step.taskID]) {
            await logStep(step.taskID, `Unknown worker [traceId: ${traceId}]`, "error",);
            throw new Error(`Unknown worker: ${step.taskID}`);
        }
        lastOutput = await callWorkerWithRetry(step.taskID, params, traceId);
    }

    return {
        result: lastOutput,
        traceId,
        message: "Task sequence completed"
    };
});
