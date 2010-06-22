    (function($) {

        $.JqoogleMap = function(element, options) {


            $.JqoogleMap.defaults = {
                default_zoom: 6,
                initial_geolocation: "Marostica",
                beforeInit: function(){},
                afterInit: function(){}
            };

            $.JqoogleMap.settings = $.extend({}, $.JqoogleMap.defaults, options);
            $.JqoogleMap.map = new GMap2(element, $.JqoogleMap.settings);
            $.JqoogleMap.geocoder = new GClientGeocoder();


            /**
             * Private
             */

            $.JqoogleMap._setCenter = function(values) {

                var zoom  = $.JqoogleMap.settings.default_zoom;
                if(values.zoom) { zoom = values.zoom }

                if(values.point) {
                    $.JqoogleMap.map.setCenter(values.point, zoom);
                } else if (values.address) {
                    $.JqoogleMap.geocoder.getLatLng(values.address, function(point) {
                        $.JqoogleMap.map.setCenter(point, zoom);
                    });
                } else if (values.latitude && values.longitude) {
                    $.JqoogleMap.map.setCenter(new GLatLng(values.latitude, values.longitude), zoom);
                } else {
                    if($.JqoogleMap.settings.default_address) {
                        $.JqoogleMap.geocoder.getLatLng($.JqoogleMap.settings.default_address, function(point) {
                            $.JqoogleMap.map.setCenter(point, zoom);
                        });
                    } else if ($.JqoogleMap.settings.default_latitude && $.JqoogleMap.settings.default_longitude) {
                        $.JqoogleMap.map.setCenter(new GLatLng($.JqoogleMap.settings.default_latitude, $.JqoogleMap.settings.default_longitude), zoom);
                    } else {
                        $.JqoogleMap.geocoder.getLatLng($.JqoogleMap.settings.initial_geolocation, function(point) {
                            $.JqoogleMap.map.setCenter(point, zoom);
                        });
                    }
                }
            }

            $.JqoogleMap._markerBuilder = function(point, options) {
                var marker = new GMarker(point);

                $.JqoogleMap.map.addOverlay(marker);

                if(options.info) {
                    marker.openInfoWindowHtml(options.info);
                }

                if(options.center && options.zoom) {
                    _setCenter({
                        point: point,
                        zoom: options.zoom
                    });
                } else if(options.center) {
                    setCenter({
                        point: point
                    });
                }
            }

            $.JqoogleMap._setMarkerByGeocoding = function(address, options) {
                $.JqoogleMap.geocoder.getLatLng( address, function(point) {
                    $.JqoogleMap._markerBuilder(point, options);
                });
            }

            $.JqoogleMap._setMarkerByLatLng = function(latitude, longitude, options) {
                var point = new GLatLng(latitude, longitude);
                $.JqoogleMap._markerBuilder(point, options);
            }

            $.JqoogleMap._setMarker = function(values, options) {
                if(values.address) {
                    $.JqoogleMap._setMarkerByGeocoding(values.address, options);
                } else if(values.latitude && values.longitude) {
                    $.JqoogleMap._setMarkerByLatLng(values.latitude, values.longitude, options);
                }
            }

            return {
                initializer: function() {


                    $.JqoogleMap._setCenter({
                        //                    point: new GLatLng(37.4419, -122.1419)
                    });

                    $.JqoogleMap.map.setUIToDefault();

                    if($.JqoogleMap.settings.markers) {
                        alert($.JqoogleMap.settings.markers);
                    }


                    return {

                        /**
                         * Public
                         */

                        element: element,

                        //                GMap2: map,

                        addMarker: function(values) {
                            $.JqoogleMap._setMarker(values, values);
                        },

                        setCenter: function(values) {
                            $.JqoogleMap._setCenter(values, values);
                        }

                    }
                }
            }


        }

        $.fn.JqoogleMap = function(options) {


            return this.each(function(){

                var element = $(this);

                if (element.data('JqoogleMap')) {

                    return element;

                } else {

                    var jqoogleMap = new $.JqoogleMap(this, options);
                    element.data('JqoogleMap', jqoogleMap);

                    var obj = jqoogleMap.initializer();

                    $.JqoogleMap.settings.afterInit(obj);

                    return obj;

                }

            });
        };

    })(jQuery);
