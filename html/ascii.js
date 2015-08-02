var char_sets = [] ;
char_sets['09'         ] = '01234567890' ;
char_sets['AZaz'       ] = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ' ;
char_sets['AZaz09'     ] = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890 ' ;
char_sets['numbers'    ] = char_sets['09'] ;
char_sets['letters'    ] = char_sets['AZaz09'] ;
char_sets['punctuation'] = ';\'"!@#$%^&*()-_=+[]{}\|:/?.>,<`~±§\\' ;
char_sets['particles'  ] = 'eμτνudcstbgWZHγ' ;
char_sets['binary'     ] = '01' ;

function choose_value_by_URL(url_name, default_value, allowed_values){
  // Take the default value, then try to match against other allowed values
  var value = default_value ;
  var url_value = getParameterByName(url_name) ;
  for(var i=0 ; i<allowed_values.length ; i++){ if(url_value==allowed_values[i]) value = allowed_values[i] ; }
  return value ;
}
function set_value_by_URL(url_name, default_value){
  // Take the default value, then try to match against other allowed values
  var url_value = getParameterByName(url_name) ;
  var value = (url_value) ? url_value : default_value ;
  return value ;
}

var mode      = choose_value_by_URL('mode'    , 'colour', ['colour' , 'bw' , 'rgb' , 'pixelate' , 'matrix']) ;
var char_set  = choose_value_by_URL('char_set', '09', ['09' , 'AZaz' , 'AZaz09' , 'punctuation' , 'particles' , 'binary']) ;
var char_rule = choose_value_by_URL('rule'    , 'parsimony', ['parsimony' , 'random']) ;
var chars = set_value_by_URL('chars', null) ;
if(!chars) chars = char_sets[char_set] ;
var img_url = 'images/' + set_value_by_URL('image', 'tfl.jpg') ;

var type_face = 'courier , monospace' ;

var cw = 100 ;
var ch = 100 ;
var rw =  6 ;
var rh = 10 ;

var kill  = false ;
var pause = false ;
var delay = 10 ;
var steps_per_spurt = 500 ;
var background = [0,0,0] ;

var canvas  = null ;
var context = null ;
var canvas_ascii  = null ;
var context_ascii = null ;
var image_data = null ;

var index_x = 0 ;
var index_y = 0 ;
var iMax    = 0 ;
var jMax    = 0 ;
var counter = 0 ;
var font_ratio = 1.45 ;

var rows = [] ;
var current_row = [] ;
function Get(id){ return document.getElementById(id) ; }
function getParameterByName(name){
  // Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search) ;
  return match && decodeURIComponent(match[1].replace(/\+/g, ' ')) ;
}
function keyDown(evt){
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  switch(keyDownID){
    case 27: kill  = true   ; break ;
    case 32: pause = !pause ; break ;
  }
}

function start(){
  document.addEventListener('keydown', keyDown) ;
  canvas  = document.createElement('canvas') ;
  canvas.id = 'canvas_image' ;
  context = canvas.getContext('2d') ;
  Get('div_canvas_image_wrapper').appendChild(canvas) ;
  
  canvas_ascii = document.createElement('canvas') ;
  canvas_ascii.id = 'canvas_ascii' ;
  canvas_ascii.width  = 3*rw ;
  canvas_ascii.height = 3*rh ;
  canvas_ascii.style.width  = 3*rw + 'px' ;
  canvas_ascii.style.height = 3*rh + 'px' ;
  context_ascii = canvas_ascii.getContext('2d') ;
  Get('div_canvas_ascii_wrapper').appendChild(canvas_ascii) ;
  
  Get('p_image_url').innerHTML = 'URL: ' + img_url ;
  
  var img = document.getElementById('img_source') ;
  img.src = img_url ;
  img.onload = function(){
    cw = img.width  ;
    ch = img.height ;
    
    canvas.width  = cw ;
    canvas.height = ch ;
    canvas.style.width  = cw + 'px' ;
    canvas.style.height = ch + 'px' ;
    
    img.style.width  = cw + 'px' ;
    img.style.height = ch + 'px' ;
    
    Get('pre_art').style.width  = cw + 'px' ;
    Get('pre_art').style.height = ch + 'px' ;
    
    context.drawImage(img,0,0) ;
  
    image_data = context.getImageData(0,0,cw,ch) ;
    iMax = Math.ceil(cw/rw) ;
    jMax = Math.floor(ch/rh) ;
    
    // Resize to close gaps
    rw = Math.ceil(cw/iMax) ;
    rh = Math.ceil(ch/jMax) ;
    
    Get('pre_art').style.font          = (font_ratio*rh) + 'px ' + type_face ;
    Get('pre_art').style.lineHeight    = (0.69*font_ratio*rh) + 'px' ;
    Get('pre_art').style.letterSpacing = '-0.225em' ;
    
    context.font = 'bold '+ font_ratio*rh + 'px ' + type_face ;
    context.font =          font_ratio*rh + 'px ' + type_face ;
    context.fillRect(0,0,cw,ch) ;
    
    Get('span_counter').innerHTML = (counter+0) ;
    Get('span_total').innerHTML = (iMax*jMax) ;
    Get('textarea_source').value = '' ;
  
    index_x = iMax-1 ;
    index_y = jMax-1 ;
    window.setTimeout('heartbeat()',delay) ;
  }
}

