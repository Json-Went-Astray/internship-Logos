<?php
    echo floatval(str_replace(",", ".", explode(">", explode("</td>", file_get_contents('http://cw.money.pl/depozyty_gf.html'))[10])[1])) / 100 + 1;
  
    //echo Gettype(floatval(str_replace(",", ".", explode(">", explode("</td>", file_get_contents('http://cw.money.pl/depozyty_gf.html'))[10])[1])));
	echo "<script> var wibor1m = " . floatval(str_replace(",", ".", explode(">", explode("</td>", file_get_contents('http://cw.money.pl/depozyty_gf.html'))[10])[1])) / 100 + 1 . "</script>"

?>
