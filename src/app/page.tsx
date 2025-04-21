import { Toaster } from 'react-hot-toast'
import StyleGuideApp from '@/components/StyleGuideApp'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Style Guide Generator</h1>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <span className="font-medium">Generate a Style Profile:</span>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Click the "Copy Style Detection Prompt" button in the top right</li>
                <li>Paste it into your favorite LLM (Claude 3.7 Sonnet or o3 work well)</li>
                <li>Attach or paste as many long-form transcripts as possible to give good coverage of the style you want to mimic</li>
                <li>Run the prompt and copy the generated style profile</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Save the Style:</span>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Paste the generated style profile into the "Description" field</li>
                <li>Give it a descriptive name</li>
                <li>Click "Add Style" to save it</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Use Your Style:</span>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Click "Copy" on any saved style to copy its description</li>
                <li>Paste it into your LLM prompt to guide its writing style</li>
                <li>Use "Edit" to refine the style profile as needed</li>
              </ul>
            </li>
          </ol>
        </div>

        <StyleGuideApp />
      </div>
      <Toaster />
    </main>
  )
}
