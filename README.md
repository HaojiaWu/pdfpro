# pdfpro
This is a simple webapp to merge, split pdf files and convert pdf to word documents. The app was built on Flask. It really highlights the versatility of Flask in creating solutions for daily tasks. Here are the steps to create it:
1. I first created a Flask app (app.py) as a backend to handle the logic of merging, splitting pdf and converting pdf to Word documents. I used the libraries PyPDF2 for merging and splitting, and pdf2docx for converting pdf to docx.
2. Then I created a frontend html (index.html) that allows users to upload files, select the desired operation, and download the resulting file.
3. script.js is for handling the frontend logic, such as collecting file input, sending requests to the backend, and updating the UI.
4. styles.css is to make the webapp look a little bit more professional.

You can find a deployment of the webapp here: [pdfpro](https://pdfpro.haojia-wu.com).
