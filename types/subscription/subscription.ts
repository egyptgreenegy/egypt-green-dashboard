export interface ISubscription {
    id: number
    name: string
    description: string
    price: string
    productLimit: number
    voucherLimit: string
    duration: number
}

export interface ISubscriptionClient {
    id:number
}