export function validateAuthCredentials(config) {
    if (typeof config !== 'object') return;
    if (!config.projectId) throw new Error('Please provide valid project ID');
    if (!config.masterKey && !config.readKey) throw new Error('Please provide valid API key');
    return true;
}