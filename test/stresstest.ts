import { runTaskSequence } from "../orchestrator/orchestrator.service";

async function simulateWorkflow(workflowId: string) {
    const taskSequence = [
        { taskID: "mathWorker", params: { operation: "add", a: 1, b: 2 } },
        { taskID: "textWorker", params: { action: "uppercase", text: "hello" } },
        { taskID: "externalDataWorker", params: { url: "https://example.com" } },
    ];

    try {
        console.log(`[TEST] Starting workflow ${workflowId}`);
        const result = await runTaskSequence({ task_sequence: taskSequence, req: {} });
        console.log(`[TEST] Workflow ${workflowId} completed with result: ${JSON.stringify(result)}`);
    } catch (error: any) {
        console.error(`[TEST] Workflow ${workflowId} failed: ${error.message}`);
    }
}

async function stressTest() {
    const workflows = Array.from({ length: 10 }, (_, i) => `workflow-${i + 1}`);
    await Promise.all(workflows.map(simulateWorkflow));
}

stressTest().catch(console.error);