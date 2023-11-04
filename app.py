from flask import Flask, render_template, request, send_from_directory, jsonify
import PyPDF2
import os
from pdf2docx import Converter

app = Flask(__name__, static_url_path='', static_folder='static')
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'files' not in request.files:
            return jsonify(error='No files uploaded'), 400
        
        operation = request.form['operation']
        output_files = []

        if operation == 'merge':
            merger = PyPDF2.PdfFileMerger()
            for file in request.files.getlist('files'):
                file.save(os.path.join(UPLOAD_FOLDER, file.filename))
                merger.append(os.path.join(UPLOAD_FOLDER, file.filename))
            
            output_filename = "merged.pdf"
            merger.write(os.path.join(UPLOAD_FOLDER, output_filename))
            merger.close()
            output_files.append(output_filename)

        elif operation == 'split':
            file = request.files['files']
            file.save(os.path.join(UPLOAD_FOLDER, file.filename))
            reader = PyPDF2.PdfFileReader(os.path.join(UPLOAD_FOLDER, file.filename))
            pages_per_split = int(request.form.get('pages_per_split', 1))
            total_pages = reader.numPages
            for i in range(0, total_pages, pages_per_split):
                writer = PyPDF2.PdfFileWriter()
                for j in range(i, i + pages_per_split):
                    if j < total_pages:
                        writer.addPage(reader.getPage(j))
                output_filename = f"split_{i//pages_per_split + 1}.pdf"
                with open(os.path.join(UPLOAD_FOLDER, output_filename), 'wb') as output_file:
                    writer.write(output_file)
                output_files.append(output_filename)

        elif operation == 'convert':
            file = request.files['files']
            file.save(os.path.join(UPLOAD_FOLDER, file.filename))
            output_filename = "converted.docx"
            cv = Converter(os.path.join(UPLOAD_FOLDER, file.filename))
            cv.convert(os.path.join(UPLOAD_FOLDER, output_filename), start=0, end=None)
            cv.close()
            output_files.append(output_filename)

        return jsonify(files=output_files)

    return render_template('index.html')

@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)


