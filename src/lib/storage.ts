import fs from 'fs'
import path from 'path'

const STORAGE_PATH = path.join(process.cwd(), 'data', 'styles.json')

interface Style {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(STORAGE_PATH))) {
  fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true })
}

// Initialize the storage file if it doesn't exist
if (!fs.existsSync(STORAGE_PATH)) {
  fs.writeFileSync(STORAGE_PATH, JSON.stringify([]))
}

export async function getStyles(): Promise<Style[]> {
  try {
    const data = fs.readFileSync(STORAGE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading styles:', error)
    return []
  }
}

export async function addStyle(name: string, description: string): Promise<Style> {
  try {
    const styles = await getStyles()
    const newStyle: Style = {
      id: styles.length > 0 ? Math.max(...styles.map(s => s.id)) + 1 : 1,
      name,
      description: `<response-style>${description}</response-style>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    styles.push(newStyle)
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(styles, null, 2))
    return newStyle
  } catch (error) {
    console.error('Error adding style:', error)
    throw error
  }
}

export async function updateStyle(id: number, name: string, description: string): Promise<Style> {
  try {
    const styles = await getStyles()
    const index = styles.findIndex(style => style.id === id)
    
    if (index === -1) {
      throw new Error('Style not found')
    }

    const updatedStyle: Style = {
      ...styles[index],
      name,
      description: `<response-style>${description}</response-style>`,
      updatedAt: new Date().toISOString(),
    }

    styles[index] = updatedStyle
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(styles, null, 2))
    return updatedStyle
  } catch (error) {
    console.error('Error updating style:', error)
    throw error
  }
}

export async function deleteStyle(id: number): Promise<void> {
  try {
    const styles = await getStyles()
    const filteredStyles = styles.filter(style => style.id !== id)
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(filteredStyles, null, 2))
  } catch (error) {
    console.error('Error deleting style:', error)
    throw error
  }
} 