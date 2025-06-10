// // nest generate interceptor dot-to-nested
// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class DotToNestedInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
    
//     if (request.body) {
//       request.body = this.transform(request.body);
//     }
    
//     return next.handle();
//   }

//   private transform(body: any): any {
//     const result = {};
    
//     for (const key in body) {
//       if (key.includes('.')) {
//         const [parent, child] = key.split('.');
//         result[parent] = result[parent] || {};
//         result[parent][child] = body[key];
//       } else {
//         result[key] = body[key];
//       }
//     }
    
//     return result;
//   }
// }