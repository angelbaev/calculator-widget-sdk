// src/infra/service/cart.service.ts

export interface CartItem {
    id: string;
    productData: Record<string, any>;
    customerData?: {
        name: string;
        phone: string;
        email: string;
        fileName?: string;
    };
    url?: string;
}

export default class CartService {
    private static readonly STORAGE_KEY = 'calculator_cart';

    static getCart(): CartItem[] {
        const data = localStorage.getItem(CartService.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static addToCart(item: CartItem): void {
        const cart = CartService.getCart();
        cart.push(item);
        localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(cart));
    }

    static removeFromCart(id: string): void {
        let cart = CartService.getCart();
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(cart));
    }

    static clearCart(): void {
        localStorage.removeItem(CartService.STORAGE_KEY);
    }
}
