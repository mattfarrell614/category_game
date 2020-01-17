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
			$('#player2tries').text(data.playerOneTries);
          }
	});

	
	$(function(){
		$("#player1form").submit(function(){
			playerOneAnswer = $("#player1country").val()
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

					if (!response.error) {
						$("#player1list").append(new Option(response.playerOnePick));
						$(".playerform")[0].reset();
										}
					else {
						$("#notCoutryOne").show()
						setTimeout(function(){
						$("#notCoutryOne").hide();
						}, 1000);
						$(".playerform")[0].reset();
						$('#player1tries').text(response.playerOneTries);
										}

				}
			})
			event.preventDefault();
		});
	});
	$(function(){
		$("#player2form").submit(function(){
			playerTwoAnswer = $("#player2country").val()
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
					if (!response.error) {
						$("#player2list").append(new Option(response.playerOnePick));
						$(".playerform")[1].reset();
										}
					else {
						$("#notCoutryTwo").show()
						setTimeout(function(){
						$("#notCoutryTwo").hide();
						}, 1000);
						$(".playerform")[1].reset();
						$('#player2tries').text(response.playerOneTries);
										}
				}
			})
			event.preventDefault();
		});
	});
});
