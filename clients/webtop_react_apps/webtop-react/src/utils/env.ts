export function isProd(): boolean {
    const environment = process.env.NODE_ENV
    // console.log('environment', environment)
    return environment === 'production'
}