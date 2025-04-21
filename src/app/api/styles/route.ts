import { NextResponse } from 'next/server'
import { getStyles, addStyle, updateStyle, deleteStyle } from '@/lib/storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Validate input format
    if (typeof name !== 'string' || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Name and description must be strings' },
        { status: 400 }
      )
    }

    // Trim whitespace
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (trimmedName.length === 0 || trimmedDescription.length === 0) {
      return NextResponse.json(
        { error: 'Name and description cannot be empty' },
        { status: 400 }
      )
    }

    // Check for duplicate names
    const existingStyles = await getStyles()
    if (existingStyles.some(style => style.name === trimmedName)) {
      return NextResponse.json(
        { error: 'A style with this name already exists' },
        { status: 409 }
      )
    }

    const style = await addStyle(trimmedName, trimmedDescription)
    return NextResponse.json(style)
  } catch (error: unknown) {
    console.error('Failed to create style:', error)
    
    // Log the specific error for debugging
    if (error instanceof Error) {
      console.error('Detailed error:', error.message)
    }

    return NextResponse.json(
      { error: 'Failed to create style. Please try again.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description } = body

    if (!id || !name || !description) {
      return NextResponse.json(
        { error: 'ID, name, and description are required' },
        { status: 400 }
      )
    }

    // Validate input format
    if (typeof name !== 'string' || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Name and description must be strings' },
        { status: 400 }
      )
    }

    // Trim whitespace
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (trimmedName.length === 0 || trimmedDescription.length === 0) {
      return NextResponse.json(
        { error: 'Name and description cannot be empty' },
        { status: 400 }
      )
    }

    // Check for duplicate names (excluding the current style)
    const existingStyles = await getStyles()
    if (existingStyles.some(style => style.name === trimmedName && style.id !== id)) {
      return NextResponse.json(
        { error: 'A style with this name already exists' },
        { status: 409 }
      )
    }

    const style = await updateStyle(id, trimmedName, trimmedDescription)
    return NextResponse.json(style)
  } catch (error: unknown) {
    console.error('Failed to update style:', error)
    
    // Log the specific error for debugging
    if (error instanceof Error) {
      console.error('Detailed error:', error.message)
    }

    return NextResponse.json(
      { error: 'Failed to update style. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Style ID is required' },
        { status: 400 }
      )
    }

    await deleteStyle(Number(id))
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Failed to delete style:', error)
    
    // Log the specific error for debugging
    if (error instanceof Error) {
      console.error('Detailed error:', error.message)
    }

    return NextResponse.json(
      { error: 'Failed to delete style. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const styles = await getStyles()
    return NextResponse.json(styles)
  } catch (error: unknown) {
    console.error('Failed to fetch styles:', error)
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch styles. Please try again later.' },
      { status: 500 }
    )
  }
} 