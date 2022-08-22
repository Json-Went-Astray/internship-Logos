var COMMISSION_FEE_CALC = 1.0; //Prowizja za leasing - domyślnie 1%
var commission_rate_calc = 3.07 //oprocentowanie miesięczne banku pekao ~3,07%

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
			buyout = 0.01;
			break;
		case "72":
			buyout = 0.01;
			break;
	}

	$(".calc_label_1").html("Okres miesięcy:");
	$(".calc_label_2").html("Przewidywana rata miesięczna:");
	$(".calc_label_3").html("Cena z wykupem:");
	
    let nettoPrice = parseFloat($(".nettoPrice").val());
	let initialPayment = $(".initialPayment").val();
	let period =  $(".period").val();

	let c = nettoPrice - ((initialPayment / 100) * nettoPrice);
	let r = (wibor1m + COMMISSION_FEE_CALC + commission_rate_calc) / 100 / 12;
	let f = nettoPrice * buyout;

	let ratePrice = ((c * r * Math.pow((1 + r), period)) - (f * r)) / (Math.pow((1 + r), period) - 1); 
		
	//okres miesięcy
	$(".final_period").html(period); 

	//licznik ze wzorku
	let numerator = (ratePrice * period + (nettoPrice * buyout) + (nettoPrice * (initialPayment / 100))).toFixed(2);
	
	//cena za wszystko + ile to procent ceny netto
	$(".final").html(numerator.toLocaleString('en') 
	+ "zł (" 
	+ ((numerator / nettoPrice) * 100).toFixed(2)
	+ "%)");
	
	//*przewidywana* rata
	$(".month").html(ratePrice.toFixed(2) + "zł"); 
 
}