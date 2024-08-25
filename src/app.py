import os
import random

from flask import Flask, jsonify, redirect, render_template, request, url_for, send_from_directory, send_file, \
    make_response
from waitress import serve
from flask_squeeze import Squeeze

squeeze = Squeeze()
app = Flask(__name__)
squeeze.init_app(app)
# Eastern armenian alphabet
armenian_alphabet = {
    "uppercase": [
        "Ա",
        "Բ",
        "Գ",
        "Դ",
        "Ե",
        "Զ",
        "Է",
        "Ը",
        "Թ",
        "Ժ",
        "Ի",
        "Լ",
        "Խ",
        "Ծ",
        "Կ",
        "Հ",
        "Ձ",
        "Ղ",
        "Ճ",
        "Մ",
        "Յ",
        "Ն",
        "Շ",
        "Ո",
        "Չ",
        "Պ",
        "Ջ",
        "Ռ",
        "Ս",
        "Վ",
        "Տ",
        "Ր",
        "Ց",
        "ՈՒ",
        "Փ",
        "Ք",
        "Եվ",
        "Օ",
        "Ֆ",
    ],
    "lowercase": [
        "ա",
        "բ",
        "գ",
        "դ",
        "ե",
        "զ",
        "է",
        "ը",
        "թ",
        "ժ",
        "ի",
        "լ",
        "խ",
        "ծ",
        "կ",
        "հ",
        "ձ",
        "ղ",
        "ճ",
        "մ",
        "յ",
        "ն",
        "շ",
        "ո",
        "չ",
        "պ",
        "ջ",
        "ռ",
        "ս",
        "վ",
        "տ",
        "ր",
        "ց",
        "ու",
        "փ",
        "ք",
        "և",
        "օ",
        "ֆ",
    ],
    "transcription": [
        "[a]",
        "[b]",
        "[g]",
        "[d]",
        "[e]",
        "[z]",
        "[eʼ]",
        "[yʼ]",
        "[tʼ]",
        "[zh]",
        "[i]",
        "[l]",
        "[x]",
        "[cʼ]",
        "[k]",
        "[h]",
        "[dz]",
        "[gh]",
        "[č]",
        "[m]",
        "[y]",
        "[n]",
        "[sh]",
        "[vo]",
        "[ch]",
        "[p]",
        "[ǰ]",
        "[rr]",
        "[s]",
        "[v]",
        "[t]",
        "[r]",
        "[cʼ]",
        "[u]",
        "[pʼ]",
        "[q]",
        "[ew]",
        "[o]",
        "[f]",
    ],
    "pronunciation": [
        "Hy-ա.mp3",
        "Hy-բ.mp3",
        "Hy-գ.mp3",
        "Hy-դ.mp3",
        "Hy-ե.mp3",
        "Hy-զ.mp3",
        "Hy-է.mp3",
        "Hy-ը.mp3",
        "Hy-թ.mp3",
        "Hy-ժ.mp3",
        "Hy-ի.mp3",
        "Hy-լ.mp3",
        "Hy-խ.mp3",
        "Hy-ծ.mp3",
        "Hy-կ.mp3",
        "Hy-հ.mp3",
        "Hy-ձ.mp3",
        "Hy-ղ.mp3",
        "Hy-ճ.mp3",
        "Hy-մ.mp3",
        "Hy-յ.mp3",
        "Hy-ն.mp3",
        "Hy-շ.mp3",
        "Hy-ո.mp3",
        "Hy-չ.mp3",
        "Hy-պ.mp3",
        "Hy-ջ.mp3",
        "Hy-ռ.mp3",
        "Hy-ս.mp3",
        "Hy-վ.mp3",
        "Hy-տ.mp3",
        "Hy-ր.mp3",
        "Hy-ց.mp3",
        "Hy-ու.mp3",
        "Hy-փ.mp3",
        "Hy-ք.mp3",
        "Hy-և.mp3",
        "Hy-օ.mp3",
        "Hy-ֆ.mp3",
    ],
    "handwritten": [
        "Ա_handwritten.svg",
        "Բ_handwritten.svg",
        "Գ_handwritten.svg",
        "Դ_handwritten.svg",
        "Ե_handwritten.svg",
        "Զ_handwritten.svg",
        "Է_handwritten.svg",
        "Ը_handwritten.svg",
        "Թ_handwritten.svg",
        "Ժ_handwritten.svg",
        "Ի_handwritten.svg",
        "Լ_handwritten.svg",
        "Խ_handwritten.svg",
        "Ծ_handwritten.svg",
        "Կ_handwritten.svg",
        "Հ_handwritten.svg",
        "Ձ_handwritten.svg",
        "Ղ_handwritten.svg",
        "Ճ_handwritten.svg",
        "Մ_handwritten.svg",
        "Յ_handwritten.svg",
        "Ն_handwritten.svg",
        "Շ_handwritten.svg",
        "Ո_handwritten.svg",
        "Չ_handwritten.svg",
        "Պ_handwritten.svg",
        "Ջ_handwritten.svg",
        "Ռ_handwritten.svg",
        "Ս_handwritten.svg",
        "Վ_handwritten.svg",
        "Տ_handwritten.svg",
        "Ր_handwritten.svg",
        "Ց_handwritten.svg",
        "ՈՒ_handwritten.svg",
        "Փ_handwritten.svg",
        "Ք_handwritten.svg",
        "և_handwritten.svg",
        "Օ_handwritten.svg",
        "Ֆ_handwritten.svg",
    ],
}

