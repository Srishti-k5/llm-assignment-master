# AI Chatbot with File Upload Integration

## Introduction

This project implements an AI chatbot integrated with file upload functionality using React for the front-end and FastAPI for the back-end. The chatbot leverages OpenAI's GPT-3.5 model to provide conversational responses to user queries. Users can upload files in various formats, including .txt, .docx, .pdf, and .csv, which are then processed along with user queries to generate responses from the chatbot.

## Features

- *AI Chatbot Interaction*: Users can interact with an AI chatbot by asking questions and receiving responses.
- *File Upload*: Users can upload files in supported formats (.txt, .docx, .pdf, .csv) for processing alongside their queries.
- *File Type Validation*: The application validates uploaded files to ensure they are in supported formats and do not exceed size limits.
- *Real-time Feedback*: Users receive real-time feedback on successful file uploads.

## Notes

- Ensure that you have an OpenAI API key to utilize the GPT-3.5 model.
- This project is a demonstration of integrating front-end and back-end technologies for AI-based chatbot development.
- File upload functionality is limited to files under 100MB in size.

## Components

The project consists of the following main components:

- *Front-end (React)*:
  - App component: Main component handling user interaction and file uploads.
  - Form component: Responsible for rendering the form for user input and file upload.
  - Popup component: Displays real-time feedback on successful file uploads.
  - Message components: Display user and system messages in the chat interface.

- *Back-end (FastAPI)*:
  - Main module: Handles the API routes and file processing logic.
  - OpenAI client: Integrates with the OpenAI API for generating chatbot responses.
  - File processing logic: Parses uploaded files to extract text content for chatbot input.

## Packages Used

- *Front-end (React)*:
  - React: JavaScript library for building user interfaces.
  - TypeScript: Superset of JavaScript that adds static typing.
  - CSS: Styling the components.
  
- *Back-end (FastAPI)*:
  - FastAPI: Web framework for building APIs with Python.
  - OpenAI: Python client library for accessing the OpenAI API.
  - Pydantic: Data validation and settings management library.
  - PyPDF2: Library for reading and extracting text from PDF files.
  - python-docx: Library for reading and writing .docx files.
  - csv: Library for parsing CSV files.

## Uses

This project can be used for:

- Implementing AI-powered chatbots with file upload capabilities.
- Demonstrating integration of front-end and back-end technologies.
- Experimenting with conversational AI models like OpenAI's GPT-3.5.

## Conclusion

The AI Chatbot with File Upload Integration project provides a robust framework for building interactive chatbots capable of processing user queries alongside uploaded files. By leveraging React and FastAPI, developers can create dynamic web applications that harness the power of AI for enhanced user experiences.