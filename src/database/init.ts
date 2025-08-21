import { databaseManager } from './DatabaseManager';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Maak default user aan
    const user = await databaseManager.getUser('bouke@boukevdberg.com');
    if (!user) {
      await databaseManager.createUser('bouke@boukevdberg.com', 'Bouke van den Berg', 'admin');
      console.log('✅ Default user created');
    }
    
    // Controleer of er brands zijn
    const brands = await databaseManager.getBrands();
    if (brands.length === 0) {
      await databaseManager.createBrand('TOV Agency', 'Digital marketing agency');
      await databaseManager.createBrand('Test Brand', 'Test brand for development');
      console.log('✅ Default brands created');
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}
