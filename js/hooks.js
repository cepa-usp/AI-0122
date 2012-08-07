/*
 * Before fetch hook (executes setup that are independent of AI status).
 */
function preFetchHook () {
	
	$(".init-message").show();
	
	// Insere o filme Flash na página HTML
	$("#ai-container").flash({
		swf: "swf/AI-0121.swf",
		width: 530,
		height: 480,
		play: false,
		id: "ai",
		allowScriptAccess: "always",
		flashvars: {},
		expressInstaller: "swf/expressInstall.swf",
	});

	// Referência para o filme Flash. 
	movie = $("#ai")[0]; 	
	
	// Conta o número de frames
	N_FRAMES = countFrames();
  
	// Sidebar
	$(".borda").click(toggleSidebar);
	
	// Botão "avançar"
	$("#step-forward").button().click(stepForwardOrFinish);

	// Tecla "enter" (também avança)
	$(":input").keypress(function (event) {
		if (event.which == 13) stepForwardOrFinish();
	});
	
	// Botão "reset"
	$("#reset").button({disabled: true}).click(function () {
		$("#reset-dialog").dialog("open");
	});

	// Configura as caixa de diálogo do botão "reset".
	$("#reset-dialog").dialog({
		buttons: {
			"Ok": function () {
				$(this).dialog("close");
				reset();
			},
			"Cancelar": function () {
				$(this).dialog("close");
			}
		},
		autoOpen: false,
		modal: true,
		width: 350
	});

	// Configura as caixa de diálogo de seleção dos animais (imagens).
	$("#finish-dialog").dialog({
		buttons: {
			"Ok": function () {
				$(this).dialog("close");
			}
		},
		autoOpen: false,
		modal: true,
		width: 500
	});	
	
	// Oculta os feedbacks
	$(".wrong-answer").hide();
	$(".right-answer").hide();
}

/*
 * After fetch hook (executes setup that are dependent of AI status).
 */
function postFetchHook (state) {

	// Adiciona o nome do usuário
	if (state.learner != "") {
		var prename = state.learner.split(",")[1];
		$("#learner-prename").html(prename + ",");
	}

	if (memento.completed) $(".completion-message").show();
	else $(".completion-message").hide();
	
	// Espera os callbacks do filme Flash ficarem disponíveis
	t1 = new Date().getTime();
	checkCallbacks();
}

/*
 * Before set-frame hook.
 */
function preSetFrameHook (targetFrame) {
	return true;
}

/*
 * After set-frame hook.
 */
function postSetFrameHook (targetFrame) {

	memento.frame = targetFrame;
	
	$(".start-invisible").removeClass("start-invisible");
	
	// Restaura o status da AI-0121
	movie.setAPointCoordinate(memento.A[0], memento.A[1]);
	movie.setDeltaX(memento.dx);
	movie.setDeltaY(memento.dy);
	movie.showVersor(memento.showVersor);
	movie.setInteractive("A", memento.interactive[0]);
	movie.setInteractive("B", memento.interactive[1]);
	movie.setInteractive("C", memento.interactive[2]);
	movie.setInteractive("D", memento.interactive[3]);

	// Restaura as respostas dadas
	for (var i = 0; i < 8; i++) {
		var value = memento.answers[i];
		if (value != "") $("#input-" + i).val(value).attr("disabled", "true");
		else $("#input-" + i).val("").removeAttr("disabled");
	}

	// Reexibe campos que estavam visíveis na seção anterior
	$(".wrong-answer").hide();
	$(".right-answer").hide();
	for (var i = 0; i < memento.show.length; i++) {
		$(memento.show[i]).show();
	}
	
	// Restaura campos alterados na seção anterior
	for (var i = 0; i < memento.restore.length; i++) {
		$(memento.restore[i][0]).html(memento.restore[i][1]);
	}

	// Configura os botões "avançar" e "recomeçar"
	var allow_reset = memento.completed && memento.frame > 0;
	$("#reset").button({disabled: !allow_reset});
	$("#step-forward").button({disabled: (memento.frame == N_FRAMES && memento.completed)});
  
	// Configuração específica de cada quadro
	switch (frame) {
		// 0 --> 1
		case  1:
		  break;
		  
		// 1 --> 2
		case  2:
		  break;
		  
		// 2 --> 3
		case  3:
		  break;
		  
		// 3 --> 4
		case  4:
		  break;

		// 4 --> 5
		case  5:
			break;
		  
		// 5 --> 6
		case  6:
		  break;
		  
		// 6 --> 7
		case  7:
		  break;

		// 7 --> 8
		case  8:
		  break;
		  
		// 8 --> 9
		case  9:
		  break;
		  
		// 9 --> 10
		case 10:
		  break;
		  
		// 10 --> 11
		case 11:
		  break;
		  
		// 11 --> 12
		case 12:
		  break;
		  
		// 12 --> 13
		case 13:
		  break;
		  
		// 13 --> 14
		case 14:
		  break;
		  
		// 14 --> 15
		case 15:
		  break;
		  
		// 15 --> 16
		case 16:
		  break;
		  
		// 16 --> 17
		case 17:
		  break;
		  
		// 17 --> 18
		case 18:
		  break;
		  
		default:
		  break;
	}
}

