# from dotenv import load_dotenv
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Any

# # Load environment variables from .env file (if any)
# load_dotenv()

# class Response(BaseModel):
#     result: str | None

# origins = [
#     "http://localhost",
#     "http://localhost:8080",
#     "http://localhost:3000"
# ]

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.post("/predict", response_model = Response)
# def predict() -> Any:
  
#   #implement this code block
  
#   return {"result": "hello world!"}

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from dotenv import load_dotenv
from openai import Client
import os
import io
import csv
import PyPDF2
from docx import Document

# Load environment variables from .env file (if any)
load_dotenv()

# Access the API key from the environment variable
api_key = os.getenv("OPENAI_API_KEY")

# Define the FastAPI app
app = FastAPI()

# Define allowed origins for CORS
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class Response(BaseModel):
    result: str

# Define API endpoint
@app.post("/predict", response_model=Response)
async def predict(file: UploadFile = File(None), question: str = Form(...)) -> Any:
   
    try:
         # Initialize file content variables
        file_content_text = ""
        
        # Read and process file content based on file type
        if file is not None:
            # Process TXT file
            if file.content_type == "text/plain":
                file_content = await file.read()
                file_content_text = file_content.decode('utf-8')
            
            # Process DOCX file
            elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                file_content = await file.read()
                doc = Document(io.BytesIO(file_content))
                for paragraph in doc.paragraphs:
                    file_content_text += paragraph.text + '\n'
            
            elif file.content_type == "application/pdf":
                file_content = await file.read()
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                num_pages = len(pdf_reader.pages)
                for page_num in range(num_pages):
                    page = pdf_reader.pages[page_num]
                    file_content_text += page.extract_text() + '\n'

            
            # Process CSV file
            elif file.content_type == "text/csv":
                file_content = await file.read()
                file_content_text = file_content.decode('utf-8')
                csv_reader = csv.reader(io.StringIO(file_content_text))
                for row in csv_reader:
                    file_content_text += ', '.join(row) + '\n'
            

        # Call OpenAI API to get the response
        prompt = f"File Content: {file_content_text}\nQuestion: {question}"
        messages = [{"role": "user", "content": prompt}]

        
        # Create OpenAI client with API key
        client = Client(api_key=api_key)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=messages,
            stream=False,
            max_tokens=1000,
        )
        print("result:", response)
        result = response.choices[0].message.content

        return {"result": result}
    except Exception as e:
        return {"result": f"Error: {str(e)}"}



