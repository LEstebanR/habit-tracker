'use server'

export async function registerAction(formData: FormData): Promise<void> {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('user', { name, email, password})
}

export async function loginAction(formData: FormData): Promise<void> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('user', { email, password})
}