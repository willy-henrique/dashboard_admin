import axios, { AxiosInstance } from 'axios';
import { config, isIntegrationConfigured } from '../config';
import { logger } from '../logger';
import { encrypt, decrypt } from '../encryption';

export interface PaymentCharge {
  id: string;
  amount: number;
  currency: string;
  description: string;
  dueDate: Date;
  customerId: string;
  customerName: string;
  customerDocument: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: 'pix' | 'boleto' | 'card';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'failed';
  pixCode?: string;
  pixQrCode?: string;
  boletoCode?: string;
  boletoUrl?: string;
  cardToken?: string;
  installments?: number;
  metadata?: Record<string, any>;
}

export interface PaymentWebhookPayload {
  event: string;
  chargeId: string;
  paymentId: string;
  status: string;
  amount: number;
  paidAt?: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface PaymentReconciliation {
  chargeId: string;
  paymentId: string;
  amount: number;
  paidAt: Date;
  method: string;
  status: string;
  metadata?: Record<string, any>;
}

export abstract class PaymentIntegration {
  protected client: AxiosInstance;
  protected config: any;
  protected isSandbox: boolean;

  constructor(paymentConfig: any) {
    this.config = paymentConfig;
    this.isSandbox = config.features.sandbox;

    this.client = axios.create({
      baseURL: paymentConfig.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Finance-System/1.0',
      },
    });

