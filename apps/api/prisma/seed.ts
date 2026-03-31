import { CreateBucketCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const minio = new S3Client({
  endpoint: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT ?? 'localhost'}:${process.env.MINIO_PORT ?? '9000'}`,
  forcePathStyle: true,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
  },
});

async function ensureBucket(bucket: string) {
  try {
    await minio.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await minio.send(new CreateBucketCommand({ Bucket: bucket }));
  }
}

async function ensureUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isSuperAdmin?: boolean;
}) {
  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash,
      isSuperAdmin: input.isSuperAdmin ?? false,
    },
    create: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash,
      isSuperAdmin: input.isSuperAdmin ?? false,
    },
  });
}

async function ensureTenant(name: string, slug: string) {
  await ensureBucket(`tenant-${slug}`);
  return prisma.tenant.upsert({
    where: { slug },
    update: { name, bucket: `tenant-${slug}` },
    create: {
      name,
      slug,
      bucket: `tenant-${slug}`,
    },
  });
}

async function main() {
  const admin = await ensureUser({
    email: 'admin@ged.local',
    password: 'admin123',
    firstName: 'Super',
    lastName: 'Admin',
    isSuperAdmin: true,
  });

  const acme = await ensureTenant('Acme Corp', 'acme-corp');
  const globex = await ensureTenant('Globex Inc', 'globex-inc');

  const acmeAdmin = await ensureUser({
    email: 'alice@acme.local',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Admin',
  });

  const acmeEditor = await ensureUser({
    email: 'edward@acme.local',
    password: 'password123',
    firstName: 'Edward',
    lastName: 'Editor',
  });

  const globexAdmin = await ensureUser({
    email: 'gina@globex.local',
    password: 'password123',
    firstName: 'Gina',
    lastName: 'Globex',
  });

  const globexViewer = await ensureUser({
    email: 'victor@globex.local',
    password: 'password123',
    firstName: 'Victor',
    lastName: 'Viewer',
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: acme.id,
        userId: acmeAdmin.id,
      },
    },
    update: { role: Role.ADMIN },
    create: { tenantId: acme.id, userId: acmeAdmin.id, role: Role.ADMIN },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: acme.id,
        userId: acmeEditor.id,
      },
    },
    update: { role: Role.EDITOR },
    create: { tenantId: acme.id, userId: acmeEditor.id, role: Role.EDITOR },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: globex.id,
        userId: globexAdmin.id,
      },
    },
    update: { role: Role.ADMIN },
    create: { tenantId: globex.id, userId: globexAdmin.id, role: Role.ADMIN },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: globex.id,
        userId: globexViewer.id,
      },
    },
    update: { role: Role.VIEWER },
    create: { tenantId: globex.id, userId: globexViewer.id, role: Role.VIEWER },
  });

  const seedFolders = [
    { tenantId: acme.id, name: 'Invoices', path: '/Invoices' },
    { tenantId: acme.id, name: 'Contracts', path: '/Contracts' },
    { tenantId: globex.id, name: 'Payroll', path: '/Payroll' },
    { tenantId: globex.id, name: 'HR', path: '/HR' },
  ];

  for (const folder of seedFolders) {
    await prisma.folder.upsert({
      where: { tenantId_path: { tenantId: folder.tenantId, path: folder.path } },
      update: { name: folder.name },
      create: folder,
    });
  }

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: acme.id,
        userId: admin.id,
      },
    },
    update: { role: Role.ADMIN },
    create: { tenantId: acme.id, userId: admin.id, role: Role.ADMIN },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: {
        tenantId: globex.id,
        userId: admin.id,
      },
    },
    update: { role: Role.ADMIN },
    create: { tenantId: globex.id, userId: admin.id, role: Role.ADMIN },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });