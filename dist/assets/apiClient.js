export class ApiRequestError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
    }
}
export async function getHealth() {
    const envelope = await getJson('/api/health');
    return envelope.data;
}
export async function getPreparationItems() {
    const envelope = await getJson('/api/preparation-items');
    return envelope.data.items;
}
export async function getPreparationSummary() {
    const envelope = await getJson('/api/preparation-summaries');
    return envelope.data;
}
async function getJson(path) {
    const response = await fetch(path, { headers: { Accept: 'application/json' } });
    const body = await response.json();
    if (!response.ok) {
        const errorEnvelope = body;
        throw new ApiRequestError(response.status, errorEnvelope.error?.message ?? `HTTP ${response.status}`);
    }
    return body;
}
