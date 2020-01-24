from flask import Flask, jsonify, render_template, request, session, url_for, redirect, make_response
import requests, json

countryrequest = requests.get("http://country.io/names.json")
countrydata = json.loads(countryrequest.text.upper())

def is_country(country):
    return country.upper() in countrydata.values()

def is_picked(guess):
    return guess in session["player_one_picks"] or guess in session["player_two_picks"]

app = Flask(__name__)
app.secret_key = "2fsnv987bw4%VFGNB@#$5EFBSD@#42wertgvsdfbv"

@app.route("/")
def index():
    if "player_one_picks" in session:
        return render_template('game.html')
    else:
        session["player_one_picks"] = []
        session["player_one_tries"] = 3
        session["player_ones_turn"] = True
        session["player_two_picks"] = []
        session["player_two_tries"] = 3
        session["player_twos_turn"] = False
        return render_template('game.html')

@app.route("/get_picked", methods=['GET'])
def get_picked():
    if "player_one_picks" in session:
        return jsonify({'picked1_already' : session["player_one_picks"], 'picked2_already' : session["player_two_picks"],\
             'playerOneTries' : session["player_one_tries"], 'playerTwoTries' : session["player_two_tries"],\
                'playerOnesTurn' : session["player_ones_turn"], 'playerTwosTurn' : session["player_twos_turn"]  })
    else:
        return jsonify({'error' : 'No picks yet'})

@app.route("/reset", methods=['GET'])
def reset():
    session.clear()
    return redirect(url_for("index"))

@app.route('/_player_one', methods=['POST'])
def _player_one():
    if "player_one_picks" in session:
        if session["player_ones_turn"]: 
            player_one_guess = request.form["player1Guess"]
            if is_country(player_one_guess) and is_picked(player_one_guess) == False:
                pickedtest1 = session["player_one_picks"]
                pickedtest1.append(request.form["player1Guess"])
                session["player_one_picks"] = pickedtest1
                session["player_ones_turn"] = False
                session["player_twos_turn"] = True
                return jsonify({'playerOnePick' : request.form["player1Guess"].upper(), 'playerOnesTurn' : session["player_ones_turn"], 'playerTwosTurn' : session["player_twos_turn"]})
            else:
                session["player_one_tries"] -= 1
                if session["player_one_tries"] == 0:
                    return jsonify({'playerOneLost' : 'Player One Lost'})
                session["player_ones_turn"] = False
                session["player_twos_turn"] = True
                return jsonify({'error' : 'Not a Country', 'playerOneTries' : session["player_one_tries"], 'playerOnesTurn' : session["player_ones_turn"], 'playerTwosTurn' : session["player_twos_turn"]})
        else:
            return jsonify({'playerOnesTurn' : 'false'})
    else:
        return redirect(url_for("index"))

@app.route('/_player_two', methods=['POST'])
def _player_two():
    if "player_two_picks" in session:
        if session["player_twos_turn"]:
            player_two_guess = request.form["player2Guess"]
            if is_country(player_two_guess) and is_picked(player_two_guess) == False:
                pickedtest1 = session["player_two_picks"]
                pickedtest1.append(request.form["player2Guess"])
                session["player_two_picks"] = pickedtest1
                session["player_twos_turn"] = False
                session["player_ones_turn"] = True
                return jsonify({'playerTwoPick' : player_two_guess.upper(), 'playerOnesTurn' : session["player_ones_turn"], 'playerTwosTurn' : session["player_twos_turn"]})
            else:
                session["player_two_tries"] -= 1
                if session["player_two_tries"] == 0:
                    return jsonify({'playerTwoLost' : 'Player Two Lost'})
                session["player_twos_turn"] = False
                session["player_ones_turn"] = True
                return jsonify({'error' : 'Not a Country', 'playerOneTries' : session["player_two_tries"],'playerOnesTurn' : session["player_ones_turn"], 'playerTwosTurn' : session["player_twos_turn"]})
        else:
            return jsonify({'playerTwosTurn' : 'false'})
    else:
        return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)