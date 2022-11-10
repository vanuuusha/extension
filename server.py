from flask import Flask, request


app = Flask(__name__)

count = 0


@app.route("/", methods=["GET", "POST"])
def registration():
    if request.method == "POST":
        global count
        count += 1
        print(request.data.decode())
        return '', 200


if __name__ == "__main__":
    app.run(debug=True)