function heartbeat(){
  for(var step=0 ; step<steps_per_spurt ; step++){
    if(kill ) return   ;
    if(pause) continue ;
    update_rectangle(index_x*rw,index_y*rh,rw,rh) ;
    index_y-- ;
    if(index_y<0){
      index_x-- ;
      rows.push(current_row) ;
      current_row = [] ;
      if(index_x<0){
        var strings = []
        for(var j=rows[0].length-1 ; j>=0 ; j--){
          for(var i=rows.length-1 ; i>=0 ; i--){
            var c = rows[i][j] ;
            var rgb = c[1] ;
            strings.push('<span style="color:rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')">' + c[0] + '</span>') ;
          }
          strings.push('\n')
        }
        var html = strings.join('') ;
        Get('pre_art'        ).innerHTML = html ;
        
        var pre_html = '<pre style="' ;
        pre_html += 'background:black; ' ;
        pre_html += 'color:white; ' ;
        pre_html += 'text-align:left; ' ;
        pre_html += 'font-weight:strong; ' ;
        pre_html += 'padding:0px; ' ;
        pre_html += 'font:' + (font_ratio*rh) + 'px ' + type_face ;
        pre_html += 'line-height:' + (0.69*font_ratio*rh) + 'px; ' ;
        pre_html += 'letter-spacing:-0.253em; ' ;
        pre_html += 'width:'+cw+'px; ' ;
        pre_html += 'height:'+ch+'px; ' ;
        pre_html += '">' ;
        
        Get('textarea_source').value = pre_html + html + '</pre>' ;
        Get('span_counter').innerHTML = (counter+0) ;
        return ;
      }
      index_y = jMax-1 ;
    }
    counter++ ;
  }
  Get('span_counter').innerHTML = (counter+0) ;
  if(mode=='pixelate') context.putImageData(image_data,0,0) ;
  window.setTimeout('heartbeat()',delay) ;
}
function get_pixels(u,v,w,h,data,c_w){
  var pixels = [] ;
  for(var i=0 ; i<h ; i++){
    pixels.push([]) ;
    for(var j=0 ; j<w ; j++){
      var k = (c_w*(i+v)+(j+u))*4 ;
      var r = data.data[k+0] ;
      var g = data.data[k+1] ;
      var b = data.data[k+2] ;
      pixels[i].push([r,g,b]) ;
    }
  }
  return pixels ;
}
function update_rectangle(u,v,w,h){
  // Get the pxels
  if(v+h>=ch) return ;
  var pixels = get_pixels(u,v,w,h,image_data,cw) ;
  
  // Get rgb
  var r = 0 ;
  var g = 0 ;
  var b = 0 ;
  for(var i=0 ; i<h ; i++){
    for(var j=0 ; j<w ; j++){
      r += pixels[i][j][0] ;
      g += pixels[i][j][1] ;
      b += pixels[i][j][2] ;
    }
  }
  r /= (h*w) ;
  g /= (h*w) ;
  b /= (h*w) ;
  
  // Change depending on colour mode
  if(mode=='colour'){
    r = Math.floor(r) ;
    g = Math.floor(g) ;
    b = Math.floor(b) ;
  }
  else if(mode=='bw'){
    r = Math.floor((r+g+b)/3) ;
    g = r ;
    b = r ;
  }
  else if(mode=='rgb'){
    if     (r>g && r>b){ r = 255 ; g =   0 ; b =   0 ; }
    else if(g>r && g>b){ r =   0 ; g = 255 ; b =   0 ; }
    else if(b>r && b>g){ r =   0 ; g =   0 ; b = 255 ; }
    else               { r =   0 ; g =   0 ; b =   0 ; }
  }
  else if(mode=='pixelate'){
    for(var i=0 ; i<h ; i++){
      for(var j=0 ; j<w ; j++){
        var k = (cw*(i+v)+(j+u))*4 ;
        image_data.data[k+0] = r ;
        image_data.data[k+1] = g ;
        image_data.data[k+2] = b ;
      }
    }
    return ;
  }
  else if(mode=='matrix'){
    //g = Math.floor((r+g+b)/3) ;
    var g_new = r ;
    if(g>r && g>b) g_new = g ;
    if(b>r && b>g) g_new = b ;
    g = Math.floor(g_new) ;
    r = 0 ;
    b = 0 ;
  }
  
  var best_char = chars[Math.floor(Math.random()*chars.length)] ;
  if(char_rule=='parsimony'){
    var best_parsimony = 1e20 ;
   for(var m=0 ; m<chars.length ; m++){
      var bkg = background
      context_ascii.fillStyle = 'rgb('+bkg[0]+','+bkg[1]+','+bkg[2]+')' ;
      context_ascii.fillRect(0,0,3*rw,3*rh) ;
      context_ascii.fillStyle = 'rgb('+r+','+g+','+b+')' ;
      context_ascii.fillText(chars[m],w,h+h) ;
      var data_ascii = context_ascii.getImageData(0,0,3*w,3*h) ;
      var tmp_pixels = get_pixels(w,h,w,h,data_ascii,3*w) ;
      var parsimony = 0 ;
      for(var i=0 ; i<pixels.length ; i++){
        for(var j=0 ; j<pixels[i].length ; j++){
          var dr2 = Math.pow(pixels[i][j][0]-tmp_pixels[i][j][0],2) ;
          var dg2 = Math.pow(pixels[i][j][1]-tmp_pixels[i][j][1],2) ;
          var db2 = Math.pow(pixels[i][j][2]-tmp_pixels[i][j][2],2) ;
          parsimony += (dr2+dg2+db2) ;
        }
      }
      if(parsimony<best_parsimony){
        best_parsimony = parsimony ;
        best_char = chars[m] ;
      }
    }
  }
  context.fillStyle = 'rgb('+r+','+g+','+b+')' ;
  context.fillText(best_char,u,v+h) ;
  current_row.push( [best_char,[r,g,b]] ) ;
}
