$("document").ready(() => {
	validate();

	$(".period").on("change", () => {
		validate();
	});

	$(".inputs").on("input", () => {
		validate();

	});
});

function getPeriod() {
	$(".period").empty();
	let period = 12;
    for (let i = 0; i < 10; i++) {
        $(".period").append("<option value=\"" + period + "\">" + period + "</option>");
        period += 6;
    }
}

function validate() {
    let allGood = true;

    if ($(".netto").val() < 300 || !(/^[1-9][0-9]+$/.test($(".netto").val()))) //regexp pozwalający tylko na dodatnie liczby całkowite od 300 w góre
	{
        $(".netto").addClass("err");
		$(".calc_netto_invalid").css("visibility", "visible");
        allGood = false;
    } else if($(".netto").val()) {
        $(".netto").removeClass("err");
		$(".calc_netto_invalid").css("visibility", "hidden");
    }

	if (!$(".initialInput").val() || $(".initialInput").val() < 0 || $(".initialInput").val() > 45 || !(/^[0-9]+[1-9]*$/.test($(".initialInput").val()))) //regexp pozwalający tylko na całkowite liczby z przedziału <0;45> 
	{
		$(".initialInput").addClass("err");
		$(".calc_initial_invalid").css("visibility", "visible");
		allGood = false;
	} else if($(".initialInput").val()) {
		$(".calc_initial_invalid").css("visibility", "hidden");
		$(".initialInput").removeClass("err");
	}

	if (!$(".buyoutInput").val() || $(".buyoutInput").val() < 1 || $(".buyoutInput").val() > 45 || !(/^[1-9]+[1-9]*$/.test($(".buyoutInput").val()))) //regexp pozwalający tylko na całkowite liczby z przedziału <1;45> 
	{
		$(".buyoutInput").addClass("err");
		$(".calc_buyout_invalid").css("visibility", "visible");
		allGood = false;
	} else if($(".buyoutInput").val()) {
		$(".buyoutInput").removeClass("err");
		$(".calc_buyout_invalid").css("visibility", "hidden");
	}
	
	calc(allGood, false);
	return;
}

function calc(allGood) { /// JEŚLI USTAWIONE NA TRUE TO CZYTA WPŁATĘ WSTĘPNĄ I WYKUP KOŃCOWY Z INPUTÓW
	
	if(!allGood) {
		
		$(".init,.month,.final,.calc_label_1,.calc_label_2,.calc_label_3").html("");
		return;
	}

	$(".calc_label_1").html("Cena bez raty wstępnej:");
	$(".calc_label_2").html("Przewidywana rata miesięczna:");
	$(".calc_label_3").html("Cena z wykupem:");
	
    let initialPrice = parseFloat($(".netto").val());
	let init = initialPrice * (1.0 - (parseFloat($(".initialInput").val()) / 100.0));
	let monthly = init / parseFloat($(".period").val());
	let final = initialPrice + (initialPrice * (parseFloat($(".buyoutInput").val()) / 100.0));
	
	init = roundNumber(init, 2).toFixed(2);
    monthly = roundNumber(monthly, 2).toFixed(2);
	final = roundNumber(final, 2).toFixed(2);
		
    $(".init").html(init + " zł");
    $(".month").html(monthly + " zł");
    $(".final").html(final + " zł");

}

function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
      return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
      var arr = ("" + num).split("e");
      var sig = ""
      if(+arr[1] + scale > 0) {
        sig = "+";
      }
      return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
  }