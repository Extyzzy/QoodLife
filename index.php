<?php
	include 'api-in-api.php';
	$class = new MySuperClassForFixFrontIdiotism();

	$metaData = $class->callAPI(
		'GET',
		'http://api.qood.life/v1/global-requests/generate-meta-data',
		[
			'url' => $_SERVER['REQUEST_URI'],
		]
	);

	$metaData = json_decode($metaData);
?>

<!DOCTYPE html>
<html lang="ro">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
		<meta name="theme-color" content="#000000">

		<meta property="og:title" content="<?=str_replace('"', "'",htmlentities($metaData->title))?>">
		<meta property="og:description" content="<?=str_replace('"', "'",htmlentities($metaData->desc))?>">
		<meta property="og:image" content="<?=$metaData->image?>">
		<meta property="og:url" content="https://www.qood.life<?=str_replace('"', "'",htmlentities($metaData->url))?>">
		<meta name="description" content="<?=str_replace('"', "'",htmlentities($metaData->desc))?>">
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		
		<meta name="twitter:card" content="summary_large_image">
		<meta property="og:site_name" content="Moldovean social-media hobby platform">
		<meta name="twitter:image:alt" content="QoodLife overview">

		<script>!function(e,a,t,n,c,g,o){e.GoogleAnalyticsObject=c,e.ga=e.ga||function(){(e.ga.q=e.ga.q||[]).push(arguments)},e.ga.l=1*new Date,g=a.createElement("script"),o=a.getElementsByTagName("script")[0],g.async=1,g.src="//www.google-analytics.com/analytics.js",o.parentNode.insertBefore(g,o)}(window,document,0,0,"ga")</script>

		<link rel="manifest" href="/manifest.json">
		<link rel="shortcut icon" href="/favicon.ico">

		<title><?=$metaData->title?> - qood.life</title>
	</head>
	<body>
		<noscript>You need to enable JavaScript to run this app.</noscript>

		<div id="app"></div>
		<script type="text/javascript" src="/static/js/main.0ee40613.js"></script>
	</body>
</html>
