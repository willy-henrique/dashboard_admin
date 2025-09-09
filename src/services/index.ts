// Serviços de integração
export { BankIntegration, BankIntegrationFactory } from '../lib/integrations/bank';
export { FiscalIntegration, FiscalIntegrationFactory } from '../lib/integrations/fiscal';
export { PaymentIntegration, PaymentIntegrationFactory } from '../lib/integrations/payments';

// Serviços de domínio financeiro
export { AccountService } from './AccountService';
export { InvoiceService } from './InvoiceService';
export { DashboardService } from './DashboardService';
export { CashFlowService } from './CashFlowService';
export { PayrollService } from './PayrollService';
export { ClosingService } from './ClosingService';
export { ReportService } from './ReportService';

// Utilitários
export { config } from '../lib/config';
export { logger } from '../lib/logger';
export { queue } from '../lib/queue';
export { EncryptionService } from '../lib/encryption';

// Tipos
export * from '../types/finance';



