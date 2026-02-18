const supabase = require('../config/supabase');

/**
 * SQL to create the registrations table
 */
const createRegistrationsTableSQL = `
CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    registration_id UUID UNIQUE NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    team_leader_name VARCHAR(100) NOT NULL,
    team_leader_email VARCHAR(255) NOT NULL,
    team_leader_phone VARCHAR(15) NOT NULL,
    team_members JSONB NOT NULL DEFAULT '[]',
    num_microphones INTEGER NOT NULL DEFAULT 1,
    drum_setup TEXT NOT NULL,
    additional_requirements TEXT,
    registration_fee INTEGER NOT NULL DEFAULT 1200,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(100),
    registration_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

/**
 * Check if a table exists in the database
 */
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    // If no error, table exists
    if (!error) {
      return true;
    }
    
    // Check if error is because table doesn't exist
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      return false;
    }
    
    // For other errors, assume table exists but there's a different issue
    console.warn(`Warning checking table ${tableName}:`, error.message);
    return true;
  } catch (err) {
    console.error(`Error checking table ${tableName}:`, err);
    return false;
  }
}

/**
 * Create tables using Supabase's RPC if available, or log SQL for manual execution
 */
async function createTables() {
  console.log('🔧 Checking database tables...\n');

  const tables = [
    {
      name: 'registrations',
      description: 'Stores team registration data for Battle of Bands',
      routes: [
        'POST /api/registrations/register - Create new registration',
        'GET /api/registrations - Get all registrations',
        'GET /api/registrations/:id - Get registration by ID',
        'PUT /api/registrations/:id - Update registration',
        'PATCH /api/registrations/:id/payment - Update payment status',
        'DELETE /api/registrations/:id - Delete registration'
      ]
    }
  ];

  for (const table of tables) {
    const exists = await tableExists(table.name);
    
    if (exists) {
      console.log(`✅ Table '${table.name}' exists`);
      console.log(`   📋 ${table.description}`);
      console.log(`   🔗 Routes using this table:`);
      table.routes.forEach(route => console.log(`      - ${route}`));
    } else {
      console.log(`❌ Table '${table.name}' does not exist`);
      console.log(`   📋 ${table.description}`);
      console.log(`   🔗 Routes that need this table:`);
      table.routes.forEach(route => console.log(`      - ${route}`));
      console.log('\n   ⚠️  Please create this table manually in Supabase SQL Editor.');
      console.log('   📝 Run the SQL from: backend/database/schema.sql\n');
    }
    console.log('');
  }
}

/**
 * Verify database connection
 */
async function verifyConnection() {
  try {
    // Try a simple query to verify connection
    const { error } = await supabase.from('registrations').select('count').limit(1);
    
    // Table doesn't exist - but connection works
    if (error && (error.code === '42P01' || error.message.includes('does not exist') || error.message.includes('schema cache'))) {
      console.log('⚠️  Connected to Supabase but table "registrations" not yet created\n');
      console.log('📝 To create the table, run the SQL from: backend/database/schema.sql');
      console.log('   in your Supabase Dashboard → SQL Editor\n');
      return true;
    }
    
    if (error) {
      console.error('❌ Database connection error:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully\n');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to Supabase:', err.message);
    return false;
  }
}

/**
 * Initialize database - main function
 */
async function initializeDatabase() {
  console.log('\n========================================');
  console.log('🎶 AAROHA 2026 - SARGAM Database Setup');
  console.log('========================================\n');

  // Verify connection first
  const connected = await verifyConnection();
  
  if (!connected) {
    console.log('\n❌ Please check your Supabase credentials in .env file');
    console.log('   Required variables:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY\n');
    return false;
  }

  // Check and report on tables
  await createTables();

  console.log('========================================');
  console.log('📊 Database Schema Summary');
  console.log('========================================\n');
  console.log('Table: registrations');
  console.log('Columns:');
  console.log('  - id (BIGSERIAL) - Auto-increment primary key');
  console.log('  - registration_id (UUID) - Unique registration identifier');
  console.log('  - team_name (VARCHAR) - Name of the band/team');
  console.log('  - college_name (VARCHAR) - College/institution name');
  console.log('  - team_leader_name (VARCHAR) - Team leader full name');
  console.log('  - team_leader_email (VARCHAR) - Contact email');
  console.log('  - team_leader_phone (VARCHAR) - Contact phone');
  console.log('  - team_members (JSONB) - Array of team members');
  console.log('  - num_microphones (INTEGER) - Required microphones');
  console.log('  - drum_setup (TEXT) - Drum setup requirements');
  console.log('  - additional_requirements (TEXT) - Other tech needs');
  console.log('  - registration_fee (INTEGER) - Fee amount (₹1200)');
  console.log('  - payment_status (VARCHAR) - pending/completed/failed/refunded');
  console.log('  - transaction_id (VARCHAR) - Payment transaction ID');
  console.log('  - registration_status (VARCHAR) - pending/confirmed/rejected');
  console.log('  - created_at (TIMESTAMP) - Registration timestamp');
  console.log('  - updated_at (TIMESTAMP) - Last update timestamp');
  console.log('\n========================================\n');

  return true;
}

// Export for use in server.js
module.exports = { initializeDatabase, tableExists, verifyConnection };

// Run if called directly
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  initializeDatabase()
    .then(success => {
      if (success) {
        console.log('✅ Database initialization check complete!\n');
      } else {
        console.log('❌ Database initialization failed. Please check the errors above.\n');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