    // Interceptor para logs
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Payment API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          provider: this.constructor.name,
          url: config.url,
          method: config.method,
        });
        return config;
      },
      (error) => {
        logger.error('Payment API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Payment API Response: ${response.status}`, {
          provider: this.constructor.name,
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        logger.error('Payment API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Testa a conexão com o provedor de pagamentos
   */
  abstract testConnection(): Promise<boolean>;

  /**
   * Cria uma cobrança PIX
   */
  abstract createPixCharge(charge: PaymentCharge): Promise<{
    id: string;
    pixCode: string;
    qrCode: string;
    expiresAt: Date;
  }>;

  /**
   * Cria uma cobrança via boleto
   */
  abstract createBoletoCharge(charge: PaymentCharge): Promise<{
    id: string;
    boletoCode: string;
    boletoUrl: string;
    dueDate: Date;
  }>;

  /**
   * Processa pagamento com cartão
   */
  abstract processCardPayment(charge: PaymentCharge): Promise<{
    id: string;
    status: string;
    transactionId: string;
  }>;

  /**
   * Obtém status de uma cobrança
   */
  abstract getChargeStatus(chargeId: string): Promise<string>;

  /**
   * Cancela uma cobrança
   */
  abstract cancelCharge(chargeId: string): Promise<{
    id: string;
    status: string;
  }>;

  /**
   * Obtém conciliação de pagamentos
   */
  abstract getReconciliation(startDate: Date, endDate: Date): Promise<PaymentReconciliation[]>;

  /**
   * Valida webhook
   */
  abstract validateWebhook(payload: any, signature: string): Promise<boolean>;

  /**
   * Processa webhook
   */
  abstract processWebhook(payload: PaymentWebhookPayload): Promise<void>;
}

// Implementação para provedor genérico (sandbox)
export class GenericPaymentIntegration extends PaymentIntegration {
  constructor() {
    super({
      baseUrl: config.integrations.payments.baseUrl,
      apiKey: config.integrations.payments.apiKey,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error('Generic payment connection test failed:', error);
      return false;
    }
  }

  async createPixCharge(charge: PaymentCharge): Promise<{
    id: string;
    pixCode: string;
    qrCode: string;
    expiresAt: Date;
  }> {
    // Mock PIX charge
    const pixCode = `PIX${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const qrCode = `data:image/png;base64,${Buffer.from('mock-qr-code').toString('base64')}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    logger.info('Mock PIX charge created', {
      chargeId: charge.id,
      pixCode,
      amount: charge.amount,
      expiresAt,
    });

    return {
      id: charge.id,
      pixCode,
      qrCode,
      expiresAt,
    };
  }

  async createBoletoCharge(charge: PaymentCharge): Promise<{
    id: string;
    boletoCode: string;
    boletoUrl: string;
    dueDate: Date;
  }> {
    // Mock boleto charge
    const boletoCode = `34191.79001 01043.510047 91020.150008 4 84410026000`;
    const boletoUrl = `https://sandbox.payments.com/boleto/${charge.id}`;
    const dueDate = charge.dueDate;

    logger.info('Mock boleto charge created', {
      chargeId: charge.id,
      boletoCode,
      amount: charge.amount,
      dueDate,
    });

    return {
      id: charge.id,
      boletoCode,
      boletoUrl,
      dueDate,
    };
  }

  async processCardPayment(charge: PaymentCharge): Promise<{
    id: string;
    status: string;
    transactionId: string;
  }> {
    // Mock card payment
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const status = Math.random() > 0.1 ? 'approved' : 'failed'; // 90% sucesso

    logger.info('Mock card payment processed', {
      chargeId: charge.id,
      transactionId,
      status,
      amount: charge.amount,
    });

    return {
      id: charge.id,
      status,
      transactionId,
    };
  }

  async getChargeStatus(chargeId: string): Promise<string> {
    // Mock status
    const statuses = ['pending', 'paid', 'overdue', 'cancelled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  async cancelCharge(chargeId: string): Promise<{
    id: string;
    status: string;
  }> {
    logger.info('Mock charge cancelled', { chargeId });
    return {
      id: chargeId,
      status: 'cancelled',
    };
  }

  async getReconciliation(startDate: Date, endDate: Date): Promise<PaymentReconciliation[]> {
    // Mock reconciliation data
    const reconciliations: PaymentReconciliation[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(days, 10); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      if (Math.random() > 0.5) {
        reconciliations.push({
          chargeId: `charge_${Date.now()}_${i}`,
          paymentId: `payment_${Date.now()}_${i}`,
          amount: Math.random() * 1000,
          paidAt: date,
          method: Math.random() > 0.5 ? 'pix' : 'boleto',
          status: 'paid',
        });
      }
    }

    return reconciliations;
  }

  async validateWebhook(payload: any, signature: string): Promise<boolean> {
    // Mock validation
    return signature === 'valid_signature';
  }

  async processWebhook(payload: PaymentWebhookPayload): Promise<void> {
    logger.info('Processing payment webhook', {
      event: payload.event,
      chargeId: payload.chargeId,
      paymentId: payload.paymentId,
      status: payload.status,
    });
  }
}

// Implementação para provedor real (exemplo com Mercado Pago)
export class MercadoPagoIntegration extends PaymentIntegration {
  private accessToken?: string;

  constructor() {
    super({
      baseUrl: config.integrations.payments.baseUrl,
      clientId: config.integrations.payments.clientId,
      clientSecret: config.integrations.payments.clientSecret,
    });
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      const response = await this.client.post('/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      logger.error('Failed to get Mercado Pago access token:', error);
      throw new Error('Failed to authenticate with Mercado Pago');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status === 200;
    } catch (error) {
      logger.error('Mercado Pago connection test failed:', error);
      return false;
    }
  }

  async createPixCharge(charge: PaymentCharge): Promise<{
    id: string;
    pixCode: string;
    qrCode: string;
    expiresAt: Date;
  }> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.post('/v1/payments', {
        transaction_amount: charge.amount,
        description: charge.description,
        payment_method_id: 'pix',
        payer: {
          email: charge.customerEmail,
          first_name: charge.customerName.split(' ')[0],
          last_name: charge.customerName.split(' ').slice(1).join(' '),
        },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        id: response.data.id,
        pixCode: response.data.point_of_interaction.transaction_data.qr_code,
        qrCode: response.data.point_of_interaction.transaction_data.qr_code_base64,
        expiresAt: new Date(response.data.date_of_expiration),
      };
    } catch (error) {
      logger.error('Failed to create Mercado Pago PIX charge:', error);
      throw new Error('Failed to create PIX charge');
    }
  }

  async createBoletoCharge(charge: PaymentCharge): Promise<{
    id: string;
    boletoCode: string;
    boletoUrl: string;
    dueDate: Date;
  }> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.post('/v1/payments', {
        transaction_amount: charge.amount,
        description: charge.description,
        payment_method_id: 'bolbradesco',
        payer: {
          email: charge.customerEmail,
          first_name: charge.customerName.split(' ')[0],
          last_name: charge.customerName.split(' ').slice(1).join(' '),
        },
        date_of_expiration: charge.dueDate.toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        id: response.data.id,
        boletoCode: response.data.transaction_details.external_resource_url,
        boletoUrl: response.data.transaction_details.external_resource_url,
        dueDate: new Date(response.data.date_of_expiration),
      };
    } catch (error) {
      logger.error('Failed to create Mercado Pago boleto charge:', error);
      throw new Error('Failed to create boleto charge');
    }
  }

  async processCardPayment(charge: PaymentCharge): Promise<{
    id: string;
    status: string;
    transactionId: string;
  }> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.post('/v1/payments', {
        transaction_amount: charge.amount,
        description: charge.description,
        payment_method_id: 'master',
        token: charge.cardToken,
        installments: charge.installments || 1,
        payer: {
          email: charge.customerEmail,
          first_name: charge.customerName.split(' ')[0],
          last_name: charge.customerName.split(' ').slice(1).join(' '),
        },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        id: response.data.id,
        status: response.data.status,
        transactionId: response.data.id,
      };
    } catch (error) {
      logger.error('Failed to process Mercado Pago card payment:', error);
      throw new Error('Failed to process card payment');
    }
  }

  async getChargeStatus(chargeId: string): Promise<string> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.get(`/v1/payments/${chargeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.status;
    } catch (error) {
      logger.error('Failed to get Mercado Pago charge status:', error);
      throw new Error('Failed to get charge status');
    }
  }

  async cancelCharge(chargeId: string): Promise<{
    id: string;
    status: string;
  }> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.put(`/v1/payments/${chargeId}`, {
        status: 'cancelled',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        id: response.data.id,
        status: response.data.status,
      };
    } catch (error) {
      logger.error('Failed to cancel Mercado Pago charge:', error);
      throw new Error('Failed to cancel charge');
    }
  }

  async getReconciliation(startDate: Date, endDate: Date): Promise<PaymentReconciliation[]> {
    try {
      const token = await this.getAccessToken();
      const response = await this.client.get('/v1/payments/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          begin_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        },
      });

      return response.data.results.map((payment: any) => ({
        chargeId: payment.external_reference,
        paymentId: payment.id,
        amount: payment.transaction_amount,
        paidAt: new Date(payment.date_approved),
        method: payment.payment_method_id,
        status: payment.status,
      }));
    } catch (error) {
      logger.error('Failed to get Mercado Pago reconciliation:', error);
      throw new Error('Failed to get reconciliation');
    }
  }

  async validateWebhook(payload: any, signature: string): Promise<boolean> {
    // Implementar validação de assinatura do Mercado Pago
    const expectedSignature = this.generateWebhookSignature(payload);
    return signature === expectedSignature;
  }

  async processWebhook(payload: PaymentWebhookPayload): Promise<void> {
    logger.info('Processing Mercado Pago webhook', {
      event: payload.event,
      chargeId: payload.chargeId,
      paymentId: payload.paymentId,
      status: payload.status,
    });

    switch (payload.event) {
      case 'payment.created':
        await this.handlePaymentCreated(payload);
        break;
      case 'payment.updated':
        await this.handlePaymentUpdated(payload);
        break;
      case 'payment.approved':
        await this.handlePaymentApproved(payload);
        break;
      case 'payment.cancelled':
        await this.handlePaymentCancelled(payload);
        break;
      default:
        logger.warn('Unknown Mercado Pago webhook event', { event: payload.event });
    }
  }

  private async handlePaymentCreated(payload: PaymentWebhookPayload): Promise<void> {
    logger.info('Mercado Pago payment created', {
      paymentId: payload.paymentId,
      chargeId: payload.chargeId,
    });
  }

  private async handlePaymentUpdated(payload: PaymentWebhookPayload): Promise<void> {
    logger.info('Mercado Pago payment updated', {
      paymentId: payload.paymentId,
      chargeId: payload.chargeId,
      status: payload.status,
    });
  }

  private async handlePaymentApproved(payload: PaymentWebhookPayload): Promise<void> {
    logger.info('Mercado Pago payment approved', {
      paymentId: payload.paymentId,
      chargeId: payload.chargeId,
      amount: payload.amount,
      paidAt: payload.paidAt,
    });
  }

  private async handlePaymentCancelled(payload: PaymentWebhookPayload): Promise<void> {
    logger.info('Mercado Pago payment cancelled', {
      paymentId: payload.paymentId,
      chargeId: payload.chargeId,
    });
  }

  private generateWebhookSignature(payload: any): string {
    const data = JSON.stringify(payload);
    return require('crypto').createHmac('sha256', this.config.webhookSecret || '').update(data).digest('hex');
  }
}

// Factory para criar integração de pagamentos
export class PaymentIntegrationFactory {
  static create(): PaymentIntegration {
    if (!isIntegrationConfigured('payments')) {
      logger.warn('Payment integration not configured, using sandbox mode');
      return new GenericPaymentIntegration();
    }

    // Determinar provedor baseado na configuração
    if (this.config.baseUrl.includes('mercadopago')) {
      return new MercadoPagoIntegration();
    }

    return new GenericPaymentIntegration();
  }
}

// Instância singleton
export const paymentIntegration = PaymentIntegrationFactory.create();

