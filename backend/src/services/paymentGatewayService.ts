import crypto from 'crypto';
import env from '../config/env';

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  signature: string;
}

export interface IPaymentGatewayService {
  createOrder(options: { amount: number; currency?: string; receipt?: string }): Promise<PaymentOrderResult>;
  verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean>;
}

export class RazorpayPaymentGatewayService implements IPaymentGatewayService {
  private secret: string;

  constructor() {
    this.secret = env.PAYMENT_GATEWAY_SECRET || env.JWT_ACCESS_SECRET;
  }

  async createOrder(options: { amount: number; currency?: string; receipt?: string }): Promise<PaymentOrderResult> {
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 90000 + 10000)}`;
    const currency = options.currency || 'INR';

    // Generate cryptographic order signature
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${orderId}|${options.amount}|${currency}`)
      .digest('hex');

    return {
      orderId,
      amount: options.amount,
      currency,
      signature,
    };
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    if (!orderId || !paymentId || !signature) {
      return false;
    }

    try {
      // Standard Razorpay verification: HMAC_SHA256(orderId + "|" + paymentId, secret) === signature
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (signature.length !== expectedSignature.length) {
        return false;
      }

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch (err) {
      return false;
    }
  }

  verifyWebhookSignature(payload: string | Record<string, any>, signature: string): boolean {
    if (!signature) {
      return false;
    }

    try {
      const bodyStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(bodyStr)
        .digest('hex');

      if (signature.length !== expectedSignature.length) {
        return false;
      }

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch (err) {
      return false;
    }
  }
}

export const paymentGatewayService = new RazorpayPaymentGatewayService();
export default paymentGatewayService;
