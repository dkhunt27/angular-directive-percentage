/**
 * Heavily adapted from
 * https://github.com/fiestah/angular-money-directive
 * http://www.chroder.com/2014/02/01/using-ngmodelcontroller-with-custom-directives/
 */

angular.module('angular-directive-percentage', [])
  .directive('percentage', function () {
        'use strict';

        var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
        var PRECISION_MIN = 2;
        var PRECISION_DEFAULT = 4;
        var MIN_DEFAULT = 0;
        var MAX_DEFAULT = Infinity;
        var DEBUG = false;

        function link(scope, el, attrs, ngModelCtrl) {
            var precision = PRECISION_DEFAULT;
            var min = MIN_DEFAULT;
            var max = MAX_DEFAULT;

            var isValidNumber = function (value) {

                if (ngModelCtrl.$isEmpty(value)) {
                    return true;
                } else {
                    return NUMBER_REGEXP.test(value);
                }
            };

            var roundToPrecision = function (value, precision) {
                var d = Math.pow(10, precision);
                return Math.round(value * d) / d;
            };

            var formatToPrecision = function (value, precision) {
                precision = precision - 2;
                if (precision < 0) {
                    precision = 0;
                }
                return parseFloat(value).toFixed(precision);
            };

            var formatViewDataIntoModelData = function (viewValue) {

                var parsedValue = "";

                if (ngModelCtrl.$isEmpty(viewValue)) {
                    // handle empty view data since we can't covert it back to a decimal
                    parsedValue = "";
                } else {

                    // handle formatting
                    //if (viewValue.slice(-1) === "%") {
                    //  viewValue = viewValue.slice(0, -1);
                    //}

                    // check for non numeric
                    var valid = isValidNumber(viewValue);

                    if (!valid) {
                        viewValue = '';
                        ngModelCtrl.$setValidity('percentage', false);
                    }

                    if (valid) {
                        // convert percentage back to decimal
                        viewValue = viewValue / 100;
                    }

                    if (valid) {
                        // handle precision
                        if (precision > -1) {
                            viewValue = roundToPrecision(viewValue, precision);
                        }
                    }

                    parsedValue = viewValue;
                }

                return parsedValue;
            };

            var formatModelDataIntoViewData = function (modelValue) {

                var formattedValue = "";

                // check if valid (one of the validators could have set to be invalid already)
                if (ngModelCtrl.$valid) {

                    // handle empty view data
                    if (ngModelCtrl.$isEmpty(modelValue)) {
                        formattedValue = "";
                    } else {

                        // handle non numeric
                        var valid = isValidNumber(modelValue);

                        if (!valid) {
                            modelValue = '';
                            ngModelCtrl.$setValidity('percentage', false);
                        }

                        if (valid) {
                            // convert decimal into percentage
                            modelValue = modelValue * 100;


                            // handle precision
                            if (precision > -1) {
                                modelValue = roundToPrecision(modelValue, precision);
                                modelValue = formatToPrecision(modelValue, precision);
                            }
                        }

                        // handle formatting
                        //formattedValue = modelValue.toString() + "%";
                        formattedValue = modelValue.toString();
                    }
                }

                return formattedValue;
            };

            var minValidator = function (value) {
                if (!ngModelCtrl.$isEmpty(value) && value < min) {
                    ngModelCtrl.$setValidity('min', false);
                    return value;
                } else {
                    return value;
                }
            };

            var maxValidator = function (value) {
                if (!ngModelCtrl.$isEmpty(value) && value > max) {
                    ngModelCtrl.$setValidity('max', false);
                    return value;
                } else {
                    return value;
                }
            };

            var addParsers = function (ngModelCtrl, attrs) {

                // when the view data changes, the code executes the parses in order that they are added to the stack
                // so add them in order that you want them to execute...use push

                // EXECUTE 1st (START)
                // reset the validity whenever the view data changes
                ngModelCtrl.$parsers.push(function (viewValue) {
                    ngModelCtrl.$setValidity('min', true);
                    ngModelCtrl.$setValidity('max', true);
                    ngModelCtrl.$setValidity('percentage', true);
                    var newModelData = viewValue;
                    if (DEBUG) { console.log("ngModelCtrl.$parsers $setValidity newModelData:" + newModelData); }
                    return newModelData;
                });

                // EXECUTE 2nd
                // perform min validation whenever the view data changes
                ngModelCtrl.$parsers.push(function (viewValue) {
                    var newModelData = minValidator(viewValue);
                    if (DEBUG) { console.log("ngModelCtrl.$parsers minValidator newModelData:" + newModelData); }
                    return newModelData;
                });

                // EXECUTE 3rd (if attribute present)
                // Max validation (optional)
                if (angular.isDefined(attrs.max)) {
                    // perform max validation whenever the view data changes
                    ngModelCtrl.$parsers.push(function (viewValue) {
                        var newModelData = maxValidator(viewValue);
                        if (DEBUG) { console.log("ngModelCtrl.$parsers maxValidator newModelData:" + newModelData); }
                        return newModelData;
                    });
                }

                // EXECUTE 4th (LAST)
                // perform specific formatting for the data
                ngModelCtrl.$parsers.push(function (viewValue) {
                    var newModelData = formatViewDataIntoModelData(viewValue);
                    if (DEBUG) { console.log("ngModelCtrl.$parsers formatViewDataIntoModelData newModelData:" + newModelData); }
                    return newModelData;
                });

            };

            var addFormatters = function (ngModelCtrl, attrs) {

                // when the model data changes, the code executes the formatters in reverse order that they are added to the stack
                // so add them in reverse order that you want them to execute...use unshift instead of push

                // EXECUTE 1st (START)
                // reset the validity whenever the model data changes
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    ngModelCtrl.$setValidity('percentage', true);
                    var newViewData = modelValue;
                    if (DEBUG) { console.log("ngModelCtrl.$formatters $setValidity newViewData:" + newViewData); }
                    return newViewData;
                });

                // EXECUTE 2nd
                // perform min validation whenever the model data changes
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    var newViewData = minValidator(modelValue);
                    if (DEBUG) { console.log("ngModelCtrl.$formatters minValidator newViewData:" + newViewData); }
                    return newViewData;
                });

                // EXECUTE 3rd (if attribute present)
                // Max validation (optional)
                if (angular.isDefined(attrs.max)) {
                    // perform max validation whenever the model data changes
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        var newViewData = maxValidator(modelValue);
                        if (DEBUG) { console.log("ngModelCtrl.$formatters maxValidator newViewData:" + newViewData); }
                        return newViewData;
                    });
                }

                // EXECUTE 4th (LAST)
                // perform specific formatting for the model (parser) or view (formatter)
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    var newViewData = formatModelDataIntoViewData(modelValue);
                    if (DEBUG) { console.log("ngModelCtrl.$formatters formatModelDataIntoViewData newViewData:" + newViewData); }
                    return newViewData;
                });
            };

            // when the view model changes, the code executes the parses in order that they are added to the stack
            // so add them in order that you want them to execute

            // parsers execute whenever the view data changes
            // then process that data into the model data
            addParsers(ngModelCtrl, attrs);


            // formatters execute whenever the model data changes
            // then process that data into the view data
            addFormatters(ngModelCtrl, attrs);

            // Auto-format on blur
            el.bind('blur', function () {
                var viewValue;

                // since the view data has changed...the parseViewToModel has already ran and updated the $modelValue
                if (ngModelCtrl.$valid) {
                    // if the data is valid, run the formatter to update the $viewValue
                    var modelValue = ngModelCtrl.$modelValue;
                    viewValue = formatModelDataIntoViewData(modelValue);
                    ngModelCtrl.$setViewValue(viewValue);
                    if (DEBUG) { console.log("ngModelCtrl.onBlur updated-viewValue:" + viewValue); }
                    ngModelCtrl.$render();   // forces the DOM to update
                } else {
                    viewValue = ngModelCtrl.$viewValue;
                    if (DEBUG) { console.log("ngModelCtrl.onBlur current-viewValue:" + viewValue); }
                }
            });

            attrs.$observe('precision', function (value) {
                var parsed = parseFloat(value);
                if (isNaN(parsed)) {
                    parsed = PRECISION_DEFAULT;
                } else if (parsed < 0) {
                    // special case to disable parsing
                } else if (parsed < PRECISION_MIN) {
                    parsed = PRECISION_MIN;
                }

                precision = parsed;
            });

            attrs.$observe('min', function (value) {
                var parsed = parseFloat(value);
                min = !isNaN(parsed) ? parsed : MIN_DEFAULT;
            });

            // Max validation (optional)
            if (angular.isDefined(attrs.max)) {
                attrs.$observe('max', function (value) {
                    var parsed = parseFloat(value);
                    max = parsed;
                });
            }
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }
);
