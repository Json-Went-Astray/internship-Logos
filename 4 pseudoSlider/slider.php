<?php
add_post_meta(get_the_ID(), "getPrice", get_filtered_price(false), true);
add_post_meta(get_the_ID(), "getPrice2", get_filtered_price(true), true);

update_post_meta( get_the_ID(), 'getPrice', get_filtered_price(false) );
update_post_meta( get_the_ID(), 'getPrice2', get_filtered_price(true) );

echo var_dump(get_post_custom_values("getPrice"));
echo var_dump(get_post_custom_values("getPrice2"));



function get_filtered_price($getMax) {
	global $wpdb;

	$args       = wc()->query->get_main_query();

	$tax_query  = isset( $args->tax_query->queries ) ? $args->tax_query->queries : array();
	$meta_query = isset( $args->query_vars['meta_query'] ) ? $args->query_vars['meta_query'] : array();

	foreach ( $meta_query + $tax_query as $key => $query ) {
		if ( ! empty( $query['price_filter'] ) || ! empty( $query['rating_filter'] ) ) {
			unset( $meta_query[ $key ] );
		}
	}

	$meta_query = new \WP_Meta_Query( $meta_query );
	$tax_query  = new \WP_Tax_Query( $tax_query );

	$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
	$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );

	$sql  = "SELECT min( FLOOR( price_meta.meta_value ) ) as min_price, max( CEILING( price_meta.meta_value ) ) as max_price FROM {$wpdb->posts} ";
	$sql .= " LEFT JOIN {$wpdb->postmeta} as price_meta ON {$wpdb->posts}.ID = price_meta.post_id " . $tax_query_sql['join'] . $meta_query_sql['join'];
	$sql .= " 	WHERE {$wpdb->posts}.post_type IN ('product')
			AND {$wpdb->posts}.post_status = 'publish'
			AND price_meta.meta_key IN ('_price')
			AND price_meta.meta_value > '' ";
	$sql .= $tax_query_sql['where'] . $meta_query_sql['where'];

	$search = \WC_Query::get_main_search_query_sql();
	if ( $search ) {
		$sql .= ' AND ' . $search;
	}

	$prices = $wpdb->get_row( $sql ); // WPCS: unprepared SQL ok.
	
	//get_option('__cron_update_currency');
	//return number_format(get_post_custom_values("_price")[0], 2);
	
	      
	if ($getMax)
	//return get_post_custom_values("_price");
	return str_replace( array( '\'', '"', ',' , ';', '<', '>' ), '', number_format((( $prices->max_price ) *  get_option('__cron_update_currency')), 2));
	return str_replace( array( '\'', '"', ',' , ';', '<', '>' ), '', number_format((( $prices->min_price ) * get_option('__cron_update_currency')), 2));
	//return [
		//'min' => number_format((floor( $prices->min_price ) * 0.87 * get_option('__cron_update_currency') ), 2),
		//'max' => number_format((ceil( $prices->max_price ) * 0.87 *  get_option('__cron_update_currency')), 2)
	//];
	
}



?>