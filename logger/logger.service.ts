import log from "encore.dev/log";


export async function logStep(
    taskId: string,
    message: string,
    status: "success" | "error" | "info",
  ) {
    const meta = {
      taskId,
      message,
    };
  
    if (status === "error") log.error("Task log", meta);
    else log.info("Task log", meta);
  }