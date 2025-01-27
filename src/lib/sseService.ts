import { env } from '$env/dynamic/public';
import type { PyramidState } from './types';

type ConnectionState = 'connecting' | 'connected' | 'disconnected';
type StateCallback = (states: PyramidState[]) => void;
type ConnectionCallback = (state: ConnectionState) => void;

export class SSEService {
    private eventSource: EventSource | null = null;
    private stateCallback: StateCallback | null = null;
    private connectionCallback: ConnectionCallback | null = null;
    private reconnectTimeout: number | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private baseReconnectDelay = 1000; // Start with 1 second

    constructor() {
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }

    private calculateReconnectDelay(): number {
        // Exponential backoff with jitter
        const exp = Math.min(this.reconnectAttempts, 6); // Cap at 2^6 * 1000 = 64 seconds
        const baseDelay = this.baseReconnectDelay * Math.pow(2, exp);
        const jitter = Math.random() * 0.5 + 0.75; // Random between 0.75 and 1.25
        return Math.min(baseDelay * jitter, 60000); // Cap at 60 seconds
    }

    connect() {
        if (this.eventSource) {
            return;
        }

        this.updateConnectionState('connecting');

        try {
            this.eventSource = new EventSource(env.PUBLIC_SSE_URL);

            this.eventSource.onopen = () => {
                console.log('SSE connection established');
                this.reconnectAttempts = 0;
                this.updateConnectionState('connected');
            };

            this.eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (Array.isArray(data)) {
                        this.stateCallback?.(data);
                    }
                } catch (error) {
                    console.error('Error parsing SSE data:', error);
                }
            };

            this.eventSource.onerror = (error) => {
                console.error('SSE connection error:', error);
                this.handleError();
            };

        } catch (error) {
            console.error('Error creating SSE connection:', error);
            this.handleError();
        }
    }

    private handleError() {
        this.disconnect();
        this.updateConnectionState('disconnected');

        // Attempt to reconnect if we haven't exceeded max attempts
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = this.calculateReconnectDelay();
            console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
            
            this.reconnectTimeout = setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    private updateConnectionState(state: ConnectionState) {
        this.connectionCallback?.(state);
    }

    onStateUpdate(callback: StateCallback) {
        this.stateCallback = callback;
    }

    onConnectionChange(callback: ConnectionCallback) {
        this.connectionCallback = callback;
    }
}
