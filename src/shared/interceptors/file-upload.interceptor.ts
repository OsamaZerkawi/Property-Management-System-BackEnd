import { UseInterceptors,BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export function PropertyImagesInterceptor() {
  return UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './uploads/properties/images',
        filename: (req, file, cb) => {
        const propertyId = req.params.propertyId;
        const timestamp = Date.now();
        const ext = extname(file.originalname);
        const safeBaseName = file.originalname
          .replace(/\s+/g, '-')        // replace spaces with dashes
          .replace(/\.[^/.]+$/, '')    // remove original extension
          .replace(/[^a-zA-Z0-9-_]/g, ''); // remove unsafe characters

        const filename = `property-${propertyId}-${safeBaseName}-${timestamp}${ext}`;
        cb(null, filename);
      },
      }),
    }),
  );
}

export function PropertyPostImageInterceptor(){
  return UseInterceptors(FileInterceptor('postImage', {
      storage: diskStorage({
        destination: './uploads/properties/posts/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
}

export function PropertyImageInterceptor() {
  return UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/properties/images',
        filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = extname(file.originalname);
        const safeBaseName = file.originalname
          .replace(/\s+/g, '-')        // replace spaces with dashes
          .replace(/\.[^/.]+$/, '')    // remove original extension
          .replace(/[^a-zA-Z0-9-_]/g, ''); // remove unsafe characters

        const filename = `property-image-${safeBaseName}-${timestamp}${ext}`;
        cb(null, filename);
      },
      }),
    }),
  );
}


export function UserPropertyInvoiceImageInterceptor() {
  return UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/properties/users/invoices/images',
        filename: (req, file, cb) => {
        const propertyId = req.body.propertyId;
        const timestamp = Date.now();
        const ext = extname(file.originalname);
        const safeBaseName = file.originalname
          .replace(/\s+/g, '-')        // replace spaces with dashes
          .replace(/\.[^/.]+$/, '')    // remove original extension
          .replace(/[^a-zA-Z0-9-_]/g, ''); // remove unsafe characters

        const filename = `property-invoice-${propertyId}-${safeBaseName}-${timestamp}${ext}`;
        cb(null, filename);
      },
      }),
    }),
  );
}

export function OfficeLogoInterceptor() {
  return UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './uploads/offices/logos';
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (req: any, file, cb) => {
          const userId = (req.user as any)?.sub || 'unknown';
          const timestamp = Date.now();
          const safeName = file.originalname
            .replace(/\s+/g, '-')
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9-_]/g, '');
          const ext = extname(file.originalname);
          cb(null, `office-logo-${userId}-${safeName}-${timestamp}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('Only images are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },  
    }),
  );
}

export function UserProfileImageInterceptor() {
  return UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({ 
        destination: (req, file, cb) => {
          const dir = './uploads/profile';
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        }, 
        filename: (req: any, file, cb) => {
          const userId = (req.user as any)?.sub || 'unknown';
          const timestamp = Date.now();
          const baseName = file.originalname
            .replace(/\s+/g, '-')
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9-_]/g, '');
          const ext = extname(file.originalname);
          cb(null, `user-${userId}-profile-${baseName}-${timestamp}${ext}`);
        },
      }), 
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('فقط الصور مسموح بها'), false);
        }
        cb(null, true);
      }, 
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  );
}


export function AdvertisementImageInterceptor() {
  return UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/advertisements/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `advertisement-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  );
}

export function UserInvoiceImageInterceptor() {
  return UseInterceptors(
    FileInterceptor('documentImage', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './uploads/UserRentalInvoices';
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (req: any, file, cb) => {
          const userId = (req.user as any)?.sub || 'unknown';
          const timestamp = Date.now();
          const baseName = file.originalname
            .replace(/\s+/g, '-')
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9-_]/g, '');
          const ext = extname(file.originalname);
          cb(null, `user-${userId}-invoice-${baseName}-${timestamp}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException('فقط صور أو ملفات PDF مسموح بها كفاتورة'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    }),
  );
}