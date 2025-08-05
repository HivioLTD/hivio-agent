from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Привет! ИИ-агент hivio работает!"

@app.route("/nasdaqcm")
def nasdaqcm():
    return "Тут будет список компаний с биржи NasdaqCM"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
