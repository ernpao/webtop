export async function delayMs(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export async function delaySeconds(seconds: number) {
    await delayMs(seconds * 1000)
}