with app.app_context(), app.test_request_context():
    armenian_alphabet["pronunciation"] = [
        url_for("static", filename=f"sounds/{file}")
        for file in armenian_alphabet["pronunciation"]
    ]
    armenian_alphabet["handwritten"] = [
        url_for("static", filename=f"handwritten/{file}")
        for file in armenian_alphabet["handwritten"]
    ]


def get_random_choices(answer_category, correct_answer, num_choices=4):
    choices = random.sample(armenian_alphabet[answer_category], num_choices)
    if correct_answer not in choices:
        choices[-1] = correct_answer
    random.shuffle(choices)
    return choices


@app.route("/")
def index():
    # redirect to the aybuben page
    return redirect(url_for("aybuben"))


@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


@app.route("/aybuben")
def aybuben():
    return render_template("aybuben.html")


@app.route("/get_alphabet")
def get_alphabet():
    return jsonify({'alphabet': armenian_alphabet})


@app.route("/get_question", methods=["POST"])
def get_question():
    question_category = request.form.get("category")
    answer_category = request.form.get("answer_category")
    if question_category is None or answer_category is None:
        return redirect(url_for("index"))

    correct_index = random.randint(0, len(armenian_alphabet[question_category]) - 1)
    correct_answer = armenian_alphabet[answer_category][correct_index]
    question = armenian_alphabet[question_category][correct_index]
    choices = get_random_choices(answer_category, correct_answer)
    all_categories = {key: armenian_alphabet[key][correct_index] for key in armenian_alphabet}

    return jsonify(
        {
            "question": question,
            "choices": choices,
            "correct": correct_answer,
            "all_categories": all_categories,
        }
    )


@app.route("/google6092c9f6782b7a3a.html")
def google_site_verf():
    return render_template("google6092c9f6782b7a3a.html")


@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')


@app.route('/manifest.json')
def manifest():
    return send_from_directory('static', 'manifest.json')


@app.route('/sw.js')
def get_service_worker():
    response = make_response(send_from_directory('static', 'service-worker.js'))
    response.headers['Content-Type'] = 'application/javascript'
    response.headers['Cache-Control'] = 'no-cache'
    return response


if os.environ.get("FLASK_ENV") == "development":
    app.run(debug=True, port=8080)
else:
    serve(app, port=8080)