/**
 * This hook runs when the pre-set-frame hook returns false.
 */
function refusedSetFrameHook (targetFrame) {
}

/*
 * Before step-forward hook. If it returns false, step-foward will not be executed.
 */
function preStepForwardHook () {
  
  var proceed = false;
  
  switch (frame) {
    // 3 --> 4
    case 3:
      proceed = validateAnswer("#input-0");
      break;
      
    // 4 --> 5
    case 4:
      proceed = validateAnswer("#input-1");
      break;
      
    // 7 --> 8
    case 7:
      proceed = validateAnswer("#input-2") && validateAnswer("#input-3");
      break;
      
    // 10 --> 11
    case 10:
      proceed = validateAnswer("#input-4");
      break;
      
    // 13 --> 14
    case 13:
      proceed = validateAnswer("#input-5");
      break;
    
    // 14 --> 15
    case 14:
      proceed = validateAnswer("#input-6");
      break;
      
    // 15 --> 16
    case 15:
      proceed = validateAnswer("#input-7");
      break;
         
    // Demais transições não requerem análise   
    default:
      proceed = true;
      break;
  }
  
  return proceed;
}

/*
 * After step-forward hook.
 */
function postStepForwardHook () {

	memento.frame = frame;
  
	var allow_reset = memento.completed && memento.frame > 0;
	$("#reset").button({disabled: !allow_reset});
	
	switch (frame) {
		
      
		// 0 --> 1
		// -------------------------------------------
		case 1:
			break;
		  
		// 1 --> 2
		// -------------------------------------------
		case  2:
			movie.setAPointCoordinate(3, 4/3);
			movie.setInteractive("A", false);
			movie.setDeltaX(1);
			movie.setDeltaY(1);
			
			memento.A = [3, 4/3];
			memento.interactive[0] = false;
			memento.dx = 1;
			memento.dy = 1;
			break;
		  
		// 2 --> 3
		// -------------------------------------------
		case  3:
			var dx = movie.getDeltaX();
			if (!checkAnswer(1/2, dx, TOLERANCE)) movie.setDeltaX(1/2);
			movie.setInteractive("B", false);
			
			memento.dx = movie.getDeltaX();
			memento.interactive[1] = false;
			
			break;
		  
		// 3 --> 4
		// -------------------------------------------
		case  4:
			var user_answer = $("#input-0").val().replace(",", ".");
			var correct_answer = movie.getF("B") - movie.getF("A");
			
			if (checkAnswer(correct_answer, user_answer, TOLERANCE)) {
				++memento.count;
				$("#right-answer-0").show();
				memento.show.push("#right-answer-0");
				message("Acertou df_AB");
			}
			else {
				var formated_answer = formatNumber(correct_answer);
				$("#answer-0").html(formated_answer);
				memento.restore.push(["#answer-0", formated_answer]);
				$("#wrong-answer-0").show();
				memento.show.push("#wrong-answer-0");
				message("Errou. df_AB = " + formated_answer);
			}

			$("#input-0").attr("disabled", "true");
			
			movie.setInteractive("B", false);
			
			memento.answers[0] = formatNumber(user_answer);
			memento.interactive[1] = false;
			
			break;
		  
		// 4 --> 5
		// -------------------------------------------
		case  5:
			var user_answer = $("#input-1").val().replace(",", ".");
			var correct_answer = (movie.getF("B") - movie.getF("A")) / movie.getDeltaX();
		  
			if (checkAnswer(correct_answer, user_answer, TOLERANCE)) {
				++memento.count;
				var formated_answer_1 = formatNumber(user_answer);
				var formated_answer_2 = formatNumber(user_answer/4);
				$("#answer-1b").html(formated_answer_1);
				$("#answer-1c").html(formated_answer_1);
				$("#answer-1d").html(formated_answer_2);
				memento.restore.push(["#answer-1b", formated_answer_1]);
				memento.restore.push(["#answer-1c", formated_answer_1]);
				memento.restore.push(["#answer-1d", formated_answer_2]);
				$("#right-answer-1").show();
				memento.show.push("#right-answer-1");
				message("Acertou df_AB/dx");
			}
			else {
				var formated_answer_1 = formatNumber(correct_answer);
				var formated_answer_2 = formatNumber(correct_answer/4);
				$("#answer-1a").html(formated_answer_1);
				$("#answer-1b").html(formated_answer_1);
				$("#answer-1c").html(formated_answer_1);
				$("#answer-1d").html(formated_answer_2);
				memento.restore.push(["#answer-1a", formated_answer_1]);
				memento.restore.push(["#answer-1b", formated_answer_1]);
				memento.restore.push(["#answer-1c", formated_answer_1]);
				memento.restore.push(["#answer-1d", formated_answer_2]);
				$("#wrong-answer-1").show();
				memento.show.push("#wrong-answer-1");
				message("Errou. df_AB/dx = " + formated_answer);
			}
		  
			$("#input-1").attr("disabled", "true");
			
			movie.setInteractive("B", true);

			memento.dx = movie.getDeltaX();
			memento.answers[1] = formatNumber(user_answer);
			memento.interactive[1] = true;
			
			break;
		
		// 5 --> 6  
		// -------------------------------------------
		case  6:
		
			movie.setDeltaX(memento.dx);
			movie.setInteractive("B", false);

			memento.interactive[1] = false;
			break;
		  
		// 6 --> 7
		// -------------------------------------------
		case  7:
			var dy = movie.getDeltaY();
			if (!checkAnswer(1/2, dy, TOLERANCE)) movie.setDeltaY(1/2);
			
			movie.setInteractive("D", false);
			
			memento.dy = movie.getDeltaY();
			memento.interactive[3] = false;
			break;
		  
		// 7 --> 8
		// -------------------------------------------
		case  8:
			var user_answer_1 = $("#input-2").val().replace(",", ".");
			var correct_answer_1 = movie.getF("D") - movie.getF("A");

			var user_answer_2 = $("#input-3").val().replace(",", ".");
			var correct_answer_2 = correct_answer_1 / movie.getDeltaY();
				
			var check_1 = checkAnswer(correct_answer_1, user_answer_1, TOLERANCE);
			var check_2 = checkAnswer(correct_answer_2, user_answer_2, TOLERANCE);
			
			if (check_1 && check_2) {
				++memento.count;
				$("#right-answer-2").show();
				memento.show.push("#right-answer-2");
				++memento.count;
				$("#right-answer-3").show();
				memento.show.push("#right-answer-3");
				message("Acertou df_AD");
			}
			else {
				if (check_1 || check_2) ++memento.count;
				
				var formated_answer_1 = formatNumber(correct_answer_1);
				$("#answer-2").html(formated_answer_1);
				memento.restore.push(["#answer-2", formated_answer_1]);
				$("#wrong-answer-2").show();
				memento.show.push("#wrong-answer-2");
				
				var formated_answer_2 = formatNumber(correct_answer_2);
				$("#answer-3").html(formated_answer_2);
				memento.restore.push(["#answer-3", formated_answer_2]);
				$("#wrong-answer-3").show();
				memento.show.push("#wrong-answer-3");
				message("Errou. df_AD = " + formated_answer_1 + " e df_AD/dy = " + formated_answer_2);
			}

			$("#input-2").attr("disabled", "true");
			$("#input-3").attr("disabled", "true");

			movie.setInteractive("D", false);
			memento.interactive[3] = false;
			
			memento.answers[2] = formatNumber(user_answer_1);
			memento.answers[3] = formatNumber(user_answer_2);
			
			break;
		  
		// 8 --> 9
		// -------------------------------------------
		case  9:
			memento.dx = movie.getDeltaX();
			memento.dy = movie.getDeltaY();

			// Obs.: não pode salvar esses dados no memento!
			movie.setAPointCoordinate(4/3, 3);
			movie.setDeltaX(1/2);
			movie.setDeltaY(1/2);
			movie.resetZoom();
			break;
		  
		// 9 --> 10
		// -------------------------------------------
		case 10:
			movie.setAPointCoordinate(memento.A[0], memento.A[1]);
			movie.setDeltaX(memento.dx);
			movie.setDeltaY(memento.dy);
			movie.resetZoom();
			movie.setInteractive("B", true);
			memento.interactive[1] = true;
			break;
		
		// 10 --> 11
		// -------------------------------------------
		case 11:
			var user_answer = $("#input-4").val().replace(",", ".");
			var correct_answer = 4/3;

			if (checkAnswer(correct_answer, user_answer, 0.15)) { // Tolerância = 0.1 é muito pequena para este exercício
				++memento.count;
				$("#right-answer-4").show();
				memento.show.push("#right-answer-4");
				message("Acertou del-f/del-x");
			}
			else {
				//$("#answer-4").html(correct_answer); // Não precisa, pois a resposta é fixa
				//memento.restore.push(["#answer-4", correct_answer]); // Não precisa, pois a resposta é fixa
				$("#wrong-answer-4").show();
				memento.show.push("#wrong-answer-4");
				message("Errou. del-f/del-x = " + correct_answer);
			}

			$("#input-4").attr("disabled", "true");

			memento.answers[4] = formatNumber(user_answer);

			movie.setInteractive("B", true);
			memento.interactive[1] = true;
			
			movie.setInteractive("D", true);
			memento.interactive[3] = true;

			break;
		
		// 12 --> 13
		// -------------------------------------------
		case 13:
			movie.setDeltaX(1/2);
			memento.dx = 1/2;
			movie.setDeltaY(1/2);
			memento.dy = 1/2;
			movie.setInteractive("B", false);
			memento.interactive[1] = false;
			movie.setInteractive("D", false);
			memento.interactive[3] = false;
			break;
			
		// 13 --> 14
		// -------------------------------------------
		case 14:
			var user_answer = $("#input-5").val().replace(",", ".");
			var correct_answer = movie.getF("C") - movie.getF("A");

			if (checkAnswer(correct_answer, user_answer, TOLERANCE)) {
				++memento.count;
				$("#right-answer-5").show();
				memento.show.push("#right-answer-5");
				message("Acertou df_AC");
			}
			else {
				var formated_answer = formatNumber(correct_answer);
				$("#answer-5").html(formated_answer);
				memento.restore.push(["#answer-5", formated_answer]);
				$("#wrong-answer-5").show();
				memento.show.push("#wrong-answer-5");
				message("Errou. df_AC = " + formated_answer);
			}

			$("#input-5").attr("disabled", "true");

			memento.answers[5] = formatNumber(user_answer);

			movie.setInteractive("B", true);
			memento.interactive[1] = true;
			movie.setInteractive("D", true);
			memento.interactive[3] = true;
			
			break;
			
		// 14 --> 15
		// -------------------------------------------
		case 15:
			var user_answer = $("#input-6").val().replace(",", ".");
			var correct_answer = movie.getAPointYCoordinate() + movie.getAPointXCoordinate() * movie.getDeltaY() / movie.getDeltaX();

			if (checkAnswer(correct_answer, user_answer, TOLERANCE)) {
				++memento.count;
				$("#right-answer-6").show();
				memento.show.push("#right-answer-6");
				message("Acertou df/dx");
			}
			else {
				var formated_answer = formatNumber(correct_answer);
				$("#answer-6").html(formated_answer);
				memento.restore.push(["#answer-6", formated_answer]);
				$("#wrong-answer-6").show();
				memento.show.push("#wrong-answer-6");
				message("Errou. df/dx = " + formated_answer);
			}

			$("#input-6").attr("disabled", "true");

			memento.answers[6] = formatNumber(user_answer);

			break;
		  
		// 15 --> 16
		// -------------------------------------------
		case 16:
			var user_answer = $("#input-7").val().replace(",", ".");
			var correct_answer = movie.getAPointYCoordinate() * movie.getDeltaX() / movie.getDeltaY() + movie.getAPointXCoordinate();
			var formated_answer;
			
			if (checkAnswer(correct_answer, user_answer, TOLERANCE)) {
				++memento.count;
				$("#right-answer-7").show();
				memento.show.push("#right-answer-7");
				message("Acertou df/dy");
			}
			else {
				var formated_answer = formatNumber(correct_answer);
				$("#answer-7").html(formated_answer);
				memento.restore.push(["#answer-7", formated_answer]);
				$("#wrong-answer-7").show();
				memento.show.push("#wrong-answer-7");
				message("Errou. df/dy = " + formated_answer);
			}

			$("#input-7").attr("disabled", "true");

			memento.answers[7] = formatNumber(user_answer);

			movie.showVersor(true);
			memento.showVersor = true;

			break;
		  
		// 17 --> 18
		// -------------------------------------------
		case 18:
			movie.setInteractive("A", true);
			memento.interactive[0] = true;
			break;
		
		// Demais transições não requerem análise
		// -------------------------------------------
		default:
			// Nada
			break;
	}
	
	commit(memento);
}

