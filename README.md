# Style Guide Generator

A web application for generating, storing, and managing writing style guides using AI.

## Features

- Generate detailed style profiles using AI
- Store and manage multiple writing styles
- Copy styles to use as prompt prefixes
- Edit and refine style profiles
- Simple and intuitive interface

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your database configuration
4. Run the development server:
   ```bash
   npm run dev
   ```

## How to Use

### 1. Generate a Style Profile
- Click the "Copy Style Detection Prompt" button in the top right
- Paste it into your favorite LLM (Claude 3.7 Sonnet or o3 work particularly well)
- Attach or paste as many long-form transcripts as possible to give good coverage of the style you want to mimic
- Run the prompt and copy the generated style profile

### 2. Save the Style
- Paste the generated style profile into the "Description" field
- Give it a descriptive name
- Click "Add Style" to save it

### 3. Use Your Style
- Click "Copy" on any saved style to copy its description
- Paste it into your LLM prompt to guide its writing style
- Use "Edit" to refine the style profile as needed

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- SQLite

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
