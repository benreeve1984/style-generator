'use client'

import { useState, useEffect } from 'react'

interface Style {
  id: number
  name: string
  description: string
}

const STYLE_DETECTION_PROMPT = `You are a forensic literary analyst and style coach.

## TASK
1. Read the delimited writing samples.
2. Infer the author's distinctive **voice, tone, cadence, rhetorical habits, recurring themes, and structural patterns**.
3. Output a **Style Profile** containing:
   A. **One‑paragraph summary** of the overall voice (50–80 words).  
   B. **Guiding principles** (5–7 bullet points) in "Do / Avoid" form, each focused on a specific stylistic trait.  
   C. **Signature devices** – 3–5 short example phrases *you create* that exemplify the style (do **NOT** copy from the samples; invent fresh lines).  
   D. **Mini demo** – rewrite the neutral sentence  
      "The committee postponed the decision."  
      in ≤ 40 words using the identified style.

## RULES
- Do *not* expose or quote the original samples.
- Keep the profile self‑contained so it can be reused as a prompt prefix.
- If uncertainty arises, prefer probabilistic language ("often uses…", "tends to…") rather than hedging.
- Limit total length to ≈ 250 tokens.

## INPUT SAMPLES
<<BEGIN SAMPLES>>
{{PASTE_OR_STREAM_TRANSCRIPTS_HERE}}
<<END SAMPLES>>

## OUTPUT FORMAT

Style Profile – {{OPTIONAL_LABEL}}

Summary


Guiding Principles
	•	Do: …
	•	Avoid: …
(repeat 5–7 items)

Signature Devices (created examples)
	1.	…
	2.	…
	3.	…

Mini Demo`

export default function StyleGuideApp() {
  const [styles, setStyles] = useState<Style[]>([])
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editingStyle, setEditingStyle] = useState<Style | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStyles()
  }, [])

  const loadStyles = async () => {
    try {
      const response = await fetch('/api/styles')
      if (!response.ok) throw new Error('Failed to load styles')
      const data = await response.json()
      setStyles(data)
    } catch {
      setError('Failed to load styles')
    }
  }

  const handleAddStyle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, description: newDescription })
      })
      if (!response.ok) throw new Error('Failed to add style')
      setNewName('')
      setNewDescription('')
      loadStyles()
    } catch {
      setError('Failed to add style')
    }
  }

  const handleEditStyle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStyle) return
    try {
      const response = await fetch('/api/styles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingStyle.id,
          name: newName, 
          description: newDescription 
        })
      })
      if (!response.ok) throw new Error('Failed to update style')
      setNewName('')
      setNewDescription('')
      setEditingStyle(null)
      loadStyles()
    } catch {
      setError('Failed to update style')
    }
  }

  const handleDeleteStyle = async (id: number) => {
    try {
      const response = await fetch(`/api/styles?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete style')
      loadStyles()
    } catch {
      setError('Failed to delete style')
    }
  }

  const handleEditClick = (style: Style) => {
    setEditingStyle(style)
    setNewName(style.name)
    setNewDescription(style.description)
  }

  const handleCancelEdit = () => {
    setEditingStyle(null)
    setNewName('')
    setNewDescription('')
  }

  const handleCopyStyle = (description: string) => {
    navigator.clipboard.writeText(description)
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(STYLE_DETECTION_PROMPT)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCopyPrompt}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Copy Style Detection Prompt
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingStyle ? 'Edit Style' : 'Add New Style'}
        </h2>
        <form onSubmit={editingStyle ? handleEditStyle : handleAddStyle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingStyle ? 'Update Style' : 'Add Style'}
            </button>
            {editingStyle && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Saved Styles</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          {styles.map((style) => (
            <div key={style.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{style.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopyStyle(style.description)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleEditClick(style)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStyle(style.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingStyle?.id === style.id && (
                <p className="text-gray-600 mt-2">{style.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 