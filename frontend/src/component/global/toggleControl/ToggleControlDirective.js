export default class ToggleControlDirective {
    constructor() {
        this.restrict = 'A';
        this.link = function (scope, element, attrs) {
            let active = false;
            let targetElement;
            let toggleButtonElement;
            let toggleHideClass = 'hide';
            let toggleButtonClass = 'isActive';
            
            let setClassesAndAttributes = (isActive) => {
                if (isActive) {
                    targetElement.removeClass(toggleHideClass)
                    targetElement.attr('aria-expanded', true);
                    if (toggleButtonElement) {
                        toggleButtonElement.addClass(toggleButtonClass);
                    }
                } else {
                    targetElement.addClass(toggleHideClass);
                    targetElement.attr('aria-expanded', false);
                    if (toggleButtonElement) {
                        toggleButtonElement.removeClass(toggleButtonClass);
                    }
                }
            }

            element.attr('aria-controls', attrs.toggleControl);

            if (attrs.toggleControlActive === 'true') {
                active = true;
            }

            angular.element(document).ready(function () {

                // Assign target element and an optional toggle button element
                targetElement = angular.element(document.querySelector(`#${attrs.toggleControl}`));
                if (attrs.toggleControlButton) {
                    toggleButtonElement = angular.element(document.querySelector(`#${attrs.toggleControlButton}`));
                }

                // Initialize current accordion state with all data in place
                setClassesAndAttributes(active);
                
                element.bind('click', function () {
                    active = !active;
                    setClassesAndAttributes(active);
                });
            });

        };
    }
}

ToggleControlDirective.$inject = [];
