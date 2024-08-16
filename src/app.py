import random

from flask import Flask, jsonify, redirect, render_template, request, url_for
from waitress import serve

app = Flask(__name__)

# Easter armenian
#
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
        "a",
        "b",
        "g",
        "d",
        "e",
        "z",
        "eʼ",
        "yʼ",
        "tʼ",
        "zh",
        "i",
        "l",
        "x",
        "cʼ",
        "k",
        "h",
        "dz",
        "gh",
        "č",
        "m",
        "y",
        "n",
        "sh",
        "vo",
        "ch",
        "p",
        "ǰ",
        "rr",
        "s",
        "v",
        "t",
        "r",
        "cʼ",
        "u",
        "pʼ",
        "q",
        "ew",
        "o",
        "f",
    ],
    "pronunciation": [
        "Hy-ա.ogg",
        "Hy-բ.ogg",
        "Hy-գ.ogg",
        "Hy-դ.ogg",
        "Hy-ե.ogg",
        "Hy-զ.ogg",
        "Hy-է.ogg",
        "Hy-ը.ogg",
        "Hy-թ.ogg",
        "Hy-ժ.ogg",
        "Hy-ի.ogg",
        "Hy-լ.ogg",
        "Hy-խ.ogg",
        "Hy-ծ.ogg",
        "Hy-կ.ogg",
        "Hy-հ.ogg",
        "Hy-ձ.ogg",
        "Hy-ղ.ogg",
        "Hy-ճ.ogg",
        "Hy-մ.ogg",
        "Hy-յ.ogg",
        "Hy-ն.ogg",
        "Hy-շ.ogg",
        "Hy-ո.ogg",
        "Hy-չ.ogg",
        "Hy-պ.ogg",
        "Hy-ջ.ogg",
        "Hy-ռ.ogg",
        "Hy-ս.ogg",
        "Hy-վ.ogg",
        "Hy-տ.ogg",
        "Hy-ր.ogg",
        "Hy-ց.ogg",
        "Hy-ու.ogg",
        "Hy-փ.ogg",
        "Hy-ք.ogg",
        "Hy-և.ogg",
        "Hy-օ.ogg",
        "Hy-ֆ.ogg",
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


def get_random_choices(answer_category, correct_answer, num_choices=4):
    choices = random.sample(armenian_alphabet[answer_category], num_choices)
    if correct_answer not in choices:
        choices.pop()
        choices.append(correct_answer)
    random.shuffle(choices)
    return choices


@app.route("/")
def index():
    return render_template("quiz.html")


@app.route("/get_question", methods=["POST"])
def get_question():
    question_category = request.form.get("category")
    answer_category = request.form.get("answer_category")
    if question_category is None or answer_category is None:
        return redirect(url_for("index"))

    correct_index = random.randint(0, len(armenian_alphabet[question_category]) - 1)
    correct_answer = armenian_alphabet[answer_category][correct_index]

    if question_category == "pronunciation":
        question = url_for(
            "static",
            filename=f"sounds/{armenian_alphabet[question_category][correct_index]}",
        )
    elif question_category == "handwritten":
        question = url_for(
            "static",
            filename=f"handwritten/{armenian_alphabet[question_category][correct_index]}",
        )
    else:
        question = armenian_alphabet[question_category][correct_index]

    if answer_category == "handwritten":
        choices = [
            url_for("static", filename=f"handwritten/{choice}")
            for choice in get_random_choices(answer_category, correct_answer)
        ]
        correct_answer = url_for("static", filename=f"handwritten/{correct_answer}")
    elif answer_category == "pronunciation":
        choices = [
            url_for("static", filename=f"sounds/{choice}")
            for choice in get_random_choices(answer_category, correct_answer)
        ]
        correct_answer = url_for("static", filename=f"sounds/{correct_answer}")
    else:
        choices = get_random_choices(answer_category, correct_answer)

    all_categories = {
        "uppercase": armenian_alphabet["uppercase"][correct_index],
        "lowercase": armenian_alphabet["lowercase"][correct_index],
        "transcription": armenian_alphabet["transcription"][correct_index],
        "handwritten": url_for(
            "static",
            filename=f'handwritten/{armenian_alphabet["handwritten"][correct_index]}',
        ),
        "pronunciation": url_for(
            "static",
            filename=f'sounds/{armenian_alphabet["pronunciation"][correct_index]}',
        ),
    }

    return jsonify(
        {
            "question": question,
            "choices": choices,
            "correct": correct_answer,
            "all_categories": all_categories,
        }
    )


if __name__ == "__main__":
    serve(app)
