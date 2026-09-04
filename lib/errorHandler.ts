import { NextResponse } from 'next/server'
import { AppError } from './errors'
import { MongooseError } from 'mongoose'

export interface ErrorResponse {
  error: string
  code?: string
  details?: unknown
  timestamp: string
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error)

  const timestamp = new Date().toISOString()

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof MongooseError) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.message,
          timestamp,
        },
        { status: 400 }
      )
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          error: 'Invalid ID format',
          code: 'INVALID_ID',
          timestamp,
        },
        { status: 400 }
      )
    }

    if ('code' in error && error.code === 11000) {
      return NextResponse.json(
        {
          error: 'Duplicate entry',
          code: 'DUPLICATE_ERROR',
          details: error.message,
          timestamp,
        },
        { status: 409 }
      )
    }
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: 'Invalid JSON',
        code: 'INVALID_JSON',
        timestamp,
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp,
    },
    { status: 500 }
  )
}