/*
 * Step-forward failure hook. It runs after "preStepForwardHook()" returns false
 */
function refusedStepForwardHook () {
}

/*
 * Before step-backward hook. If it returns false, step-backward will not be executed.
 */
function preStepBackwardHook () {
	return true;
}

/*
 * After step-backward hook.
 */
function postStepBackwardHook () {
}

/*
 * Step-backward failure hook. It runs after "preStepBackwardHook()" returns false
 */
function refusedStepBackwardHook () {
}

/*
 * Finish this AI
 */
function finish () {
	
	$(".completion-message").show();
	$("#score").html(memento.count);
	$("#finish-dialog").dialog("open");
	$("#step-forward").button({disabled: true});
	$("#reset").button({disabled: false});
	
	if (!memento.completed) {
		memento.completed = true;
		memento.score = Math.max(0, Math.min(Math.ceil(100 * memento.count / memento.answers.length), 100));
		commit(memento);
	}
}

/*
 * Move forward, stepping to the next frame or finishing this AI
 */
function stepForwardOrFinish () {
	if (memento.frame < N_FRAMES) stepForward();
	else finish();
}

// Checks if given selector (type input) is a valid number. If not, resets field.
function validateAnswer (selector) {
  var value = $(selector).val().replace(",", ".");
  var isValid = !isNaN(value) && value != "";
  if (!isValid) $(selector).val("");
  return isValid;
}

// Check given answer against expected one, with relative tolerance also given
function checkAnswer (correct_answer, user_answer, tolerance) {
  return Math.abs(correct_answer - user_answer) < correct_answer * tolerance;
}

// Format a given number with 2 decimal places, and substitute period by comma.
function formatNumber (string) {
	return new Number(string).toFixed(2).replace(".", ",");
}