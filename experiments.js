function seededRandom( seed ){
  return function( max, min ){
    max = max || 1;
    min = min || 0;
 
    seed = ( seed * 9301 + 49297 ) % 233280;
    var rnd = seed / 233280;
 
    return min + rnd * ( max - min );
  }
}

function Logger( log ){
  var isIn = false;
  
  var logger = function(){
    var entry = Array.prototype.slice.call( arguments );
    
    if( entry.length === 0 ) return;
    
    var key = entry[ 0 ];
    
    isIn = key === 'in' ? true : isIn;
    
    if( isIn && reserved.indexOf( key ) !== -1 ) return;
    
    log.push( entry );
  };
  
  return logger;
}

var reserved = [ 'world', 'author', 'in' ];

function logState( log ){      
  return log.reduce( function( state, logEntry ){ 
    var entry = logEntry.slice();
    var node = state;
    var value = entry.splice( entry.length - 1, 1 )[ 0 ];
    var endIndex = entry.length - 1;
    
    entry.forEach( function( path, i ){
      if( i === endIndex ){
        node[ path ] = value;
        return;
      }
      
      if( !( path in node ) ){
        node[ path ] = {};
      }
      
      node = node[ path ];
    });
    
    return state;
  }, Object.create( null ) );
}

function splitOn( log, pattern ){
  var split = [];
  var group;
  
  pattern = Array.isArray( pattern ) ? pattern : [ pattern ];
  
  log.forEach( function( entry ){
    var isMatch = pattern.reduce( function( isMatch, value, i ){
      return isMatch ? value === entry[ i ] : isMatch;
    }, true );
    
    if( isMatch ){
      if( group ) {
        split.push( group );
      }
      group = [];
    }
    
    group = Array.isArray( group ) ? group : [];
    
    group.push( entry );
  });
  
  split.push( group );
  
  return split;
}

function clone( o ){
  return JSON.parse( JSON.stringify( o ) );
}

function getAuthor( name ){
  return 'Nik';
}

function World( name, onEnter ){
  var log;
  var logger;
  
  function world( l, onExit ){
    log = l ? clone( l ) : [];
    logger = Logger( log );
    
    logger( 'world', name );
    logger( 'author', getAuthor( name ) );
    logger( 'in' );
    
    onEnter( null, logger, world.log, function( err ){
      if( err ){
        onExit( err );
        return;
      }

      onExit( null, world.log() );
    });
  }
  
  world.log = function(){
    return clone( log );
  }
  
  return world;
}

var worlds = [];
var log = [];

var initWorld = World( 'Init', function( err, logger, getLog, cb ){
  var width = 40;
  var height = 30;
  
  logger( 'seed', Math.random() );
  logger( 'player', 'name', 'Nik' );
  logger( 'display', 'sprites', 'width', 8 );
  logger( 'display', 'sprites', 'height', 8 );
  logger( 'display', 'sprites', 'sheet', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpENzAzODI1RTUxM0IxMUU1QUMyQkRDNzUzRUM3RTIyQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpENzAzODI1RjUxM0IxMUU1QUMyQkRDNzUzRUM3RTIyQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ3MDM4MjVDNTEzQjExRTVBQzJCREM3NTNFQzdFMjJCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ3MDM4MjVENTEzQjExRTVBQzJCREM3NTNFQzdFMjJCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+MmtBYgAAAAlQTFRFAAAA////////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' );
  logger( 'display', 'map', 'width', width );
  logger( 'display', 'map', 'height', height );
  logger( 'display', 'viewport', 'width', width );
  logger( 'display', 'viewport', 'height', height );
  logger( 'display', 'camera', 'x', width / 2 );
  logger( 'display', 'camera', 'y', height / 2 );
  
  
  for( var y = 0; y < height; y++ ){
    for( var x = 0; x < width; x++ ){
      var i = y * width + x;
      logger( 'draw', i, '#'.charCodeAt( 0 ) );
    }
  }
  
  cb( null );
});

var testWorlds = [ 'Circle', 'Triangle', 'Square', 'Rectangle', 'Pentagon', 'Hexagon', 'Octagon' ];

var worlds = testWorlds.map( function( name ){
  return World( name, function( err, logger, getLog, cb ){
    logger( 'player', 'has', name, true );
     
    var log = getLog();
    
    var has = log.filter( function( l ){
      return l[ 0 ] === 'player' && l[ 1 ] === 'has' && l[ 3 ];
    }).map( function( l ){
      return l[ 2 ];
    });
    
    if( has.indexOf( 'Trifecta' ) === -1 ){    
      var hasTrifecta = [ 'Circle', 'Triangle', 'Square' ].every( function( shape ){
        return has.indexOf( shape ) !== -1;
      });
      
      if( hasTrifecta ){
        logger( 'player', 'has', 'Trifecta', true );
      }
    }
    
    if( name === 'Triangle' ){
      logger( 'world', 'More like poo tangle lol' )
    }
    
    var len = log.length;
    var seed = name;
    while( len-- ){
      if( log[ len ][ 0 ] === 'seed' ){
        seed = log[ len ][ 1 ];
        break;
      }
    }
    
    var random = seededRandom( seed );
    logger( 'random', random() );
    logger( 'random', random() );
    
    cb( null );
  });
});

var jumps = 10;
function teleport( log, cb ){
  if( jumps === 0 ){
    cb( null, log );
    return;
  }
  
  jumps--;
  
  var worldIndex = Math.floor( Math.random() * worlds.length );
  
  worlds[ worldIndex ]( log, function( err, log ){
    if( err ){
      cb( err );
      return;
    }
    
    teleport( log, cb );
  });
}

initWorld( log, function( err, log ){
  teleport( log, function( err, log ){
    if( err ) throw err;
    
    console.log( log );
    console.log( logState( log ) );
    var split = splitOn( log, 'world' );
    console.log( split );
    
    var states = split.map( logState );
    console.log( JSON.stringify( states, null, 2 ) );
  });
});