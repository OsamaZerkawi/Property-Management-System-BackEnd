import { Global, Module } from '@nestjs/common';
import { InvoicePdfService } from 'src/application/services/invoice-pdf.service';
 
@Global()
@Module({
  providers: [InvoicePdfService],
  exports: [InvoicePdfService],
})
export class InvoicePdfModule {}
