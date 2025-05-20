import { db } from "../infra";
import { api } from "encore.dev/api";

export async function storeWorkflowResult(
    workflowId: string,
    inputParams: any,
    status: string
) {
    await db.exec`INSERT INTO workflow (id, input_params, status) VALUES (${workflowId}, ${JSON.stringify(inputParams)}, ${status}) ON CONFLICT (id) DO UPDATE SET status = ${status}`;
}

export async function storeStepOutput(
    workflowId: string,
    stepIndex: number,
    taskId: string,
    output: any,
    status: string
) {
    await 
        db.exec`INSERT INTO workflow_step (workflow_id, step_index, task_id, output, status) 
        VALUES (${workflowId}, ${stepIndex}, ${taskId}, ${JSON.stringify(output)}, ${status})`;
  
}

export async function storeWorkflowLog(
    workflowId: string,
    stepIndex: number | null,
    message: string,
    status: string
) {
    await db.exec
        `INSERT INTO workflow_log (workflow_id, step_index, message, status) VALUES (${workflowId}, ${stepIndex}, ${message}, ${status})`;

}

// API endpoint: Get workflow status
export const getWorkflowStatus = api({
    method: "GET",
    path: "/workflow/status/:id",
    expose: true,
}, async ({ id }: { id: string }) => {
    const row = await db.queryRow`SELECT status FROM workflow WHERE id = ${id}`;
    return { id, status: row?.status ?? "not_found" };
});

// API endpoint: Get workflow result (steps and outputs)
export const getWorkflowResult = api({
    method: "GET",
    path: "/workflow/result/:id",
    expose: true,
}, async ({ id }: { id: string }) => {
    const steps = await db.queryRow
        `SELECT step_index, task_id, output, status FROM workflow_step WHERE workflow_id = ${id} ORDER BY step_index`
    return { id, steps };
});