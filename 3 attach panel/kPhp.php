<?php
// metabox dodania pliku
add_action( 'cmb2_admin_init', 'weni_wc_dodaj_plikORDER' );
function weni_wc_dodaj_plikORDER() {
	$cmb = new_cmb2_box( array(
		'id'            => 'order_attachments',
		'title'         => 'Order Attachments',
		'object_types'  => array( 'shop_order', ),
		'context'       => 'side',
		'priority'      => 'high',
		'show_names'    => true,
	) );
    $cmb->add_field( array(
        'desc' => 'Dodaj plik który ma zostać dołączony do emaila. Plik musi zostać dołączony przed realizacją zamówienia - status "Zrealizowane"',
        'id'   => 'order_file_list',
        'type' => 'file_list',
        'preview_size' => array( 100, 100 ), // Default: array( 50, 50 )
        //'query_args' => array( 'type' => 'image' ), // Set to only allow image attachments. This can be disabled or edited.
    ) );
}


add_filter( 'woocommerce_email_attachments', 'weni_wc_wyslij_plikORDER', 10, 4 );
function weni_wc_wyslij_plikORDER( $attachments, $email_id, $object, $email_obj ) {
	//zabezpieczenie dodawaj tylko do zrealizowanych
	if ( 'customer_completed_order' != $email_id ) {
		return $attachments;
	}
    
	//doklej plik do emaila
    $files = get_post_meta( $object->get_id(), 'order_file_list', true );
    foreach ( (array) $files as $attachment_id => $attachment_url ) {
        $attachments[] = get_attached_file( $attachment_id );
	}
	return $attachments;
}
?>