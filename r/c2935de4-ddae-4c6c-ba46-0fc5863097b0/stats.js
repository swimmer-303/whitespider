/**
 * @author mrdoob / http://mrdoob.com/
 */

'use strict';

class Stats {

  constructor() {

    this.startTime = Date.now();
    this.prevTime = this.startTime;
    this.ms = 0;
    this.msMin = 1000;
    this.msMax = 0;
    this.fps = 0;
    this.fpsMin = 1000;
    this.fpsMax = 0;
    this.frames = 0;
    this.mode = 0;

    this.container = document.createElement( 'div' );
    this.container.id = 'stats';
    this.container.addEventListener( 'mousedown', () => {
      this.event.preventDefault();
      this.setMode( ++ this.mode % 2 );
    }, false );
    this.container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

    this.fpsDiv = document.createElement( 'div' );
    this.fpsDiv.id = 'fps';
    this.fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
    this.container.appendChild( this.fpsDiv );

    this.fpsText = document.createElement( 'div' );
    this.fpsText.id = 'fpsText';
    this.fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
    this.fpsText.innerHTML = 'FPS';
    this.fpsDiv.appendChild( this.fpsText );

    this.fpsGraph = document.createElement( 'div' );
    this.fpsGraph.id = 'fpsGraph';
    this.fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
    this.fpsDiv.appendChild( this.fpsGraph );

    while ( this.fpsGraph.children.length < 74 ) {

      const bar = document.createElement( 'span' );
      bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
      this.fpsGraph.appendChild( bar );

    }

    this.msDiv = document.createElement( 'div' );
    this.msDiv.id = 'ms';
    this.msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
    this.container.appendChild( this.msDiv );

    this.msText = document.createElement( 'div' );
    this.msText.id = 'msText';
    this.msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
    this.msText.innerHTML = 'MS';
    this.msDiv.appendChild( this.msText );

    this.msGraph = document.createElement( 'div' );
    this.msGraph.id = 'msGraph';
    this.msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
    this.msDiv.appendChild( this.msGraph );

    while ( this.msGraph.children.length < 74 ) {

      const bar = document.createElement( 'span' );
      bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
      this.msGraph.appendChild( bar );

    }

    this.setMode = ( value ) => {

      this.mode = value;

      switch ( this.mode ) {

        case 0:
          this.fpsDiv.style.display = 'block';
          this.msDiv.style.display = 'none';
          break;
        case 1:
          this.fpsDiv.style.display = 'none';
          this.msDiv.style.display = 'block';
          break;
      }

    }

    this.updateGraph = ( dom, value ) => {

      const child = dom.appendChild( dom.firstChild );
      child.style.height = value + 'px';

    }

  }

  get event() {

    return window.event || {};

  }

  get domElement() {

    return this.container;

  }

  begin() {

    this.startTime = Date.now();

  }

  end() {

    const time = Date.now();

    this.ms = time - this.startTime;
    this.msMin = Math.min( this.msMin, this.ms );
    this.msMax = Math.max( this.msMax, this.ms );

    this.msText.textContent = this.ms + ' MS (' + this.msMin + '-' + this.msMax + ')';

    return time;

  }

  update() {

    this.startTime = this.end();
    requestAnimationFrame( () => this.update() );

  }

}
