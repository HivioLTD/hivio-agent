from flask import Flask
from openbb import obb

app = Flask(__name__)

@app.route("/")
def home():
    return "Привет! ИИ-агент hivio работает!"

@app.route("/nasdaqcm")
def get_companies():
    screener = obb.equity.screener
    # В OpenBB SDK параметры могут отличаться — уточню синтаксис при необходимости
    results = screener.screener(
        exchange="NASDAQCM",
        filters={"roe": [">15"], "market_cap": [">5000000", "<50000000"]},
        limit=10
    )
    return results.to_string()  # Можно сделать красивее!

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
