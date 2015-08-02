<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/ascii_art" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=ascii_art" ;
$project = new project_object("ascii_art", "ASCII art generator", "https://github.com/aidansean/ascii_art", "http://aidansean.com/projects/?tag=ascii_art", "ascii_art/images/project.jpg", "ascii_art/images/project_bw.jpg", "After talking to a friend who suggested I write a text based adventure game, I decided that it would be useful to develop a way to generate graphics that could be displayed as text.  To achieve this I used the HTML canvas to analyse images and comapared the distribution of colours with various characters, providing graphical, textual, and HTML outputs.", "Images,Art", "CSS,HTML,JavaScript,canvas") ;
?>