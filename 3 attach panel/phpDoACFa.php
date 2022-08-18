	//field key == field_62dfb641602a0 nie wiem czy po imporcie field_key sie nie zmieni
	
	/*
	 * get_field() działa na pola już zapisane, więc dodanie pliku z pola acf nie przejdzie przed submitem
	 * ten autosave polega na tym, że bierze wartość z $_POST pola acf o kluczu field_62dfb641602a0 - dostaje id zamiast typowego arraya pliku
	 * funkcja get_attached_file() może zamienić to id na całą ścieżke w media, wadą jest to, że nie mogłem zrobić $plik['filename']
	 * więc zrobiłem explode() po slashu i nazwa pliku będzie ostatnim indexem
	 * na końcu sprawdzam jeszcze raz czy plik jest pdf'em lub go nie ma (czyli pusty string) jeśli tak to przewraca sie na plecy, zatrzymuje funkcje i wyświetla error na nowej stronie, strzałką można wrócić 
	 * (można by tu alerta zrobić i zapobiec wysłaniu; to pierwsze nie chciało zaskoczyć a wp_die() mogłem użyć do debugowania, na to drugie nie mam pomysłu)
	 * chyba jedyną wadą jest to, że żeby usunąć osadzony plik w danym poście trzeba albo go zamienić na inny, albo wybrać pusty i w liście rozwijalnej Akcje: Zamówienie zostawić na Wybierz akcję i kliknąć aktualizuj
	 * 
	 * ...to chyba tyle
	*/ 

add_filter( 'woocommerce_email_attachments', 'attachToEmail', 10, 3);
function attachToEmail($attachments, $email_id, $order) {
	$currentFile = explode("/", get_attached_file($_POST['acf']['field_62dfb641602a0']) ); 
    if (!is_a($order, 'WC_Order') || !isset($email_id)) {
        return $attachments;
    }
	
	$path = wp_upload_dir()['path']; //wygląda na to, że woocommerce potrzebuje ścieżki lokalnej, nie url
	
	$name = $currentFile[count($currentFile) - 1];
	if (substr($name, -4) != ".pdf" || $name == "") {
		wp_die("Podano niepoprawny typ pliku / Plik nie został zapisany");
	}
	$attachments[] = $path . '/' . $name;
	return $attachments;
}