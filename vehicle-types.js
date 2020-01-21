( function () {

window.vehicleTypes = []

function addVehicleType( opt, configs ) {
    opt = Object.assign( {
        id: '[missing]',
        image: '[missing]',
        title: '[missing]',
    }, opt )

    opt.configs = configs

    var last = JSON.parse( JSON.stringify( configs[ configs.length - 1] ) )
    last.axles = ( last.axles + 1 ) + '+'
    last.default = false
    last.oversize = true

    opt.configs.push( last )

    window.vehicleTypes.push( opt )
} 

addVehicleType( 
    {
        id: 'straight',
        image: 'images/trucks/truck-straight.svg',
        title: 'Straight Truck',
    },
    [
        {
            default: true,
            axles: 2,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 18200
        },
        {
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 26100
        },
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 34000
        },
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 39200
        }
    ]
)

addVehicleType( 
    {
        id: 'straight-pony-trailer',
        image: 'images/trucks/truck-straight-pony-trailer.svg',
        title: 'Straight Truck and Pony Trailer',
    },
    [
        {
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 27300
        },
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 35200
        },
        {
            default: true,
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 43100
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 50100
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 56200
        },
        {
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 60200
        }
    ]
)

addVehicleType( 
    {
        id: 'straight-full-trailer',
        image: 'images/trucks/truck-straight-full-trailer.svg',
        title: 'Straight Truck and Full Trailer',
    },
    [
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 36400
        },
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 44300
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 52200
        },
        {
            default: true,
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 60100
        },
        {
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 63500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 63500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 25,
            weight: 63500
        }
    ]
)

addVehicleType( 
    {
        id: 'tractor-semi-trailer',
        image: 'images/trucks/truck-tractor-semi-trailer.png',
        title: 'Tractor Semi-Trailer',
    },
    [
        {
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 24200
        },
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 32100
        },
        {
            default: true,
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 23,
            weight: 40000
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 23.5,
            weight: 47000
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 23.5,
            weight: 55300
        },
        {
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 23.5,
            weight: 57100
        }
    ]
)

addVehicleType( 
    {
        id: 'a-train',
        image: 'images/trucks/truck-a-train.svg',
        title: 'A Train (Double Trailer)',
    },
    [
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 38000
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 50300
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            default: true,
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        },
        {
            axles: 11,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 53500
        }
    ]
)

addVehicleType( 
    {
        id: 'b-train',
        image: 'images/trucks/truck-b-train.svg',
        title: 'B Train (Double Trailer)',
    },
    [
        {
            axles: 4,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 38000
        },
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 41200
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 49100
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 57000
        },
        {
            default: true,
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 63500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 63500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 27.5,
            weight: 63500
        }
    ]
)

addVehicleType( 
    {
        id: 'c-train',
        image: 'images/trucks/truck-c-train.svg',
        title: 'C Train (Double Trailer)',
    },
    [
        {
            axles: 5,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 38000
        },
        {
            axles: 6,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 49100
        },
        {
            axles: 7,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 57000
        },
        {
            default: true,
            axles: 8,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        },
        {
            axles: 9,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        },
        {
            axles: 10,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        },
        {
            axles: 11,
            height: 4.15,
            width: 2.6,
            length: 26,
            weight: 60500
        }
    ]
)

addVehicleType( 
    {
        id: 'bus',
        image: 'images/trucks/truck-bus.svg',
        title: 'Bus',
    },
    [
        {
            axles: 2,
            height: 4.15,
            width: 2.6,
            length: 12.5,
            weight: 16350
        },
        {
            default: true,
            axles: 3,
            height: 4.15,
            width: 2.6,
            length: 14,
            weight: 24250
        }
    ]
)

addVehicleType( 
    {
        id: 'other',
        image: 'images/trucks/truck-other.svg',
        title: 'Other',
    },
    [
        {
            default: true,
            axles: 8,
            height: 4.16,
            width: 2.61,
            length: 27.51,
            weight: 63501
        }
    ]
)

} )()
