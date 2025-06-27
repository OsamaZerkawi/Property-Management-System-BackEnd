import { UseInterceptors,BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

export function OfficeLogoInterceptor() {
  return UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/offices/logos',
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