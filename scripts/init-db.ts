#!/usr/bin/env tsx
/**
 * Database initialization script
 * Run with: npx tsx scripts/init-db.ts
 * 
 * This script creates all tables and inserts default data.
 * Requires POSTGRES_URL or DATABASE_URL environment variable.
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🔧 Initializing VaakSuraksha database...');
  
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ POSTGRES_URL or DATABASE_URL environment variable not set');
    console.log('   Please set your PostgreSQL connection string:');
    console.log('   export POSTGRES_URL="postgresql://user:pass@host:port/db"');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 5, idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000 });

  try {
    // Read schema SQL
    const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log(`  ✓ Statement ${i + 1}/${statements.length}`);
        } catch (err: unknown) {
          const error = err as Error;
          // Ignore "already exists" errors
          if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
            console.log(`  ⊘ Statement ${i + 1}/${statements.length} (already exists)`);
          } else {
            console.error(`  ✗ Statement ${i + 1}/${statements.length} failed:`, error.message);
            console.error('  SQL:', statement.substring(0, 100) + '...');
          }
        }
      }
    }

    console.log('\n✅ Database initialization complete!');
    
    // Verify tables
    const tables = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    console.log('\n📊 Created tables:');
    tables.rows.forEach(row => console.log(`  - ${row.tablename}`));

  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();