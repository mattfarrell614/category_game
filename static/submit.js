$( document ).ready(function() {
	$.ajax({ 
        type: 'GET', 
        url: 'get_picked', 
        dataType: 'json',
        success:function(data) {
			for (i = 0; i < data.picked1_already.length; i++) {
				$("#player1list").append(new Option(data.picked1_already[i].toUpperCase()));
			  }
			for (i = 0; i < data.picked2_already.length; i++) {
				$("#player2list").append(new Option(data.picked2_already[i].toUpperCase()));
			}
			$('#player1tries').text(data.playerOneTries);
			$('#player2tries').text(data.playerTwoTries);
			if (data.playerOnesTurn == true){
				console.log("FIRST")
				$("#player1country").css({"background-color": "#3CBC8D"});
				$("#player2country").css({"background-color": "#EF4823"});
			}
			if (data.playerTwosTurn == true){
				console.log("SECOND")
				$("#player2country").css({"background-color": "#3CBC8D"});
				$("#player1country").css({"background-color": "#EF4823"});
			}
			console.log("Initial get: " + data.playerOnesTurn)
			console.log("Initial get: " + data.playerTwosTurn)
          }
	});

	
	$(function(){
		$("#player1form").submit(function(){
			playerOneAnswer = $("#player1country").val()
			if (playerOneAnswer == "") {
				return false
			}
			$.ajax({
				data : {
					player1Guess : playerOneAnswer
				},
				type : 'POST',
				url : '/_player_one',
				success: function(response) {
					if (response.playerOneLost){
						var modal = document.getElementById("myModal");
						var span = document.getElementsByClassName("close")[0];
						modal.style.display = "block"
						$("#playerOneLost").show()
						console.log("Player one lost")
					}

					if (response.playerOnePick) {
						$("#player1list").append(new Option(response.playerOnePick));
						$(".playerform")[0].reset();
										}
					if (response.error) {
						$("#notCoutryOne").show()
						setTimeout(function(){
						$("#notCoutryOne").hide();
						}, 1000);
						$(".playerform")[0].reset();
						$('#player1tries').text(response.playerOneTries);
										}
					if (response.playerTwosTurn == "true"){
						$("#player1country").css({"background-color": "#EF4823"});
						$("#player2country").css({"background-color": "#3CBC8D"});
					}
					else{
						$("#player2country").css({"background-color": "#3CBC8D"});
						$("#player1country").css({"background-color": "#EF4823"});
					}
					if (response.playerOnesTurn == "false"){
						$("#notOneTurn").show()
						setTimeout(function(){
						$("#notOneTurn").hide();
						}, 1000);
						$(".playerform")[0].reset();
					}
			}
		})
			event.preventDefault();
		});
	});
	$(function(){
		$("#player2form").submit(function(){
			playerTwoAnswer = $("#player2country").val()
			if (playerTwoAnswer == "") {
				return false
			}
			$.ajax({
				data : {
					player2Guess : playerTwoAnswer
				},
				type : 'POST',
				url : '/_player_two',
				success: function(response) {
					if (response.playerTwoLost){
						var modal = document.getElementById("myModal");
						var span = document.getElementsByClassName("close")[0];
						modal.style.display = "block"
						$("#playerTwoLost").show()
						console.log("Player two lost")
					}
					if (response.playerTwoPick) {
						$("#player2list").append(new Option(response.playerTwoPick));
						$(".playerform")[1].reset();
										}
					if (response.error) {
						$("#notCoutryTwo").show()
						setTimeout(function(){
						$("#notCoutryTwo").hide();
						}, 1000);
						$(".playerform")[1].reset();
						$('#player2tries').text(response.playerOneTries);
										}
					if (response.playerOnesTurn == "true"){
						$("#player1country").css({"background-color": "#3CBC8D"});
						$("#player2country").css({"background-color": "#EF4823"});
					}
					else{
						$("#player2country").css({"background-color": "#EF4823"});
						$("#player1country").css({"background-color": "#3CBC8D"});
					}
					if (response.playerTwosTurn == "false"){
						$("#notTwoTurn").show()
						setTimeout(function(){
						$("#notTwoTurn").hide();
						}, 1000);
						$(".playerform")[1].reset();
					}
				}
			})
			event.preventDefault();
		});
	});
});
