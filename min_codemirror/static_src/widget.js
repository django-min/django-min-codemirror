// import scss (webpack madness)
import "./scss/widget.scss"

import { EditorView } from "@codemirror/view"


(function () {
    'use strict';

    const widgets_selector = '.codemirror-widget';
    const excludes_selector = '.empty-form ' + widgets_selector;

    const inlines_selector = '.inline-group';
    const stacked_selector = 'fieldset';
    const stacked_entry_cssclass = 'inline-related';
    const tabular_selector = 'tbody';
    const tabular_entry_cssclass = 'form-row';

    dom_ready(init)

    function init() {

        // select form widgets
        const widgets = document.querySelectorAll(widgets_selector);
        init_widgets(widgets);

        // select inlines for observing
        const inlines = document.querySelectorAll(inlines_selector);
        if (inlines.length > 0) {
            for (let i = 0; i < inlines.length; ++i) {
                init_inline(inlines[i]);
            }
        }
    };


    // widget -----------------------------------------------------------------

    function init_widgets(widgets) {
        // create array of widgets in inline empty forms
        if (widgets.length < 1) {
            return
        }
        const excludes = Array.from(
            document.querySelectorAll(excludes_selector)
        );
        for (let i = 0; i < widgets.length; ++i) {
            // only init widgets that arn't in a inline empty form
            if (excludes.indexOf(widgets[i]) < 0) {
                init_widget(widgets[i]);
            }
        }
    };

    function init_widget(el) {
        el._area = el.querySelector('textarea');
    };



    // Inlines ----------------------------------------------------------------

    function init_inline(inline) {
        let wrap;

        // create observer object
        let observer = new MutationObserver(observe_inline);

        // set stacked/tabular selectors/css classes
        if (inline.dataset.inlineType === 'stacked') {
            observer._class = stacked_entry_cssclass;
            wrap = inline.querySelector(stacked_selector);
        } else {
            observer._class = tabular_entry_cssclass;
            wrap = inline.querySelector(tabular_selector);
        }

        // only track direct children changes
        observer.observe(wrap, { childList: true });
    };

    function observe_inline(mutations, observer) {
        let i, j, mutation, node;
        for (i = 0; i < mutations.length; i++) {

            // bail out if the mutation is something else than a child node
            if (mutations[i].type != 'childList') {
                continue;
            }

            for (j = 0; j < mutations[i].addedNodes.length; j++) {
                node = mutations[i].addedNodes[j];
                // only init the widgets if the added child is an inline entry
                if (node.classList.contains(observer._class)) {
                    init_widgets(node.querySelectorAll(widgets_selector));
                }
            }
        }
    };

    // Utilities --------------------------------------------------------------

    function dom_ready(callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };
})();