from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # Make sure index.html is in the templates folder

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

