function installSmkOverrides() {
    if ( window._installSmkOverrides ) return
    // console.log('installSmkOverrides')

    SMK.TYPE.Layer[ 'vector' ][ 'leaflet' ].prototype.initLegends = function ( viewer, width, height ) {
        // console.log('initLegends')
        var self = this

        if ( width == null ) width = 30
        if ( height == null ) height = 20

        var mult = ( !!this.config.legend.point + !!this.config.legend.line + !!this.config.legend.fill )

        var cv = $( '<canvas width="' + width * mult + '" height="' + height + '">' ).get( 0 )
        var ctx = cv.getContext( '2d' )

        var styles = [].concat( self.config.style )

        return SMK.UTIL.resolved( 0 )
            .then( drawPoint )
            .then( drawLine )
            .then( drawFill )
            .then( function () {
                return [ {
                    url: cv.toDataURL( 'image/png' ),
                    title: self.config.legend.title || self.config.title,
                    width: width,
                    height: height
                } ]
            } )
            .catch( function( e ) {
                console.log(e)
             })

        function drawPoint( offset ) {
            if ( !self.config.legend.point ) return offset

            return SMK.UTIL.makePromise( function ( res, rej ) {
                if ( styles[ 0 ].markerUrl ) {
                    var img = $( '<img>' )
                        .on( 'load', function () {
                            var r = img.width / img.height
                            if ( r > 1 ) r = 1 / r
                            ctx.drawImage( img, offset + ( width - height * r ) / 2, 0, height * r, height )
                            res( offset + width )
                        } )
                        .on( 'error', res )
                        .attr( 'src', viewer.resolveAttachmentUrl( styles[ 0 ].markerUrl, null, 'png' ) )
                        .get( 0 )
                }
                else {
                    ctx.beginPath()
                    ctx.arc( offset + width / 2, height / 2, styles[ 0 ].strokeWidth / 2, 0, 2 * Math.PI )
                    ctx.lineWidth = 2
                    ctx.strokeStyle = cssColorAsRGBA( styles[ 0 ].strokeColor, styles[ 0 ].strokeOpacity )
                    ctx.fillStyle = cssColorAsRGBA( styles[ 0 ].fillColor, styles[ 0 ].fillOpacity )
                    ctx.fill()
                    ctx.stroke()

                    res( offset + width )
                }
            } )
        }

        function drawLine( offset ) {
            if ( !self.config.legend.line ) return offset

            styles.forEach( function ( st ) {
                ctx.lineWidth = st.strokeWidth
                ctx.strokeStyle = cssColorAsRGBA( st.strokeColor, st.strokeOpacity )
                ctx.lineCap = st.strokeCap
                if ( st.strokeDashes ) {
                    ctx.setLineDash( st.strokeDashes.split( ',' ) )
                    if ( parseFloat( st.strokeDashOffset ) )
                        ctx.lineDashOffset = parseFloat( st.strokeDashOffset )
                }

                ctx.moveTo( offset + width / 2, 0 )
                ctx.lineTo( offset + width / 2, height )

                ctx.moveTo( offset + 0, height / 2 )
                ctx.lineTo( offset + width, height / 2 )

                ctx.stroke()
            } )

            return offset + width
        }

        function drawFill( offset ) {
            if ( !self.config.legend.fill ) return offset

            styles.forEach( function ( st ) {
                // var w = self.config.style.strokeWidth
                // ctx.lineWidth = w
                // ctx.strokeStyle = self.config.style.strokeColor + alpha( self.config.style.strokeOpacity )
                ctx.fillStyle = cssColorAsRGBA( st.fillColor, st.fillOpacity )

                ctx.fillRect( offset, 0, width, height )
                // ctx.strokeRect( w / 2, w / 2, width - w , height - w )
            } )

            return offset + width
        }
    }

    var colorMemo = {}
    function cssColorAsRGBA( color, opacity ) {
        var rgb = colorMemo[ color ]
        if ( !rgb ) {
            var div = $( '<div>' ).appendTo( 'body' ).css( 'background-color', color )
            colorMemo[ color ] = rgb = window.getComputedStyle( div.get( 0 ) ).backgroundColor
            div.remove()
        }

        var s = rgb.split( /\b/ )
        if ( s.length != 8 ) throw new Error( 'can\'t parse: ' + rgb )
        return 'rgba( ' + s[ 2 ] + ',' + s[ 4 ] + ',' + s[ 6 ] + ',' + ( opacity || 1 ) + ')'
    }

    window._installSmkOverrides = true
}