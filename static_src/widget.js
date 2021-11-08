// import scss (webpack madness)
import "./scss/widget.scss"

import { EditorState, basicSetup } from "@codemirror/basic-setup"
import { EditorView, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

// language support
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"


(function () {
    'use strict';

    const widgets_selector = '.codemirror-widget'
    const excludes_selector = '.empty-form ' + widgets_selector

    const inlines_selector = '.inline-group'
    const stacked_selector = 'fieldset'
    const stacked_entry_cssclass = 'inline-related'
    const tabular_selector = 'tbody'
    const tabular_entry_cssclass = 'form-row'

    const code_languages = {
        css: css,
        js: javascript,
        javascript: javascript,
        json: json,
        html: html
    }

    dom_ready(init)

    function init() {

        // select form widgets incl. inlines already present
        const widgets = document.querySelectorAll(widgets_selector)
        init_widgets(widgets)

        // select inlines for observing
        const inlines = document.querySelectorAll(inlines_selector)
        if (inlines.length > 0) {
            for (let i = 0; i < inlines.length; ++i) {
                init_inline(inlines[i])
            }
        }
    }


    // widget -----------------------------------------------------------------

    function init_widgets(widgets) {

        // stop if no widget
        if (widgets.length < 1) {
            return
        }

        // create array of widgets in inline empty forms
        const excludes = Array.from(
            document.querySelectorAll(excludes_selector)
        )

        // init widgets
        for (let i = 0; i < widgets.length; ++i) {
            // only init widgets that arn't in a inline empty form
            if (excludes.indexOf(widgets[i]) < 0) {
                init_widget(widgets[i])
            }
        }
    }

    function init_widget(el) {
        el._area = el.querySelector('textarea')
        el._view = el.querySelector('.view')

        // init codemirror
        el._editor = new EditorView({
            parent: el._view,
            state: EditorState.create({
                doc: el._area.value,
                extensions: [
                    basicSetup,
                    keymap.of([indentWithTab]),
                    get_lang_form_element(el)
                ]
            }),
        })

        // sync edited input back to the textarea on form submit
        el._area.form.addEventListener("submit", () => {
            el._area.value = el._editor.state.doc.toString()
        })
    }

    function get_lang_form_element(el) {
        const lang = el.dataset.code_language || 'html';
        const extension = code_languages[lang]
        return extension ? extension() : html()
    }

    // Inlines ----------------------------------------------------------------

    function init_inline(inline) {
        let wrap

        // create observer object
        let observer = new MutationObserver(observe_inline)

        // set stacked/tabular selectors/css classes
        if (inline.dataset.inlineType === 'stacked') {
            observer._class = stacked_entry_cssclass
            wrap = inline.querySelector(stacked_selector)
        } else {
            observer._class = tabular_entry_cssclass
            wrap = inline.querySelector(tabular_selector)
        }

        // only track direct children changes
        observer.observe(wrap, { childList: true })
    };

    function observe_inline(mutations, observer) {
        let i, j, mutation, node
        for (i = 0; i < mutations.length; i++) {

            // go to next if the mutation is something else than a child node
            if (mutations[i].type != 'childList') {
                continue
            }

            for (j = 0; j < mutations[i].addedNodes.length; j++) {
                node = mutations[i].addedNodes[j];
                // only init the widgets if the added child is an inline entry
                if (node.classList.contains(observer._class)) {
                    init_widgets(node.querySelectorAll(widgets_selector))
                }
            }
        }
    };

    // Utilities --------------------------------------------------------------

    function dom_ready(callback) {
        if (document.readyState != 'loading') {
            callback()
        } else {
            document.addEventListener('DOMContentLoaded', callback)
        }
    };
})();