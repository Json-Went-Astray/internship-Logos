var COMMISSION_FEE_CALC = 0.01; //Prowizja za leasing - domyślnie 1%

$("document").ready(() => {
	validate();

	$(".period").on("change", () => {
		validate();
	});

	$(".inputs").on("input", () => {
		validate();

	});
});


function validate() {
    let allGood = true;

    if ($(".nettoPrice").val() < 1 || !(/^[1-9][0-9]+$/.test($(".nettoPrice").val()))) //regexp pozwalający tylko na dodatnie liczby całkowite od 300 w góre
	{
        $(".nettoPrice").addClass("err");
		$(".calc_netto_invalid").css("visibility", "visible");
        allGood = false;
    } else if($(".nettoPrice").val()) {
        $(".nettoPrice").removeClass("err");
		$(".calc_netto_invalid").css("visibility", "hidden");
    }
	

	if (!$(".initialPayment").val() || $(".initialPayment").val() < 5 || $(".initialPayment").val() > 45 || !(/^[0-9]+[1-9]*$/.test($(".initialPayment").val()))) //regexp pozwalający tylko na całkowite liczby z przedziału <0;45> 
	{
		$(".initialPayment").addClass("err");
		$(".calc_initial_invalid").css("visibility", "visible");
		allGood = false;
	} else if($(".initialPayment").val()) {
		$(".calc_initial_invalid").css("visibility", "hidden");
		$(".initialPayment").removeClass("err");
	}
	
	calc(allGood, false);
	return;
}

function calc(allGood) {
	
	if(!allGood) {
		
		$(".month,.final_period,.final,.calc_label_1,.calc_label_2,.calc_label_3").html("");
		return;
	}
	
	let buyout = 0; // % wykupu zależny od okresu miesięcy
	switch ($(".period option:selected").text()) {
		case "36":
			buyout = 0.184;
			break;
			
		case "48":
			buyout = 0.044;
			break;
			
		case "60":
		case "72":
			buyout = 0.01;
			break;
	}

	$(".calc_label_1").html("Okres miesięcy:");
	$(".calc_label_2").html("Przewidywana rata miesięczna:");
	$(".calc_label_3").html("Cena z wykupem:");
	
    let nettoPrice = parseFloat($(".nettoPrice").val());
	let initialPayment = $(".initialPayment").val() / 100;
	
	let finalPeriod = $(".period option:selected").text();

	let rate = ((nettoPrice + ((wibor1m - 1) * nettoPrice)  - (buyout * nettoPrice) - (nettoPrice * initialPayment))) / $(".period").val();
	let final = (nettoPrice + ((wibor1m - 1) * nettoPrice)  + (buyout * nettoPrice) + (nettoPrice * initialPayment) + (nettoPrice * COMMISSION_FEE_CALC));

	$(".final").html(final.toFixed(2) + "zł (" + (((final + (nettoPrice * initialPayment)) / nettoPrice) * 100).toFixed(0) + "%)");
	$(".month").html(rate.toFixed(2) + "zł");
	$
	console.log(perMonth * 36);
 
}