import { middleware } from "encore.dev/api";
import { v4 as uuidv4 } from "uuid";


// Middleware that adds a traceId to each request
// No need to extend MiddlewareRequest; use type assertion for context property if needed

export const tracingMiddleware = middleware(async (req, next) => {
    // Generate a trace ID for each request
    const traceId = uuidv4();

    // Attach traceId to context (using type assertion to avoid type error)
    const reqWithContext = req as typeof req & { context?: { [key: string]: any } };
    if (!reqWithContext.context) reqWithContext.context = {};
    reqWithContext.context.traceId = traceId;

    console.log(`[TRACE] traceId=${traceId} - Handling request`);

    // Proceed with request
    const res = await next(req);

    console.log(`[TRACE] traceId=${traceId} - Completed request`);

    return res;
});