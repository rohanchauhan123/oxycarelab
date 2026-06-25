import Dexie from 'dexie';

export const db = new Dexie('OxyCareLabsDB');

// Define database schema
db.version(2).stores({
    packages: '++id, name, category, status, isAddon',
    users: '++id, email, phone, role, status',
    bookings: '++id, userId, user, status, date',
    labs: '++id, name, location, status',
    tests: '++id, name, category, status',
    categories: '++id, name, filter, status',
    members: '++id, userId, name',
    addresses: '++id, userId, city',
    callbacks: '++id, status, createdAt',
    partnerships: '++id, status, createdAt',
    jobs: '++id, status, createdAt',
    blogs: '++id, title, category, date',
    offers: '++id, code, status',
    slots: '++id',
    cities: '++id, name, state'
});

export default db;
