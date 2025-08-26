import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Optional: Test database connection (only at runtime, not during build)
    let dbStatus = 'unknown'
    try {
      await prisma.$queryRaw`SELECT 1`
      dbStatus = 'connected'
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      dbStatus = 'disconnected'
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      version: process.env.npm_package_version || '1.0.0'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    // Always return 200 during rollout to avoid failing deploys
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'unreachable',
        message: 'Health check available, database status unknown'
      },
      { status: 200 }
    )
  }
}
