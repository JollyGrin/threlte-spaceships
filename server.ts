import { mockDataService } from './src/lib/mockDataService';

// Track connected clients
const clients = new Set<Response>();

// Start the mock data service
mockDataService.start();

// Handle client disconnection
function removeClient(client: Response) {
    clients.delete(client);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
}

const server = Bun.serve({
    port: 3002,
    async fetch(req) {
        const url = new URL(req.url);

        // Handle SSE endpoint
        if (url.pathname === '/events') {
            // Set up SSE headers
            const headers = {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*', // For development
            };

            // Create SSE stream
            const stream = new ReadableStream({
                start(controller) {
                    // Send initial message
                    controller.enqueue('data: connected\n\n');

                    // Subscribe to mock data service
                    const unsubscribe = mockDataService.subscribe((states) => {
                        controller.enqueue(`data: ${JSON.stringify(states)}\n\n`);
                    });

                    // Handle stream closure
                    req.signal.addEventListener('abort', () => {
                        unsubscribe();
                    });
                },
            });

            // Create response
            const response = new Response(stream, { headers });

            // Track client
            clients.add(response);
            console.log(`New client connected. Total clients: ${clients.size}`);

            // Remove client when connection closes
            req.signal.addEventListener('abort', () => {
                removeClient(response);
            });

            return response;
        }

        // Handle other routes
        return new Response('Not Found', { status: 404 });
    },
});

console.log(`SSE Server running at http://localhost:${server.port}`);

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    mockDataService.stop();
    process.exit();
});
